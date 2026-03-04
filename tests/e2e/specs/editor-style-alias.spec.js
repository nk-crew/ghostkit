import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test.describe('editor style alias', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test.afterAll(async ({ requestUtils }) => {
		await Promise.all([
			requestUtils.deleteAllPosts(),
			requestUtils.deleteAllPages(),
		]);
	});

	test('should load only editor stylesheet and keep ghostkit blocks visible in editor', async ({
		admin,
		editor,
		page,
	}) => {
		await admin.createNewPost({
			title: 'Ghost Kit editor stylesheet alias',
			showWelcomeGuide: false,
		});

		await editor.insertBlock({
			name: 'ghostkit/alert',
		});

		const stylesState = await page.evaluate(() => {
			const links = Array.from(
				document.querySelectorAll('link[rel="stylesheet"]')
			);

			return {
				hasEditorStylesheet: links.some((link) =>
					link.href.includes('/build/gutenberg/editor')
				),
				hasFrontendStylesheet: links.some((link) =>
					link.href.includes('/build/gutenberg/style')
				),
				hasEditorHandleNode: Boolean(
					document.getElementById('ghostkit-editor-css')
				),
				hasFrontendHandleNode: Boolean(
					document.getElementById('ghostkit-css')
				),
			};
		});

		await expect(stylesState.hasEditorStylesheet).toBe(true);
		await expect(stylesState.hasFrontendStylesheet).toBe(false);
		await expect(stylesState.hasEditorHandleNode).toBe(true);
		await expect(stylesState.hasFrontendHandleNode).toBe(false);

		const alertBlock = editor.canvas.locator('.ghostkit-alert').first();

		await expect(alertBlock).toBeVisible();

		const displayValue = await alertBlock.evaluate(
			(element) => window.getComputedStyle(element).display
		);

		await expect(displayValue).not.toBe('none');
	});
});
