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
