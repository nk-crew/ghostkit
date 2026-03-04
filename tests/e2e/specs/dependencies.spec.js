import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test.describe('dependencies', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test('should not load window.wp on frontend', async ({ page }) => {
		await page.goto('/');

		const frontendDependencies = await page.evaluate(() => {
			const scripts = Array.from(
				document.querySelectorAll('script[src]')
			);

			return {
				hasWpBlocks: Boolean(window?.wp?.blocks),
				hasWpBlockEditor: Boolean(window?.wp?.blockEditor),
				hasWpDistScripts: scripts.some((script) =>
					script.src.includes('/wp-includes/js/dist/')
				),
			};
		});

		// WordPress may expose `window.wp` for non-editor globals (e.g. emoji).
		// What matters for this test is that editor/Gutenberg frontend deps are not loaded.
		await expect(frontendDependencies.hasWpBlocks).toBe(false);
		await expect(frontendDependencies.hasWpBlockEditor).toBe(false);
		await expect(frontendDependencies.hasWpDistScripts).toBe(false);
	});
});
