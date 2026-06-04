import qs from 'qs';

import { expect, test } from '@wordpress/e2e-test-utils-playwright';

const TOC_ENDPOINT = '/';
const TOC_REST_ROUTE = '/ghostkit/v1/get_table_of_contents/';

function getTOCResponse(request, params = {}) {
	const query = {
		rest_route: TOC_REST_ROUTE,
		...params,
	};

	return request.get(
		`${TOC_ENDPOINT}?${qs.stringify(query, {
			encode: true,
		})}`
	);
}

test.describe('table of contents', () => {
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

	test('should load toc block in editor without REST errors', async ({
		page,
		admin,
		editor,
	}) => {
		const apiErrors = [];

		page.on('response', (response) => {
			if (
				response.url().includes('get_table_of_contents') &&
				response.status() >= 400
			) {
				apiErrors.push({
					url: response.url(),
					status: response.status(),
				});
			}
		});

		await admin.createNewPost({
			title: 'Ghost Kit TOC editor coverage',
			showWelcomeGuide: false,
		});

		await editor.insertBlock({
			name: 'core/heading',
			attributes: {
				content: 'Test Heading',
				level: 2,
				anchor: 'test-heading',
			},
		});

		await editor.insertBlock({
			name: 'ghostkit/table-of-contents',
		});

		await expect(
			editor.canvas.locator('.ghostkit-toc-list').first()
		).toBeVisible();

		await expect(apiErrors).toEqual([]);
	});

	test('should return toc html for valid headings', async ({ request }) => {
		const response = await getTOCResponse(request, {
			allowedHeaders: [2, 3],
			listStyle: 'ol',
			headings: [
				{
					level: 2,
					content: 'Test Heading',
					anchor: 'test-heading',
				},
			],
		});

		const body = await response.json();

		await expect(response.status()).toBe(200);
		await expect(body.success).toBe(true);
		await expect(body.response).toContain('test-heading');
		await expect(body.response).toContain('<ol>');
	});

	test('should return empty toc html when headings are missing', async ({
		request,
	}) => {
		const response = await getTOCResponse(request, {
			allowedHeaders: [2, 3],
			listStyle: 'ol',
		});

		const body = await response.json();

		await expect(response.status()).toBe(200);
		await expect(body.success).toBe(true);
		await expect(body.response).toBe('');
	});

	test('should return empty toc html for invalid headings type', async ({
		request,
	}) => {
		const response = await getTOCResponse(request, {
			allowedHeaders: [2, 3],
			listStyle: 'ol',
			headings: 'not-an-array',
		});

		const body = await response.json();

		await expect(response.status()).toBe(200);
		await expect(body.success).toBe(true);
		await expect(body.response).toBe('');
	});
});
