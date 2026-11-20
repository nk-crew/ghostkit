import { expect, test } from '@wordpress/e2e-test-utils-playwright';

test('an alert wraps a long link on a narrow screen', async ({
	page,
	requestUtils,
}) => {
	const link = 'https://example.org/' + 'entry'.repeat(24);
	const post = await requestUtils.createPost({
		title: 'Alert with a long link',
		status: 'publish',
		content: `<!-- wp:ghostkit/alert -->
<div class="wp-block-ghostkit-alert ghostkit-alert"><div class="ghostkit-alert-content"><!-- wp:paragraph -->
<p><a href="${link}">${link}</a></p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:ghostkit/alert -->`,
	});

	try {
		await page.setViewportSize({ width: 390, height: 840 });
		await page.goto(post.link);
		const alertLink = page.locator('.ghostkit-alert').getByRole('link');
		await expect(alertLink).toBeVisible();
		await expect(alertLink).toHaveAttribute('href', link);

		const layout = await alertLink.evaluate((anchor) => ({
			lines: anchor.getClientRects().length,
			viewport: document.documentElement.clientWidth,
			page: document.documentElement.scrollWidth,
		}));
		expect(layout.lines).toBeGreaterThan(1);
		expect(layout.page).toBe(layout.viewport);
	} finally {
		await requestUtils.rest({
			path: `/wp/v2/posts/${post.id}`,
			method: 'DELETE',
			params: { force: true },
		});
	}
});
