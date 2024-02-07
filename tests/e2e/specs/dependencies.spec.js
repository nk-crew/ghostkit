import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test.describe('dependencies', () => {
	test.beforeAll(async ({ requestUtils }) => {
		await requestUtils.activatePlugin('ghost-kit');
	});

	test('should not load window.wp on frontend', async ({ page }) => {
		await await page.goto('/');
		const hasGutenbergVariable = await page.evaluate(() => !!window?.wp);

		await expect(hasGutenbergVariable).toBe(false);
	});
});
