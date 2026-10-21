import { expect, test } from '@wordpress/e2e-test-utils-playwright';

const REVEAL_CSS = '.ghostkit-effects-enabled .ghostkit-effects-reveal';

const REVEAL_CONTENT = `<!-- wp:paragraph {"ghostkit":{"effects":{"reveal":{"opacity":0,"y":40}}}} -->
<p>Revealed paragraph</p>
<!-- /wp:paragraph -->`;

for (const theme of ['empty-theme', 'empty-theme-php']) {
	test.describe(`effects reveal (${theme})`, () => {
		test.beforeAll(async ({ requestUtils }) => {
			const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
			await requestUtils.activatePlugin(pluginName);
			await requestUtils.activateTheme(theme);
		});

		test.afterAll(async ({ requestUtils }) => {
			await requestUtils.deleteAllPosts();
			await requestUtils.activateTheme('empty-theme');
		});

		test('page with reveal hides the block until it is revealed', async ({
			page,
			requestUtils,
		}) => {
			const post = await requestUtils.createPost({
				title: 'GKT reveal',
				content: REVEAL_CONTENT,
				status: 'publish',
			});

			await page.emulateMedia({ reducedMotion: 'no-preference' });

			// Read the markup as served, before the frontend script reveals the block.
			const html = await (await page.request.get(post.link)).text();
			const headEnd = html.indexOf('</head>');

			expect(html.indexOf(REVEAL_CSS)).toBeGreaterThan(-1);
			expect(html.indexOf(REVEAL_CSS)).toBeLessThan(headEnd);
			expect(html.split(REVEAL_CSS).length - 1).toBe(1);

			await page.goto(post.link);

			await expect(page.locator('html')).toHaveClass(
				/ghostkit-effects-enabled/
			);

			const paragraph = page.getByText('Revealed paragraph');

			await expect(paragraph).not.toHaveClass(/ghostkit-effects-reveal/);
			await expect(paragraph).toBeVisible();
		});
	});
}

test.describe('bezier editor', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test('handles change the easing by pointer and keyboard', async ({
		page,
		admin,
	}) => {
		await admin.createNewPost({ showWelcomeGuide: false });

		// Render the editor the way Ghost Kit Pro effects get it, from the components store.
		await page.evaluate(() => {
			const { createElement, createRoot, useState } = window.wp.element;
			const { transitionEasingControls } = window.wp.data
				.select('ghostkit/base/components')
				.get();

			function Test() {
				const [value, setValue] = useState([0.42, 0, 0.58, 1]);
				window.gktBezierValue = value;

				return createElement(
					transitionEasingControls.EasingBezierEditor,
					{
						value,
						onChange: setValue,
					}
				);
			}

			const node = document.createElement('div');
			node.id = 'gkt-bezier-test';
			node.style.cssText =
				'position:fixed;top:100px;left:100px;z-index:100000;background:#fff';
			document.body.appendChild(node);
			createRoot(node).render(createElement(Test));
		});

		const handles = page.locator('#gkt-bezier-test circle[role="slider"]');

		await expect(handles).toHaveCount(2);

		// Keyboard: right arrow moves the start handle x by 0.01, shift+up moves y by 0.1.
		await handles.first().focus();
		await page.keyboard.press('ArrowRight');
		await page.keyboard.press('Shift+ArrowUp');

		const afterKeys = await page.evaluate(() => window.gktBezierValue);
		expect(afterKeys[0]).toBeCloseTo(0.43, 5);
		expect(afterKeys[1]).toBeCloseTo(0.1, 5);
		expect(afterKeys.slice(2)).toEqual([0.58, 1]);

		// Pointer: drag the end handle to the middle of the curve area.
		const box = await handles.nth(1).boundingBox();
		const svgBox = await page.locator('#gkt-bezier-test svg').boundingBox();

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down();
		await page.mouse.move(svgBox.x + 55 + 59, svgBox.y + 25 + 45, {
			steps: 5,
		});
		await page.mouse.up();

		const afterDrag = await page.evaluate(() => window.gktBezierValue);
		expect(afterDrag[2]).toBeCloseTo(0.5, 1);
		expect(afterDrag[3]).toBeCloseTo(0.5, 1);
	});
});
