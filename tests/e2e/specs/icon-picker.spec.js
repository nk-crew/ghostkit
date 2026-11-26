import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test.describe('icon picker', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deleteAllPosts();
	});

	test('editor variables carry icon pack names, not the icons', async ({
		page,
		admin,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });

		const icons = await page.evaluate(() => window.ghostkitVariables.icons);

		expect(icons['font-awesome']).toEqual({ name: 'FontAwesome' });
		expect(JSON.stringify(icons).length).toBeLessThan(2000);
	});

	test('loads icons on open, filters them and sets the picked icon', async ({
		page,
		admin,
		editor,
	}) => {
		const errors = [];
		page.on('console', (message) => {
			if (message.type() === 'error') {
				errors.push(message.text());
			}
		});

		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({ name: 'ghostkit/icon-box' });
		await editor.openDocumentSettingsSidebar();

		const iconsResponse = page.waitForResponse((response) =>
			response.url().includes('get_icons')
		);

		await page
			.locator(
				'.block-editor-block-inspector .ghostkit-component-icon-picker-toggle'
			)
			.click();

		expect((await iconsResponse).status()).toBe(200);

		const popover = page.locator('.ghostkit-component-icon-picker-content');
		const iconButtons = popover.getByRole('listbox').getByRole('option');

		await expect(iconButtons.first()).toBeVisible();

		// Only the rows near the visible area are mounted.
		expect(await iconButtons.count()).toBeLessThan(200);

		await popover.getByRole('searchbox').fill('instagram');

		// Ghost Kit Pro adds icon packs with more matches, so pick the FontAwesome ones.
		const fontAwesomeButtons = iconButtons.filter({
			has: page.locator('.ghostkit-svg-icon-fa'),
		});
		await expect(fontAwesomeButtons).toHaveCount(2);

		await fontAwesomeButtons.first().click();

		const icon = await page.evaluate(() => {
			const block = window.wp.data
				.select('core/block-editor')
				.getSelectedBlock();

			return decodeURIComponent(block.attributes.icon);
		});

		expect(icon).toContain('ghostkit-svg-icon-fa');
		expect(icon).toContain('viewBox="0 0 448 512"');

		expect(errors.filter((text) => /findDOMNode/.test(text))).toEqual([]);
	});

	test('picks an icon with the keyboard and closes with Escape', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({ name: 'ghostkit/icon-box' });
		await editor.openDocumentSettingsSidebar();

		const toggle = page.locator(
			'.block-editor-block-inspector .ghostkit-component-icon-picker-toggle'
		);
		await toggle.click();

		const popover = page.locator('.ghostkit-component-icon-picker-content');
		const search = popover.getByRole('searchbox');

		await expect(search).toBeFocused();
		await search.fill('arrow-right');
		await expect(
			popover.getByRole('listbox').getByRole('option').first()
		).toBeVisible();

		await page.keyboard.press('ArrowDown');
		await expect(
			popover.getByRole('listbox').getByRole('option').first()
		).toBeFocused();

		await page.keyboard.press('ArrowRight');
		const second = popover.getByRole('listbox').getByRole('option').nth(1);
		await expect(second).toBeFocused();
		const secondName = await second.getAttribute('aria-label');

		await page.keyboard.press('Enter');
		await expect(second).toHaveAttribute('aria-selected', 'true');
		await expect(
			popover.locator('.ghostkit-component-icon-picker-current')
		).toHaveText(secondName);

		const icon = await page.evaluate(() =>
			decodeURIComponent(
				window.wp.data.select('core/block-editor').getSelectedBlock()
					.attributes.icon
			)
		);
		expect(icon).toContain('<svg');

		// Typing in the grid goes back to the search field.
		await page.keyboard.press('Home');
		await page.keyboard.type('s');
		await expect(search).toBeFocused();
		await expect(search).toHaveValue('arrow-rights');

		// The first Escape clears the search, the second closes the picker.
		await page.keyboard.press('Escape');
		await expect(search).toHaveValue('');
		await page.keyboard.press('Escape');
		await expect(popover).toBeHidden();
		await expect(toggle).toBeFocused();
	});

	test('shows a picked icon under Recent in the next editor session', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({ name: 'ghostkit/icon-box' });
		await editor.openDocumentSettingsSidebar();

		const toggle = page.locator(
			'.block-editor-block-inspector .ghostkit-component-icon-picker-toggle'
		);
		const popover = page.locator('.ghostkit-component-icon-picker-content');

		await toggle.click();
		await popover.getByRole('searchbox').fill('dragon');

		const option = popover.getByRole('listbox').getByRole('option').first();
		const name = await option.getAttribute('aria-label');

		// Core saves preferences to the user meta with a debounce.
		const saved = page.waitForResponse(
			(response) =>
				/users(\/|%2F)me/.test(response.url()) &&
				response.request().method() !== 'GET'
		);
		await option.click();
		expect((await saved).ok()).toBe(true);

		// Drop the local copy so the next editor load reads the user meta.
		await page.evaluate(() => window.localStorage.clear());
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({ name: 'ghostkit/icon-box' });
		await editor.openDocumentSettingsSidebar();
		await toggle.click();

		const recent = popover.locator(
			'.ghostkit-component-icon-picker-heading',
			{ hasText: 'Recent' }
		);
		await expect(recent.first()).toBeVisible();
		await expect(
			popover.getByRole('listbox').getByRole('option').first()
		).toHaveAttribute('aria-label', name);
	});

	test('shows the selected icon far down the list and reaches it with Tab', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });

		const lastIcon = await page.evaluate(async () => {
			const result = await window.wp.apiFetch({
				path: '/ghostkit/v1/get_icons/',
			});
			const icons = result.response['font-awesome'].icons;

			return icons[icons.length - 1].svg;
		});

		await editor.insertBlock({
			name: 'ghostkit/icon-box',
			attributes: { icon: encodeURIComponent(lastIcon) },
		});
		await editor.openDocumentSettingsSidebar();
		await page
			.locator(
				'.block-editor-block-inspector .ghostkit-component-icon-picker-toggle'
			)
			.click();

		const popover = page.locator('.ghostkit-component-icon-picker-content');
		const search = popover.getByRole('searchbox');
		const selected = popover
			.getByRole('listbox')
			.getByRole('option', { selected: true });

		// Tab from the search field moves through the pack filter into the grid.
		async function tabToGrid() {
			await search.focus();

			for (let i = 0; i < 4; i += 1) {
				await page.keyboard.press('Tab');

				const role = await page.evaluate(() =>
					document.activeElement.getAttribute('role')
				);

				if (role === 'option') {
					return;
				}
			}
		}

		await expect(selected).toBeInViewport();
		await tabToGrid();
		await expect(selected).toBeFocused();

		// Scrolled away, the selected option unmounts and a mounted one takes the tab stop.
		await popover
			.locator('.ghostkit-component-icon-picker-grid')
			.evaluate((node) => {
				node.scrollTop = 0;
			});
		await expect(selected).toHaveCount(0);
		await tabToGrid();
		await expect(
			popover.getByRole('listbox').getByRole('option').first()
		).toBeFocused();
	});

	test('keeps the picked one of two icons with the same name in Recent', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({ name: 'ghostkit/icon-box' });
		await editor.openDocumentSettingsSidebar();

		const toggle = page.locator(
			'.block-editor-block-inspector .ghostkit-component-icon-picker-toggle'
		);
		const popover = page.locator('.ghostkit-component-icon-picker-content');

		await toggle.click();
		await popover.getByRole('searchbox').fill('bell');

		// FontAwesome has a solid and a regular icon with the keys `bell`.
		// Ghost Kit Pro adds packs with more of them, so keep the FontAwesome ones.
		const bells = popover
			.getByRole('listbox')
			.getByRole('option', { name: 'Bell', exact: true })
			.filter({ has: page.locator('.ghostkit-svg-icon-fa') });
		await expect(bells).toHaveCount(2);
		await bells.nth(1).click();
		await expect(bells.nth(1)).toHaveAttribute('aria-selected', 'true');

		await page.keyboard.press('Escape');
		await expect(popover).toBeHidden();
		await toggle.click();

		await expect(
			popover.locator('.ghostkit-component-icon-picker-heading', {
				hasText: 'Recent',
			})
		).toHaveCount(2);
		await expect(
			popover.getByRole('listbox').getByRole('option').first()
		).toHaveAttribute('aria-selected', 'true');
	});

	test('keeps icons in view and scrolls the content on a short screen', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({ name: 'ghostkit/icon-box' });
		await editor.openDocumentSettingsSidebar();
		await page.setViewportSize({ width: 1280, height: 320 });

		await page
			.locator(
				'.block-editor-block-inspector .ghostkit-component-icon-picker-toggle'
			)
			.click();

		const popover = page.locator('.ghostkit-component-icon-picker-content');

		await popover.getByRole('button', { name: 'Custom SVG' }).click();

		const textarea = popover.getByRole('textbox', { name: 'Icon Output' });
		await expect(textarea).toBeAttached();

		// The grid keeps at least a row of icons instead of collapsing to nothing.
		await expect(
			popover.getByRole('listbox').getByRole('option').first()
		).toBeInViewport({
			ratio: 1,
		});

		// Wheel over the footer, the way a user reaches the hidden part.
		const footer = await popover
			.locator('.ghostkit-component-icon-picker-current')
			.boundingBox();
		await page.mouse.move(
			footer.x + footer.width / 2,
			footer.y + footer.height / 2
		);
		await page.mouse.wheel(0, 1000);
		await expect(textarea).toBeInViewport({ ratio: 0.95 });
	});

	test('class name icons saved by old versions render as SVG in the canvas', async ({
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({
			name: 'ghostkit/icon-box',
			attributes: { icon: 'fa-brands fa-instagram' },
		});

		await expect(
			editor.canvas.locator(
				'.ghostkit-icon-box-icon svg.ghostkit-svg-icon-fa'
			)
		).toBeVisible();
	});
});

test.describe('standalone Icon transition', () => {
	test.beforeAll(async ({ requestUtils }) => {
		await requestUtils.activatePlugin(
			process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit'
		);
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deleteAllPosts();
	});

	test('keeps saved icon markup and a new icon editable', async ({
		admin,
		editor,
		page,
		requestUtils,
	}) => {
		const strokeSvg =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"></circle></svg>';
		const attrs = {
			icon: encodeURIComponent(strokeSvg),
			url: '#details',
			target: '_blank',
			rel: 'noopener noreferrer',
			ariaLabel: 'More details',
			backgroundGradient: 'linear-gradient(90deg, #f00, #00f)',
			ghostkit: {
				id: 'saved-icon',
				styles: {
					'_u002d__u002d_gkt-icon__background': encodeURIComponent(
						'linear-gradient(90deg, #f00, #00f)'
					),
					'_u002d__u002d_gkt-icon__width': '50px',
				},
			},
			className: 'ghostkit-custom-saved-icon',
		};
		const post = await requestUtils.createPost({
			title: 'Saved standalone icons',
			content: `<!-- wp:ghostkit/icon ${JSON.stringify(attrs)} -->
<div class="wp-block-ghostkit-icon ghostkit-icon ghostkit-custom-saved-icon"><a href="#details" target="_blank" rel="noopener noreferrer" ariaLabel="More details" class="ghostkit-icon-inner">${strokeSvg}</a></div>
<!-- /wp:ghostkit/icon -->

<!-- wp:ghostkit/icon {"icon":"fa-brands fa-instagram"} -->
<div class="wp-block-ghostkit-icon ghostkit-icon"><div class="ghostkit-icon-inner"><span class="fa-brands fa-instagram"></span></div></div>
<!-- /wp:ghostkit/icon -->`,
			status: 'publish',
		});
		await page.goto(post.link);
		const link = page.getByRole('link', { name: 'More details' });
		await expect(link).toHaveAttribute('href', '#details');
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		await expect(link.locator('svg')).toHaveAttribute(
			'stroke',
			'currentColor'
		);
		await expect(link.locator('circle')).toHaveAttribute('r', '8');
		await expect(link).toHaveCSS('background-image', /^linear-gradient/);
		await expect(page.locator('.ghostkit-icon .fa-instagram')).toHaveCount(
			1
		);

		await page.goto(`/wp-admin/post.php?post=${post.id}&action=edit`);
		await expect(editor.canvas.locator('.ghostkit-icon svg')).toHaveCount(
			2
		);
		expect(
			await page.evaluate(() => {
				const { getBlocks, getBlockTransformItems } =
					window.wp.data.select('core/block-editor');
				return getBlocks().map((block) => ({
					valid: block.isValid,
					native: getBlockTransformItems([block]).some(
						({ name }) => name === 'core/icon'
					),
				}));
			})
		).toEqual([
			{ valid: true, native: false },
			{ valid: true, native: false },
		]);

		await admin.createNewPost({ showWelcomeGuide: false });
		const availability = await page.evaluate(() => {
			const { createBlock, getBlockType, switchToBlockType } =
				window.wp.blocks;
			const store = window.wp.data.select('core/block-editor');
			return {
				native: !!getBlockType('core/icon'),
				imageToCover: switchToBlockType(
					createBlock('core/image', {
						url: 'https://example.com/cover.png',
					}),
					'core/cover'
				)?.[0]?.attributes.url,
				description: getBlockType('ghostkit/icon').description,
				inserter: store
					.getInserterItems()
					.some(({ name }) => name === 'ghostkit/icon'),
				incoming:
					!!getBlockType('core/icon') &&
					store
						.getBlockTransformItems([createBlock('core/icon')])
						.some(({ name }) => name === 'ghostkit/icon'),
			};
		});
		expect(availability.inserter).toBe(true);
		expect(availability.imageToCover).toBe('https://example.com/cover.png');
		expect(availability.incoming).toBe(false);
		expect(availability.description).toBe(
			availability.native
				? 'Deprecated. Use the WordPress Icon block for new content.'
				: 'Insert SVG icons'
		);
		await editor.insertBlock({ name: 'ghostkit/icon' });
		await editor.openDocumentSettingsSidebar();
		const notice = page
			.locator('.block-editor-block-inspector')
			.getByText(
				'Use the block toolbar to convert compatible Ghost Kit icons to the WordPress Icon block.',
				{ exact: true }
			)
			.filter({ visible: true });
		await expect(notice).toHaveCount(availability.native ? 1 : 0);
		if (availability.native) {
			await page.evaluate(() =>
				window.wp.data
					.dispatch('core/preferences')
					.set('core', 'hiddenBlockTypes', ['core/icon'])
			);
			await expect(notice).toHaveCount(0);
			await page.evaluate(() =>
				window.wp.data
					.dispatch('core/preferences')
					.set('core', 'hiddenBlockTypes', [])
			);
			await expect(notice).toHaveCount(1);
		}
		await expect(
			page.locator(
				'.block-editor-block-inspector .ghostkit-component-icon-picker-toggle'
			)
		).toBeEnabled();
		await expect(editor.canvas.locator('.ghostkit-icon svg')).toBeVisible();
	});

	test('converts only registry equivalents and keeps their output after reopening', async ({
		admin,
		editor,
		page,
	}) => {
		await admin.createNewPost({
			title: 'Standalone icon conversion',
			showWelcomeGuide: false,
		});
		const native = await page.evaluate(async () => {
			const type = window.wp.blocks.getBlockType('core/icon');
			if (!type) {
				return null;
			}
			const icon = await window.wp.data
				.resolveSelect('core')
				.getEntityRecord('root', 'icon', 'core/plus');
			const svg = new DOMParser().parseFromString(
				icon.content,
				'image/svg+xml'
			).documentElement;
			svg.setAttribute('fill', 'currentColor');
			return {
				icon: encodeURIComponent(svg.outerHTML),
				path: svg.querySelector('path').getAttribute('d'),
				flip: !!type.attributes.flipHorizontal,
			};
		});
		test.skip(!native, 'WordPress does not register the native Icon');

		await editor.insertBlock({
			name: 'ghostkit/icon',
			attributes: {
				icon: native.icon,
				width: '2rem',
				color: '#123456',
				backgroundColor: '#fedcba',
				ariaLabel: 'Add item',
				anchor: 'add-item',
				flipH: native.flip,
			},
		});
		const transformMenu = await page.evaluate(() => {
			const { getBlocks, getBlockTransformItems } =
				window.wp.data.select('core/block-editor');
			const { cloneBlock } = window.wp.blocks;
			const [block] = getBlocks();
			const overrides = [
				{},
				{ icon: '%3Csvg%3E' },
				{ icon: block.attributes.icon.replace('12.5', '12.6') },
				{ url: '#details' },
				{ backgroundGradient: 'linear-gradient(red, blue)' },
				{ ghostkit: { customCSS: 'color: red' } },
				{ justify: 'end' },
				{ width: '75%' },
				{ width: '4vw', ghostkit: undefined, className: undefined },
				{ width: '4vh', ghostkit: undefined, className: undefined },
				{ flipV: true },
			];
			return overrides.map((attrs) =>
				getBlockTransformItems([cloneBlock(block, attrs)]).some(
					({ name }) => name === 'core/icon'
				)
			);
		});
		expect(transformMenu).toEqual([
			true,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			true,
			true,
			native.flip,
		]);
		await page.locator('.block-editor-block-switcher button').click();
		await page
			.locator(
				'.block-editor-block-switcher__popover .editor-block-list-item-icon'
			)
			.click();

		const postId = await editor.publishPost();
		await page.goto(`/?p=${postId}`);
		const svg = page.locator('.wp-block-icon.aligncenter#add-item svg');
		await expect(svg).toHaveAttribute('aria-label', 'Add item');
		await expect(svg).toHaveCSS('width', '32px');
		await expect(svg).toHaveCSS('color', 'rgb(18, 52, 86)');
		await expect(svg).toHaveCSS('background-color', 'rgb(254, 220, 186)');
		await expect(svg.locator('path')).toHaveAttribute('d', native.path);
		if (native.flip) {
			await expect(svg).toHaveClass(/is-flip-horizontal/);
		}
		await page.goto(`/wp-admin/post.php?post=${postId}&action=edit`);
		await expect(
			editor.canvas.locator('.wp-block-icon svg path')
		).toHaveAttribute('d', native.path);
		await expect(editor.canvas.locator('.ghostkit-icon')).toHaveCount(0);
	});
});
