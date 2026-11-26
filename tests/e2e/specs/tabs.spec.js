import { expect, test } from '@wordpress/e2e-test-utils-playwright';

function savedTabs(prefix, legacy = false) {
	const tabs = ['First', 'Second'].map((title, index) => ({
		title,
		slug: `${prefix}-${index + 1}`,
	}));
	const [first] = tabs;
	const attrs = {
		tabActive: first.slug,
		tabsData: tabs,
		...(legacy && { trigger: 'hover', buttonsVerticalAlign: true }),
	};
	const buttons = tabs
		.map(({ title, slug }, index) =>
			legacy
				? `<a href="#${slug}" class="ghostkit-tabs-buttons-item">${title}</a>`
				: `<button id="${slug}-button" class="ghostkit-tabs-buttons-item${index === 0 ? ' ghostkit-tabs-buttons-item-active' : ''}" type="button" role="tab" data-tab="${slug}" aria-controls="${slug}-content"${index === 0 ? ' aria-selected="true"' : ''}>${title}</button>`
		)
		.join('');
	const panels = tabs
		.map(({ title, slug }, index) => {
			const anchor = `${slug}-content`;
			const attributes = {
				slug,
				anchor,
				...(!legacy && index === 0 && { active: true }),
			};
			const active = !legacy && index === 0 ? ' ghostkit-tab-active' : '';
			const accessibility = legacy
				? ''
				: ` tabindex="0" role="tabpanel" aria-labelledby="${slug}-button"`;
			return `<!-- wp:ghostkit/tabs-tab-v2 ${JSON.stringify(attributes)} -->
<div class="wp-block-ghostkit-tabs-tab-v2 ghostkit-tab${active}" id="${anchor}"${accessibility} data-tab="${slug}"><!-- wp:paragraph -->
<p>${title} content</p>
<!-- /wp:paragraph --></div>
<!-- /wp:ghostkit/tabs-tab-v2 -->`;
		})
		.join('');
	const mode = legacy
		? ' ghostkit-tabs-buttons-vertical ghostkit-tabs-buttons-trigger-hover'
		: '';
	const list = legacy ? '' : ' role="tablist" aria-orientation="horizontal"';
	return `<!-- wp:ghostkit/tabs-v2 ${JSON.stringify(attrs)} -->
<div class="wp-block-ghostkit-tabs-v2 ghostkit-tabs${mode}"${legacy ? ` data-tab-active="${first.slug}"` : ''}><div class="ghostkit-tabs-buttons ghostkit-tabs-buttons-align-start"${list}>${buttons}</div><div class="ghostkit-tabs-content">${panels}</div></div>
<!-- /wp:ghostkit/tabs-v2 -->`;
}

test.describe('Tabs transition', () => {
	test.beforeAll(async ({ requestUtils }) => {
		await requestUtils.activatePlugin(
			process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit'
		);
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deleteAllPosts();
	});

	test('saved button and link markup works without opening the editor', async ({
		requestUtils,
		page,
	}) => {
		const post = await requestUtils.createPost({
			title: 'Saved Ghost Kit tabs',
			content: [
				savedTabs('gkt-current'),
				savedTabs('gkt-old', true),
			].join('\n\n'),
			status: 'publish',
		});
		await page.goto(`${post.link}#gkt-current-2`);
		const modern = page.locator('.ghostkit-tabs').first();
		const legacy = page.locator('.ghostkit-tabs').last();

		await expect(
			modern.getByRole('tab', { name: 'Second' })
		).toHaveAttribute('aria-selected', 'true');
		await modern.getByRole('tab', { name: 'First' }).click();
		await expect(modern.getByText('First content')).toBeVisible();

		await expect(legacy).toHaveClass(/ghostkit-tabs-buttons-vertical/);
		await legacy.getByRole('link', { name: 'Second' }).hover();
		await expect(legacy.getByText('Second content')).toBeVisible();

		await page.evaluate(() => {
			window.location.hash = 'gkt-old-1';
		});
		await expect(legacy.getByText('First content')).toBeVisible();
		await page.evaluate(() => {
			window.location.hash = 'gkt-current-2';
		});
		await expect(modern.getByText('Second content')).toBeVisible();
	});

	test('keeps the inserter and Accordion transforms across WordPress versions', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		const availability = await page.evaluate(() => {
			const { createBlock, getBlockType } = window.wp.blocks;
			const store = window.wp.data.select('core/block-editor');
			return {
				inserter: store
					.getInserterItems()
					.map(({ name }) => name)
					.includes('ghostkit/tabs-v2'),
				native: !!getBlockType('core/tabs'),
				description: getBlockType('ghostkit/tabs-v2').description,
				accordion: store
					.getBlockTransformItems([createBlock('ghostkit/accordion')])
					.map(({ name }) => name),
				tabs: store
					.getBlockTransformItems([createBlock('ghostkit/tabs-v2')])
					.map(({ name }) => name),
			};
		});
		expect(availability.inserter).toBe(true);
		expect(availability.description).toBe(
			availability.native
				? 'Deprecated. Use the WordPress Tabs block for new content.'
				: 'Separate content on the tabs with titles.'
		);
		expect(availability.accordion).toContain('ghostkit/tabs-v2');
		expect(availability.tabs).toContain('ghostkit/accordion');

		await editor.insertBlock({ name: 'ghostkit/tabs-v2' });
		await expect(
			editor.canvas.locator('.ghostkit-tabs-buttons-item').first()
		).toBeVisible();
	});

	test('converts only compatible tabs and preserves both incoming fragments', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		const result = await page.evaluate(() => {
			const { cloneBlock, createBlock, switchToBlockType } =
				window.wp.blocks;
			const store = 'core/block-editor';
			const editor = window.wp.data.select(store);
			const actions = window.wp.data.dispatch(store);
			const slugs = ['gkt-overview', 'gkt-details'];
			const titles = ['<strong>Overview</strong>', 'Details'];
			const tabs = createBlock(
				'ghostkit/tabs-v2',
				{
					tabsData: titles.map((title, index) => ({
						title,
						slug: slugs[index],
					})),
					tabActive: slugs[1],
				},
				slugs.map((slug, index) =>
					createBlock(
						'ghostkit/tabs-tab-v2',
						{
							slug,
							anchor: `${slug}-content`,
							active: index === 1,
						},
						[
							createBlock('core/paragraph', {
								content: `Panel ${index + 1}`,
							}),
						]
					)
				)
			);
			actions.insertBlocks(tabs);
			const available = (block) =>
				editor
					.getBlockTransformItems([block])
					.some(({ name }) => name === 'core/tabs');
			const native = available(tabs);
			const variants = [
				cloneBlock(tabs, { trigger: 'hover' }),
				cloneBlock(tabs, { buttonsVerticalAlign: true }),
				cloneBlock(tabs, { buttonsAlign: 'center' }),
				cloneBlock(tabs, { className: 'is-style-pills' }),
				cloneBlock(tabs, { anchor: 'custom-tabs-anchor' }),
				cloneBlock(tabs, { tabActive: 'unknown' }),
				cloneBlock(tabs, {}, [
					cloneBlock(tabs.innerBlocks[0], { anchor: 'custom-panel' }),
					tabs.innerBlocks[1],
				]),
			];
			actions.removeBlocks(tabs.clientId);
			const control = available(cloneBlock(tabs));
			const rejected = variants.map(available);
			actions.insertBlocks(tabs);

			const conflict = createBlock('core/group', { anchor: slugs[0] });
			actions.insertBlocks(conflict);
			const duplicateAnchor = switchToBlockType(tabs, 'core/tabs');
			actions.removeBlocks(conflict.clientId);

			actions.removeBlocks(tabs.clientId);
			const nested = cloneBlock(tabs);
			const carousel = createBlock('ghostkit/carousel', {}, [
				createBlock('ghostkit/carousel-slide', {}, [nested]),
			]);
			actions.insertBlocks(carousel);
			const carouselTransform = switchToBlockType(nested, 'core/tabs');
			actions.removeBlocks(carousel.clientId);
			actions.insertBlocks(tabs);

			return {
				native,
				control,
				rejected,
				duplicateAnchor,
				carouselTransform,
				versionSupportsFragments:
					window.ghostkitVariables.supportsNativeTabsHashLinks ===
					'1',
			};
		});

		expect(result.control).toBe(result.native);
		expect(result.rejected).toEqual(Array(7).fill(false));
		expect(result.duplicateAnchor).toBeNull();
		expect(result.carouselTransform).toBeNull();
		expect(result.native).toBe(result.versionSupportsFragments);
		if (!result.native) {
			await expect(editor.canvas.locator('.ghostkit-tabs')).toBeVisible();
			return;
		}

		await editor.canvas
			.locator('.ghostkit-tabs-buttons-item [contenteditable="true"]')
			.nth(1)
			.click();
		await page.locator('.block-editor-block-switcher button').click();
		await page
			.locator(
				'.block-editor-block-switcher__popover .editor-block-list-item-tabs'
			)
			.click();
		await expect(editor.canvas.locator('.wp-block-tabs')).toBeVisible();

		const postId = await editor.publishPost();
		const url = `/?p=${postId}`;
		await page.goto(url);
		const first = page.getByRole('tab', { name: 'Overview' });
		const second = page.getByRole('tab', { name: 'Details' });
		await expect(page.getByRole('tab')).toHaveText(['Overview', 'Details']);
		await expect(first.locator('strong')).toHaveText('Overview');
		await expect(second).toHaveAttribute('aria-selected', 'true');
		await expect(page.locator('#gkt-details-content')).toHaveText(
			'Panel 2'
		);

		await second.focus();
		await second.press('ArrowLeft');
		await expect(first).toBeFocused();
		await expect(second).toHaveAttribute('aria-selected', 'true');
		await first.press('Space');
		await expect(first).toHaveAttribute('aria-selected', 'true');
		await expect(page.locator('#gkt-overview')).toHaveText('Panel 1');

		for (const [target, tab] of [
			['gkt-details', second],
			['gkt-overview-content', first],
		]) {
			await page.evaluate((id) => {
				window.location.hash = id;
			}, target);
			await expect(tab).toHaveAttribute('aria-selected', 'true');
		}
		for (const target of ['gkt-overview', 'gkt-overview-content']) {
			await page.goto('about:blank');
			await page.goto(`${url}#${target}`);
			await expect(first).toHaveAttribute('aria-selected', 'true');
		}

		await admin.visitAdminPage('post.php', `post=${postId}&action=edit`);
		await expect(editor.canvas.locator('.wp-block-tabs')).toBeVisible();
		await expect(
			editor.canvas.getByText('Panel 2', { exact: true })
		).toBeVisible();
	});

	test('keeps native conversion unavailable when editing a synced pattern', async ({
		requestUtils,
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		const fixture = await page.evaluate(() => {
			const { createBlock, serialize, switchToBlockType } =
				window.wp.blocks;
			const block = createBlock(
				'ghostkit/tabs-v2',
				{},
				['tab-1', 'tab-2'].map((slug, index) =>
					createBlock('ghostkit/tabs-tab-v2', {
						slug,
						anchor: `${slug}-content`,
						active: index === 0,
					})
				)
			);
			return {
				content: serialize(block),
				convertible: !!switchToBlockType(block, 'core/tabs'),
				native:
					window.ghostkitVariables.supportsNativeTabsHashLinks ===
					'1',
			};
		});
		expect(fixture.convertible).toBe(fixture.native);
		const pattern = await requestUtils.createBlock({
			title: 'Synced Ghost Kit tabs',
			content: fixture.content,
			status: 'publish',
		});

		try {
			await admin.visitAdminPage(
				'post.php',
				`post=${pattern.id}&action=edit`
			);
			await expect(editor.canvas.locator('.ghostkit-tabs')).toBeVisible();
			const result = await page.evaluate(() => {
				const [block] = window.wp.data
					.select('core/block-editor')
					.getBlocks();
				return {
					valid: block.isValid,
					transformed: window.wp.blocks.switchToBlockType(
						block,
						'core/tabs'
					),
				};
			});
			expect(result.valid).toBe(true);
			expect(result.transformed).toBeNull();
		} finally {
			await requestUtils.rest({
				method: 'DELETE',
				path: `/wp/v2/blocks/${pattern.id}`,
				params: { force: true },
			});
		}
	});
});
