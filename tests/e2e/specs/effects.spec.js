import { expect, test } from '@wordpress/e2e-test-utils-playwright';

const TEST_LOTTIE_PATH = '/test-effects-lottie.json';
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

function revealParagraph(id, reveal) {
	const attrs = { ghostkit: { id, effects: { reveal } } };

	return `<!-- wp:paragraph ${JSON.stringify(attrs)} -->
<p id="${id}">Reveal ${id}</p>
<!-- /wp:paragraph -->`;
}

/**
 * Opens a frontend page with motion allowed. The shared e2e config emulates
 * prefers-reduced-motion, which turns every effect off.
 *
 * @param {Object} browser Playwright browser.
 * @param {string} url     Page URL.
 * @return {Object} Context, page, and collected runtime errors.
 */
async function openWithMotion(browser, url) {
	const context = await browser.newContext({
		reducedMotion: 'no-preference',
		viewport: { width: 960, height: 700 },
	});
	const page = await context.newPage();
	const errors = [];

	page.on('pageerror', (error) => errors.push(error.message));

	await context.route(`**${TEST_LOTTIE_PATH}`, (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(TEST_LOTTIE_ANIMATION),
		})
	);

	// Record the transform and opacity of every reveal element on each frame.
	await page.addInitScript(() => {
		window.gktSamples = {};
		const sample = () => {
			document.querySelectorAll('p[id^="reveal-"]').forEach((el) => {
				const style = window.getComputedStyle(el);
				window.gktSamples[el.id] = window.gktSamples[el.id] || [];
				window.gktSamples[el.id].push({
					transform: style.transform,
					opacity: parseFloat(style.opacity),
				});
			});
			window.requestAnimationFrame(sample);
		};
		window.requestAnimationFrame(sample);
	});

	await page.goto(url);

	return { context, page, errors };
}

test.describe('effects', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deleteAllPages();
	});

	test('reveal animates spring and easing transitions to the final state', async ({
		browser,
		requestUtils,
	}) => {
		const { link } = await requestUtils.createPage({
			title: 'Ghost Kit Reveal',
			status: 'publish',
			content: [
				revealParagraph('reveal-spring', {
					y: 50,
					opacity: 0,
				}),
				revealParagraph('reveal-easing', {
					x: -50,
					transition: {
						type: 'easing',
						easing: [0.42, 0, 0.58, 1],
						duration: 0.9,
						delay: 0,
					},
				}),
			].join('\n'),
		});

		const { context, page, errors } = await openWithMotion(browser, link);

		for (const id of ['reveal-spring', 'reveal-easing']) {
			const element = page.locator(`#${id}`);

			await expect(element).not.toHaveClass(/ghostkit-effects-reveal/);
			await expect(element).not.toHaveAttribute('data-gkt-effects');
			await expect
				.poll(() =>
					element.evaluate((el) => {
						const style = window.getComputedStyle(el);
						return `${style.transform}|${style.opacity}`;
					})
				)
				.toBe('none|1');
		}

		const samples = await page.evaluate(() => window.gktSamples);
		const translate = (transform, index) =>
			transform === 'none'
				? 0
				: parseFloat(
						transform.match(/\(([^)]+)\)/)[1].split(',')[index]
					);

		// The spring moved from y 50 through values in between.
		expect(
			samples['reveal-spring'].some(({ transform, opacity }) => {
				const y = translate(transform, 5);
				return y > 1 && y < 49 && opacity > 0 && opacity < 1;
			})
		).toBe(true);

		// The easing moved from x -50 through values in between.
		expect(
			samples['reveal-easing'].some(({ transform }) => {
				const x = translate(transform, 4);
				return x < -1 && x > -49;
			})
		).toBe(true);

		expect(errors).toEqual([]);

		await context.close();
	});

	test('lottie with viewport trigger plays in view and pauses out of view', async ({
		browser,
		requestUtils,
	}) => {
		const lottieAttrs = {
			fileUrl: TEST_LOTTIE_PATH,
			fileWidth: 100,
			fileHeight: 100,
			trigger: 'viewport',
		};

		const { link } = await requestUtils.createPage({
			title: 'Ghost Kit Lottie Viewport',
			status: 'publish',
			content: `<!-- wp:spacer {"height":"1500px"} -->
<div style="height:1500px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:ghostkit/lottie ${JSON.stringify(lottieAttrs)} -->
<div class="wp-block-ghostkit-lottie ghostkit-lottie" data-trigger="viewport" style="--gkt-lottie__ar:100 / 100;--gkt-lottie__width:100%"><lottie-player src="${TEST_LOTTIE_PATH}" direction="1" background="transparent" mode="normal" speed="1" loop="loop" style="width:100%;height:auto"></lottie-player></div>
<!-- /wp:ghostkit/lottie -->
<!-- wp:spacer {"height":"1500px"} -->
<div style="height:1500px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->`,
		});

		const { context, page, errors } = await openWithMotion(browser, link);
		const player = page.locator('lottie-player');
		const state = () => player.evaluate((el) => el.currentState);

		// Loaded while out of view, so nothing has played it yet.
		await expect
			.poll(() => player.evaluate((el) => !!el._lottie))
			.toBe(true);
		expect(await state()).not.toBe('playing');

		await player.scrollIntoViewIfNeeded();
		await expect.poll(state).toBe('playing');

		await page.evaluate(() => window.scrollTo(0, 0));
		await expect.poll(state).toBe('paused');

		expect(errors).toEqual([]);

		await context.close();
	});
});
