import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test.describe('initial loading', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test('should have ghostkit in admin menu', async ({ page, admin }) => {
		await admin.visitAdminPage('index.php');

		await expect(page.locator('#toplevel_page_ghostkit')).toBeVisible();
	});
});
