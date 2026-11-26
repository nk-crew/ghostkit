import { expect, test } from '@wordpress/e2e-test-utils-playwright';

function accordionItem(slug, heading) {
	return `<!-- wp:ghostkit/accordion-item {"slug":"${slug}"} -->
<div class="wp-block-ghostkit-accordion-item ghostkit-accordion-item" data-accordion="${slug}"><div class="ghostkit-accordion-item-heading"><button type="button" id="${slug}-button" aria-expanded="false" aria-controls="${slug}-content"><span class="ghostkit-accordion-item-label">${heading}</span><span class="ghostkit-accordion-item-collapse"></span></button></div><div id="${slug}-content" class="ghostkit-accordion-item-content" role="region" aria-labelledby="${slug}-button"><!-- wp:paragraph -->
<p>${heading} content</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:ghostkit/accordion-item -->`;
}

const ACCORDION_CONTENT = `<!-- wp:ghostkit/accordion {"itemsCount":3,"collapseOne":true} -->
<div class="wp-block-ghostkit-accordion ghostkit-accordion ghostkit-accordion-3 ghostkit-accordion-collapse-one">
${accordionItem('gkt-first', 'First')}
${accordionItem('gkt-second', 'Second')}
${accordionItem('gkt-third', 'Third')}
</div>
<!-- /wp:ghostkit/accordion -->`;

const STYLE_PROPS = [
	'height',
	'overflow',
	'display',
	'paddingTop',
	'paddingBottom',
];

// Resolve once the item's show/hide animation has finished and Motion had a frame to write.
function waitForItemEvent(page, eventName) {
	return page.evaluate(
		(name) =>
			new Promise((resolve) => {
				window.GHOSTKIT.events.on(
					document.querySelector('.ghostkit-accordion'),
					name,
					() => {
						requestAnimationFrame(() =>
							requestAnimationFrame(() => resolve())
						);
					}
				);
			}),
		eventName
	);
}

// Click three times, 60ms apart, so each click lands mid-animation.
function clickThrice(button) {
	return button.evaluate(async ($button) => {
		for (let i = 0; i < 3; i++) {
			if (i) {
				await new Promise((resolve) => setTimeout(resolve, 60));
			}
			$button.click();
		}
	});
}

function getInlineStyles(content) {
	return content.evaluate(
		($el, props) => props.map((prop) => $el.style[prop]).join(''),
		STYLE_PROPS
	);
}

test.describe('accordion', () => {
	let postLink;

	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);

		const post = await requestUtils.createPost({
			title: 'GKT accordion',
			content: ACCORDION_CONTENT,
			status: 'publish',
		});

		postLink = post.link;
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deleteAllPosts();
	});

	test.beforeEach(async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'no-preference' });
	});

	test('item opened from the URL hash grows with its content', async ({
		page,
	}) => {
		await page.goto(`${postLink}#gkt-second`);

		const item = page.locator('[data-accordion="gkt-second"]');
		const content = item.locator('.ghostkit-accordion-item-content');

		await expect(item).toHaveClass(/ghostkit-accordion-item-active/);
		await expect(content).toBeVisible();

		// Let Motion run any frame it still has scheduled.
		await page.evaluate(
			() =>
				new Promise((resolve) => {
					requestAnimationFrame(() =>
						requestAnimationFrame(() => resolve())
					);
				})
		);

		const heightBefore = (await content.boundingBox()).height;

		await content.evaluate(($el) => {
			const $grow = document.createElement('div');
			$grow.style.height = '300px';
			$el.appendChild($grow);
		});

		const heightAfter = (await content.boundingBox()).height;

		expect(heightAfter - heightBefore).toBeGreaterThanOrEqual(300);
		expect(await getInlineStyles(content)).toBe('');
	});

	test('click open and close leave no inline styles', async ({ page }) => {
		await page.goto(postLink);

		const item = page.locator('[data-accordion="gkt-first"]');
		const content = item.locator('.ghostkit-accordion-item-content');

		const shown = waitForItemEvent(page, 'shown.accordion.gkt');
		await item.locator('button').click();
		await shown;

		await expect(content).toBeVisible();
		expect(await getInlineStyles(content)).toBe('');

		const hidden = waitForItemEvent(page, 'hidden.accordion.gkt');
		await item.locator('button').click();
		await hidden;

		await expect(content).toBeHidden();
		expect(await getInlineStyles(content)).toBe('');
	});

	test('interrupted open and close leave no inline styles', async ({
		page,
	}) => {
		await page.goto(postLink);

		const item = page.locator('[data-accordion="gkt-first"]');
		const button = item.locator('button');
		const content = item.locator('.ghostkit-accordion-item-content');

		// Open, interrupt with close, interrupt with open again.
		const shown = waitForItemEvent(page, 'shown.accordion.gkt');
		await clickThrice(button);
		await shown;

		await expect(item).toHaveClass(/ghostkit-accordion-item-active/);
		await expect(content).toBeVisible();
		expect(await getInlineStyles(content)).toBe('');

		// Close, interrupt with open, interrupt with close again.
		const hidden = waitForItemEvent(page, 'hidden.accordion.gkt');
		await clickThrice(button);
		await hidden;

		await expect(item).not.toHaveClass(/ghostkit-accordion-item-active/);
		await expect(content).toBeHidden();
		expect(await getInlineStyles(content)).toBe('');
	});
});

// Offsets inside the first (open) item, relative to the item box.
function measureItem(item) {
	return item.evaluate(($item) => {
		const box = (selector) =>
			$item.querySelector(selector).getBoundingClientRect();
		const itemBox = $item.getBoundingClientRect();
		const heading = box('.ghostkit-accordion-item-heading');
		const label = box('.ghostkit-accordion-item-label');
		const chevron = box('.ghostkit-accordion-item-collapse svg');
		const paragraph = box('.ghostkit-accordion-item-content p');

		return {
			headingHeight: Math.round(heading.height),
			labelTop: Math.round(label.top - itemBox.top),
			labelLeft: Math.round(label.left - itemBox.left),
			chevronRight: Math.round(itemBox.right - chevron.right),
			chevronTop: Math.round(chevron.top - itemBox.top),
			paragraphTop: Math.round(paragraph.top - itemBox.top),
		};
	});
}

test.describe('accordion editor', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deleteAllPosts();
	});

	test('editor item layout matches the frontend', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({
			title: 'GKT accordion parity',
			showWelcomeGuide: false,
		});

		await editor.insertBlock({
			name: 'ghostkit/accordion',
			innerBlocks: [
				{
					name: 'ghostkit/accordion-item',
					attributes: {
						heading: 'First',
						slug: 'gkt-parity-first',
						active: true,
					},
					innerBlocks: [
						{
							name: 'core/paragraph',
							attributes: { content: 'First content' },
						},
					],
				},
			],
		});

		const editorItem = editor.canvas
			.locator('.ghostkit-accordion-item')
			.first();
		await expect(editorItem).toBeVisible();
		const inEditor = await measureItem(editorItem);

		const postId = await editor.publishPost();
		await page.goto(`/?p=${postId}`);

		const frontendItem = page
			.locator('[data-accordion="gkt-parity-first"]')
			.first();
		await expect(frontendItem).toBeVisible();

		expect(inEditor).toEqual(await measureItem(frontendItem));
	});
});

test.describe('accordion transition', () => {
	test.beforeAll(async ({ requestUtils }) => {
		await requestUtils.activatePlugin(
			process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit'
		);
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deleteAllPosts();
	});

	test('legacy insertion and Accordion–Tabs transforms stay available', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });
		await editor.insertBlock({
			name: 'ghostkit/accordion',
			innerBlocks: ['First tab', 'Second tab'].map((heading) => ({
				name: 'ghostkit/accordion-item',
				attributes: { heading },
			})),
		});
		await expect(
			editor.canvas.locator('.ghostkit-accordion-item-label').first()
		).toBeEditable();

		const { native, description, available, tabTitles, accordionTitles } =
			await page.evaluate(() => {
				const { getBlockType, switchToBlockType } = window.wp.blocks;
				const editorStore = window.wp.data.select('core/block-editor');
				const [accordion] = editorStore.getBlocks();
				const [tabs] = switchToBlockType(accordion, 'ghostkit/tabs-v2');
				const [restored] = switchToBlockType(
					tabs,
					'ghostkit/accordion'
				);

				return {
					native: !!getBlockType('core/accordion'),
					description: getBlockType('ghostkit/accordion').description,
					available: [accordion, tabs].map((block) =>
						editorStore
							.getBlockTransformItems([block])
							.map(({ name }) => name)
					),
					tabTitles: tabs.attributes.tabsData.map(
						({ title }) => title
					),
					accordionTitles: restored.innerBlocks.map(
						({ attributes }) => attributes.heading
					),
				};
			});

		expect(description).toBe(
			native
				? 'Deprecated. Use the WordPress Accordion block for new content.'
				: 'Toggle the visibility of content across your project.'
		);
		expect(available[0]).toContain('ghostkit/tabs-v2');
		expect(available[1]).toContain('ghostkit/accordion');
		expect(tabTitles).toEqual(['First tab', 'Second tab']);
		expect(accordionTitles).toEqual(tabTitles);
	});

	test('native transform keeps translated titles, panels and incoming anchors', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({
			title: 'GKT accordion transform',
			showWelcomeGuide: false,
		});

		const native = await page.evaluate(
			() => !!window.wp.blocks.getBlockType('core/accordion')
		);
		test.skip(!native, 'WordPress does not register the native Accordion');

		await editor.insertBlock({
			name: 'ghostkit/accordion',
			attributes: { collapseOne: true, collapseTitleTag: 'h4' },
			innerBlocks: [
				{
					name: 'ghostkit/accordion-item',
					attributes: {
						heading: '<strong>Première question</strong>',
						slug: 'gkt-first',
						titleTag: 'h4',
						active: true,
					},
					innerBlocks: [
						{
							name: 'core/paragraph',
							attributes: { content: 'Première réponse' },
						},
					],
				},
				{
					name: 'ghostkit/accordion-item',
					attributes: {
						heading: 'Deuxième question',
						slug: 'gkt-second',
						titleTag: 'h4',
					},
					innerBlocks: [
						{
							name: 'core/paragraph',
							attributes: { content: 'Deuxième réponse' },
						},
					],
				},
			],
		});

		await expect(
			editor.canvas.getByRole('heading', { level: 4 }).first()
		).toContainText('Première question');

		const exclusions = await page.evaluate(() => {
			const { cloneBlock, switchToBlockType } = window.wp.blocks;
			const [block] = window.wp.data
				.select('core/block-editor')
				.getBlocks();
			return [
				cloneBlock(block, { ghostkit: { customCSS: 'color: red' } }),
				cloneBlock(block, { collapseTitleTag: 'div' }),
			].map((legacy) => switchToBlockType(legacy, 'core/accordion'));
		});
		expect(exclusions).toEqual([null, null]);

		await page.evaluate(() => {
			const store = 'core/block-editor';
			const [block] = window.wp.data.select(store).getBlocks();
			window.wp.data
				.dispatch(store)
				.replaceBlocks(
					block.clientId,
					window.wp.blocks.switchToBlockType(block, 'core/accordion')
				);
		});

		const postId = await editor.publishPost();
		await page.goto(`/?p=${postId}`);

		const first = page.getByRole('button', { name: 'Première question' });
		const second = page.getByRole('button', { name: 'Deuxième question' });

		await expect(first.locator('strong')).toHaveText('Première question');
		await expect(first).toHaveAttribute('aria-expanded', 'true');
		await expect(second).toHaveAttribute('aria-expanded', 'false');
		await expect(page.locator('#gkt-first')).toHaveText('Première réponse');
		await expect(page.getByRole('heading', { level: 4 })).toHaveCount(2);

		await second.press('Enter');
		await expect(first).toHaveAttribute('aria-expanded', 'false');
		await expect(second).toHaveAttribute('aria-expanded', 'true');

		await page.goto(`/?p=${postId}#gkt-second`);
		await expect(page.locator('#gkt-second')).toBeVisible();
		await expect(page.locator('#gkt-second')).toHaveText(
			'Deuxième réponse'
		);
		await expect(first).toHaveAttribute('aria-expanded', 'false');

		await admin.visitAdminPage('post.php', `post=${postId}&action=edit`);
		await expect(
			editor.canvas.locator('.wp-block-accordion')
		).toBeVisible();
		await expect(
			editor.canvas.locator('.wp-block-accordion-heading strong')
		).toHaveText('Première question');
	});
});
