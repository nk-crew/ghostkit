import { expect, test } from '@wordpress/e2e-test-utils-playwright';

async function publishAndGetFrontendPage(page, editor) {
	await editor.publishPost();

	const viewPageButton = page
		.locator('.components-button', {
			hasText: 'View Page',
		})
		.first();

	const href = await viewPageButton.getAttribute('href');

	if (href) {
		const frontendPage = await page.context().newPage();
		await frontendPage.goto(href);
		await frontendPage.waitForLoadState('domcontentloaded');
		return frontendPage;
	}

	const popupPromise = page.waitForEvent('popup', { timeout: 3000 });
	await viewPageButton.click();
	const popupPage = await popupPromise;
	await popupPage.waitForLoadState('domcontentloaded');

	return popupPage;
}

async function hasEnqueuedStyle(page, handle) {
	return page.evaluate((styleHandle) => {
		return Boolean(document.getElementById(`${styleHandle}-css`));
	}, handle);
}

async function createPublishedPageWithContent(
	page,
	admin,
	editor,
	title,
	content
) {
	await admin.createNewPost({
		title,
		postType: 'page',
		showWelcomeGuide: false,
	});

	await page.evaluate((blockContent) => {
		const blocks = window.wp.blocks.parse(blockContent);
		window.wp.data.dispatch('core/block-editor').resetBlocks(blocks);
	}, content);

	return publishAndGetFrontendPage(page, editor);
}

test.describe('assets loading', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
		await requestUtils.activateTheme('empty-theme-php');
	});

	test.afterAll(async ({ requestUtils }) => {
		await Promise.all([
			requestUtils.deleteAllPosts(),
			requestUtils.deleteAllPages(),
		]);
		await requestUtils.activateTheme('empty-theme');
	});

	test('badge-only paragraph enqueues ghostkit in head on classic theme', async ({
		page,
		admin,
		editor,
	}) => {
		const content = `<!-- wp:paragraph {"className":"ghostkit-badge"} -->
<p class="ghostkit-badge">Badge paragraph</p>
<!-- /wp:paragraph -->`;

		const frontendPage = await createPublishedPageWithContent(
			page,
			admin,
			editor,
			'GKT assets badge',
			content
		);

		await expect(hasEnqueuedStyle(frontendPage, 'ghostkit')).resolves.toBe(
			true
		);
		await expect(frontendPage.locator('.ghostkit-badge')).toBeVisible();
	});

	test('display utility class enqueues ghostkit stylesheet', async ({
		page,
		admin,
		editor,
	}) => {
		const content = `<!-- wp:paragraph {"className":"ghostkit-d-md-none"} -->
<p class="ghostkit-d-md-none">Hidden on md</p>
<!-- /wp:paragraph -->`;

		const frontendPage = await createPublishedPageWithContent(
			page,
			admin,
			editor,
			'GKT assets display',
			content
		);

		await expect(hasEnqueuedStyle(frontendPage, 'ghostkit')).resolves.toBe(
			true
		);
	});

	test('paragraph columns class enqueues ghostkit stylesheet', async ({
		page,
		admin,
		editor,
	}) => {
		const content = `<!-- wp:paragraph {"className":"ghostkit-paragraph-columns-2"} -->
<p class="ghostkit-paragraph-columns-2">Columns</p>
<!-- /wp:paragraph -->`;

		const frontendPage = await createPublishedPageWithContent(
			page,
			admin,
			editor,
			'GKT assets columns',
			content
		);

		await expect(hasEnqueuedStyle(frontendPage, 'ghostkit')).resolves.toBe(
			true
		);
	});

	test('button block enqueues button block assets', async ({
		page,
		admin,
		editor,
	}) => {
		const content = `<!-- wp:ghostkit/button -->
<div class="ghostkit-button-wrapper ghostkit-button-wrapper-gap-md"><div class="ghostkit-button-wrapper-inner"><!-- wp:ghostkit/button-single -->
<a class="ghostkit-button ghostkit-button-md" href="#"><span class="ghostkit-button-text">Click</span></a>
<!-- /wp:ghostkit/button-single --></div></div>
<!-- /wp:ghostkit/button -->`;

		const frontendPage = await createPublishedPageWithContent(
			page,
			admin,
			editor,
			'GKT assets button-single',
			content
		);

		await expect(
			hasEnqueuedStyle(frontendPage, 'ghostkit-block-button')
		).resolves.toBe(true);
	});

	test('form block enqueues form block assets', async ({
		page,
		admin,
		editor,
	}) => {
		const content = `<!-- wp:ghostkit/form -->
<form class="ghostkit-form" novalidate><!-- wp:ghostkit/form-field-text -->
<div class="ghostkit-form-field ghostkit-form-field-text"><input type="text" /></div>
<!-- /wp:ghostkit/form-field-text --></form>
<!-- /wp:ghostkit/form -->`;

		const frontendPage = await createPublishedPageWithContent(
			page,
			admin,
			editor,
			'GKT assets form field',
			content
		);

		await expect(
			hasEnqueuedStyle(frontendPage, 'ghostkit-block-form')
		).resolves.toBe(true);
	});

	test('alert block enqueues block stylesheet', async ({
		page,
		admin,
		editor,
	}) => {
		const content = `<!-- wp:ghostkit/alert -->
<div class="ghostkit-alert ghostkit-alert-info"><div class="ghostkit-alert-content">Alert</div></div>
<!-- /wp:ghostkit/alert -->`;

		const frontendPage = await createPublishedPageWithContent(
			page,
			admin,
			editor,
			'GKT assets alert',
			content
		);

		await expect(
			hasEnqueuedStyle(frontendPage, 'ghostkit-block-alert')
		).resolves.toBe(true);
	});

	test('effects attrs without rendered HTML enqueue effects script', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({
			title: 'GKT assets effects',
			postType: 'page',
			showWelcomeGuide: false,
		});

		await editor.insertBlock({
			name: 'core/paragraph',
			attributes: {
				content: 'Effects',
				ghostkit: {
					effects: {
						opacity: 1,
					},
					id: 'fx1',
				},
				className: 'ghostkit-custom-fx1',
			},
		});

		const frontendPage = await publishAndGetFrontendPage(page, editor);

		await expect(
			frontendPage.evaluate(() => {
				if (document.getElementById('ghostkit-extension-effects-js')) {
					return true;
				}

				return Array.from(document.querySelectorAll('script')).some(
					(node) => {
						const src = node.getAttribute('src') || '';
						const id = node.getAttribute('id') || '';

						return (
							src.includes('effects') || id.includes('effects')
						);
					}
				);
			})
		).resolves.toBe(true);
	});
});
