import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test.describe('extensions', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test('deprecated blocks should migrate and keep Ghost Kit extensions', async ({
		page,
		admin,
	}) => {
		await admin.createNewPost();

		const padding = await page.evaluate(() => {
			const { rawHandler } = wp.blocks;
			const parsedBlocks = rawHandler({
				HTML: `<!-- wp:list {"className":"ghostkit-custom-2b5h3i","ghostkit":{"styles":{"padding-left":"60"},"id":"2b5h3i"}} -->
<ul class="ghostkit-custom-2b5h3i"><li>test</li></ul>
<!-- /wp:list -->`,
			});

			return parsedBlocks[0]?.attributes?.ghostkit?.styles?.[
				'padding-left'
			];
		});

		await expect(padding).toBe('60');
	});
});
