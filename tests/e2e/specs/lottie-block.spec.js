import { expect, test } from '@wordpress/e2e-test-utils-playwright';

const TEST_LOTTIE_PATH = '/test-lottie.json';
const TEST_LOTTIE_ANIMATION = {
	v: '5.7.4',
	fr: 30,
	ip: 0,
	op: 60,
	w: 100,
	h: 100,
	nm: 'Ghost Kit Test Lottie',
	ddd: 0,
	assets: [],
	layers: [
		{
			ddd: 0,
			ind: 1,
			ty: 4,
			nm: 'Shape Layer 1',
			sr: 1,
			ks: {
				o: { a: 0, k: 100 },
				r: { a: 0, k: 0 },
				p: { a: 0, k: [50, 50, 0] },
				a: { a: 0, k: [0, 0, 0] },
				s: { a: 0, k: [100, 100, 100] },
			},
			ao: 0,
			shapes: [],
			ip: 0,
			op: 60,
			st: 0,
			bm: 0,
		},
	],
};

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

async function mockLottieResponse(target) {
	await target.route(`**${TEST_LOTTIE_PATH}`, async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(TEST_LOTTIE_ANIMATION),
		});
	});
}

/**
 * Publishes the post and opens its frontend.
 *
 * `onPageReady` runs against the new page *before* it navigates. That ordering
 * is the whole point: Playwright does not buffer `console` or `pageerror` for
 * listeners attached later, and `goto` resolves on `load`, which already waited
 * for the async plugin scripts to execute. A listener attached after this
 * function returned could never see an error thrown during script evaluation --
 * which is exactly the error these specs exist to catch.
 *
 * @param {Object}   page        Playwright page holding the editor.
 * @param {Object}   editor      Block editor utils.
 * @param {Function} onPageReady Called with the frontend page before it loads.
 * @return {Object} The frontend page.
 */
async function publishAndGetFrontendPage(page, editor, onPageReady) {
	await editor.publishPost();

	const viewPageButton = page
		.locator('.components-button', {
			hasText: 'View Page',
		})
		.first();

	const href = await viewPageButton.getAttribute('href');

	if (href) {
		const frontendPage = await page.context().newPage();
		onPageReady?.(frontendPage);
		// No `waitForLoadState('domcontentloaded')` after this: `goto` resolves
		// on `load`, which is strictly later, so the wait was a no-op.
		await frontendPage.goto(href);
		return frontendPage;
	}

	const popupPromise = page.waitForEvent('popup', { timeout: 3000 });
	await viewPageButton.click();
	const popupPage = await popupPromise;
	onPageReady?.(popupPage);
	await popupPage.waitForLoadState('domcontentloaded');

	return popupPage;
}

test.describe('lottie block', () => {
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

	test('lottie-player loads without duplicate registration errors in editor', async ({
		page,
		admin,
		editor,
	}) => {
		const runtimeErrors = trackRuntimeErrors(page);
		await mockLottieResponse(page.context());

		await admin.createNewPost({
			title: 'Ghost Kit Lottie editor coverage',
			showWelcomeGuide: false,
		});

		const lottieUrl = new URL(TEST_LOTTIE_PATH, page.url()).toString();

		await editor.insertBlock({
			name: 'ghostkit/lottie',
			attributes: {
				fileUrl: lottieUrl,
				fileWidth: 100,
				fileHeight: 100,
			},
		});

		await expect(
			editor.canvas.locator('lottie-player').first()
		).toBeVisible();

		await page.waitForTimeout(1000);

		const relevantErrors = runtimeErrors.filter(
			(message) =>
				message.includes('lottie-player') ||
				message.includes('CustomElementRegistry') ||
				message.includes('NotSupportedError')
		);

		await expect(relevantErrors).toEqual([]);
	});

	test('lottie-player loads without duplicate registration errors on frontend', async ({
		page,
		admin,
		editor,
	}) => {
		await mockLottieResponse(page.context());

		await admin.createNewPost({
			title: 'Ghost Kit Lottie frontend coverage',
			postType: 'page',
			showWelcomeGuide: false,
		});

		const lottieUrl = new URL(TEST_LOTTIE_PATH, page.url()).toString();

		await editor.insertBlock({
			name: 'ghostkit/lottie',
			attributes: {
				fileUrl: lottieUrl,
				fileWidth: 100,
				fileHeight: 100,
			},
		});

		// Attached through the callback so the listeners exist before the page
		// navigates. Attaching them to the returned page, as this did, meant the
		// script had already run and any error was long gone -- `runtimeErrors`
		// was always empty and the assertion below could not fail.
		let runtimeErrors = [];
		const frontendPage = await publishAndGetFrontendPage(
			page,
			editor,
			(frontend) => {
				runtimeErrors = trackRuntimeErrors(frontend);
			}
		);

		await expect(
			frontendPage.locator('lottie-player').first()
		).toBeVisible();

		await frontendPage.waitForTimeout(1000);

		const relevantErrors = runtimeErrors.filter(
			(message) =>
				message.includes('lottie-player') ||
				message.includes('CustomElementRegistry') ||
				message.includes('NotSupportedError')
		);

		await expect(relevantErrors).toEqual([]);
	});
});
