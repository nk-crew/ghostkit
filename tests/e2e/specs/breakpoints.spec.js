import { expect, test } from '@wordpress/e2e-test-utils-playwright';

// Sets `gkt_breakpoint_sm` to 700 the way Ghost Kit Pro does; mapped in .wp-env.json.
const TEST_PLUGIN = 'ghost-kit-test-plugin-custom-breakpoints';

// The form block stylesheet carries breakpoint media queries, the main stylesheet too.
const FORM_BLOCK = `<!-- wp:ghostkit/form -->
<form class="ghostkit-form" novalidate><!-- wp:ghostkit/form-field-text -->
<div class="ghostkit-form-field ghostkit-form-field-text"><input type="text" /></div>
<!-- /wp:ghostkit/form-field-text --></form>
<!-- /wp:ghostkit/form -->`;

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

async function getStyleHref(page, handle) {
	return page.evaluate((styleHandle) => {
		const link = document.getElementById(`${styleHandle}-css`);
		return link ? link.getAttribute('href') : null;
	}, handle);
}

async function fetchText(page, url) {
	return page.evaluate(async (href) => {
		const response = await fetch(href);
		return response.text();
	}, url);
}

test.describe('custom breakpoints', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
		await requestUtils.activateTheme('empty-theme-php');
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin(TEST_PLUGIN);
		await Promise.all([
			requestUtils.deleteAllPosts(),
			requestUtils.deleteAllPages(),
		]);
		await requestUtils.activateTheme('empty-theme');
	});

	test('styles come from uploads with the custom value, and from the plugin again without it', async ({
		page,
		admin,
		editor,
		requestUtils,
	}) => {
		await requestUtils.activatePlugin(TEST_PLUGIN);

		const frontendPage = await createPublishedPageWithContent(
			page,
			admin,
			editor,
			'GKT custom breakpoints',
			FORM_BLOCK
		);

		const mainHref = await getStyleHref(frontendPage, 'ghostkit');
		const formHref = await getStyleHref(
			frontendPage,
			'ghostkit-block-form'
		);

		expect(mainHref).toContain(
			'/wp-content/uploads/ghostkit/build/gutenberg/style.css?ver='
		);
		expect(formHref).toContain(
			'/wp-content/uploads/ghostkit/build/gutenberg/blocks/form/styles/style.css?ver='
		);

		const mainCss = await fetchText(frontendPage, mainHref);

		expect(mainCss).toContain('(max-width:700px)');
		expect(mainCss).not.toContain('(max-width:768px)');

		await requestUtils.deactivatePlugin(TEST_PLUGIN);
		await frontendPage.reload();
		await frontendPage.waitForLoadState('domcontentloaded');

		const defaultMainHref = await getStyleHref(frontendPage, 'ghostkit');
		const defaultFormHref = await getStyleHref(
			frontendPage,
			'ghostkit-block-form'
		);

		expect(defaultMainHref).toContain('/build/gutenberg/style.css');
		expect(defaultMainHref).not.toContain('/wp-content/uploads/');
		expect(defaultFormHref).toContain(
			'/build/gutenberg/blocks/form/styles/style.css'
		);
		expect(defaultFormHref).not.toContain('/wp-content/uploads/');
	});
});
