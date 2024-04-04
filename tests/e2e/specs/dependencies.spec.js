import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test.describe('dependencies', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test('should not load window.wp on frontend', async ({ page }) => {
		await await page.goto('/');
		const hasGutenbergVariable = await page.evaluate(() => !!window?.wp);

		await expect(hasGutenbergVariable).toBe(false);
	});
});
