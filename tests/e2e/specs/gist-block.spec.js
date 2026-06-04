import { expect, test } from '@wordpress/e2e-test-utils-playwright';

const TEST_GIST_URL = 'https://gist.github.com/fake-user/fake-gist';
const TEST_GIST_FILE = 'example.php';
const TEST_GIST_CAPTION = 'Example gist caption';
const TEST_GIST_STYLESHEET_PATH = '/ghostkit-test-gist.css';

function trackRuntimeErrors(page) {
	const errors = [];

	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			errors.push(msg.text());
		}
	});

	page.on('pageerror', (error) => {
		errors.push(error.message);
	});

	return errors;
}

async function mockGistResponses(target, stylesheetUrl) {
	const stats = {
		jsonRequests: 0,
		cssRequests: 0,
	};

	await target.route('**/fake-gist.json*', async (route) => {
		stats.jsonRequests += 1;

		const callbackName =
			new URL(route.request().url()).searchParams.get('callback') ||
			'__gist_simple_jsonp__cb_1';

		const payload = {
			div: `
				<div class="gist">
					<div class="gist-file">
						<div class="gist-data">
							<table class="highlight"><tbody>
								<tr>
									<td class="js-line-number" data-line-number="1">1</td>
									<td class="js-file-line">echo 'Ghost Kit';</td>
								</tr>
							</tbody></table>
						</div>
						<div class="gist-meta"><a href="#">view raw</a></div>
					</div>
				</div>
			`,
			stylesheet: stylesheetUrl,
		};

		await route.fulfill({
			status: 200,
			contentType: 'application/javascript',
			body: `${callbackName}(${JSON.stringify(payload)});`,
		});
	});

	await target.route(`**${TEST_GIST_STYLESHEET_PATH}`, async (route) => {
		stats.cssRequests += 1;

		await route.fulfill({
			status: 200,
			contentType: 'text/css',
			body: '.gist { border: 0; } .gist-file { border: 1px solid #ddd; }',
		});
	});

	return stats;
}

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

test.describe('gist block', () => {
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

	test('gist block renders without load-css errors in editor', async ({
		page,
		admin,
		editor,
	}) => {
		const runtimeErrors = trackRuntimeErrors(page);

		await admin.createNewPost({
			title: 'Ghost Kit Gist editor coverage',
			showWelcomeGuide: false,
		});

		const stylesheetUrl = new URL(
			TEST_GIST_STYLESHEET_PATH,
			page.url()
		).toString();

		const mockStats = await mockGistResponses(
			page.context(),
			stylesheetUrl
		);

		await editor.insertBlock({
			name: 'ghostkit/gist',
			attributes: {
				url: TEST_GIST_URL,
				file: TEST_GIST_FILE,
				caption: TEST_GIST_CAPTION,
			},
		});

		await page.waitForTimeout(1000);

		await expect(
			editor.canvas.locator('.ghostkit-gist').first()
		).toBeVisible();
		await expect(mockStats.jsonRequests).toBeGreaterThan(0);
		await expect(mockStats.cssRequests).toBeGreaterThan(0);

		const relevantErrors = runtimeErrors.filter(
			(message) =>
				message.includes('querySelector') ||
				message.includes('load-css') ||
				message.includes('gist-simple')
		);

		await expect(relevantErrors).toEqual([]);
	});

	test('gist block renders without load-css errors on frontend', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost({
			title: 'Ghost Kit Gist frontend coverage',
			postType: 'page',
			showWelcomeGuide: false,
		});

		const stylesheetUrl = new URL(
			TEST_GIST_STYLESHEET_PATH,
			page.url()
		).toString();

		const mockStats = await mockGistResponses(
			page.context(),
			stylesheetUrl
		);

		await editor.insertBlock({
			name: 'ghostkit/gist',
			attributes: {
				url: TEST_GIST_URL,
				file: TEST_GIST_FILE,
				caption: TEST_GIST_CAPTION,
			},
		});

		const frontendPage = await publishAndGetFrontendPage(page, editor);
		const runtimeErrors = trackRuntimeErrors(frontendPage);

		await frontendPage.waitForTimeout(1000);

		await expect(
			frontendPage.locator('.ghostkit-gist').first()
		).toBeVisible();
		await expect(mockStats.jsonRequests).toBeGreaterThan(0);
		await expect(mockStats.cssRequests).toBeGreaterThan(0);

		const relevantErrors = runtimeErrors.filter(
			(message) =>
				message.includes('querySelector') ||
				message.includes('load-css') ||
				message.includes('gist-simple')
		);

		await expect(relevantErrors).toEqual([]);
	});
});
