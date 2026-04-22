import { expect, test } from '@wordpress/e2e-test-utils-playwright';

const IGNORED_RUNTIME_PATTERNS = [
	/JQMIGRATE/i,
	/fonts\.gstatic\.com/i,
	/net::ERR_/i,
];

function isIgnoredRuntimeMessage(message) {
	return IGNORED_RUNTIME_PATTERNS.some((pattern) => pattern.test(message));
}

function trackRuntimeIssues(page) {
	const issues = {
		consoleErrors: [],
		pageErrors: [],
		deprecations: [],
	};

	page.on('console', (msg) => {
		const text = msg.text();

		if (isIgnoredRuntimeMessage(text)) {
			return;
		}

		if (msg.type() === 'error') {
			issues.consoleErrors.push(text);
		}

		if (
			text.includes('__next40pxDefaultSize') ||
			text.includes(
				'36px default size for wp.components.NumberControl'
			) ||
			text.includes('RichText multiline prop is deprecated')
		) {
			issues.deprecations.push(text);
		}
	});

	page.on('pageerror', (error) => {
		if (!isIgnoredRuntimeMessage(error.message)) {
			issues.pageErrors.push(error.message);
		}
	});

	return issues;
}

test.describe('console errors', () => {
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

	test('editor loads migration blocks without critical runtime issues', async ({
		page,
		admin,
		editor,
	}) => {
		const issues = trackRuntimeIssues(page);

		await admin.createNewPost({
			title: 'Ghost Kit migration console coverage',
			showWelcomeGuide: false,
		});

		await editor.insertBlock({
			name: 'ghostkit/carousel',
		});

		await editor.insertBlock({
			name: 'ghostkit/google-maps',
		});

		await editor.insertBlock({
			name: 'ghostkit/image-compare',
		});

		await expect(
			editor.canvas.locator('.ghostkit-carousel').first()
		).toBeVisible();

		await expect(
			editor.canvas.locator('.ghostkit-google-maps').first()
		).toBeVisible();

		await expect(
			editor.canvas.locator('.ghostkit-image-compare').first()
		).toBeVisible();

		await page.waitForTimeout(1000);

		await expect(issues.consoleErrors).toEqual([]);
		await expect(issues.pageErrors).toEqual([]);
		await expect(issues.deprecations).toEqual([]);
	});
});
