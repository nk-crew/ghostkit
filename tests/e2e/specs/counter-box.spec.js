import { expect, test } from '@wordpress/e2e-test-utils-playwright';

// Saved by Ghost Kit 3.9.1, before the number format option existed.
const SAVED_COUNTERS = `<!-- wp:ghostkit/counter-box -->
<div class="ghostkit-counter-box"><div class="ghostkit-counter-box-number ghostkit-counter-box-number-align-top ghostkit-counter-box-number-top-align-center"><div class="ghostkit-counter-box-number-wrap">77</div></div><div class="ghostkit-counter-box-content"></div></div>
<!-- /wp:ghostkit/counter-box -->

<!-- wp:ghostkit/counter-box {"animateInViewport":true,"animateInViewportFrom":10,"numberPosition":"left","url":"https://example.com","ariaLabel":"More"} -->
<div class="ghostkit-counter-box ghostkit-counter-box-with-link"><a class="ghostkit-counter-box-link" href="https://example.com" aria-label="More"><span></span></a><div class="ghostkit-counter-box-number ghostkit-counter-box-number-align-left"><div class="ghostkit-counter-box-number-wrap ghostkit-count-up" data-count-from="10">1,000+</div></div><div class="ghostkit-counter-box-content"></div></div>
<!-- /wp:ghostkit/counter-box -->

<!-- wp:ghostkit/counter-box {"animateInViewport":true} -->
<div class="ghostkit-counter-box"><div class="ghostkit-counter-box-number ghostkit-counter-box-number-align-top ghostkit-counter-box-number-top-align-center"><div class="ghostkit-counter-box-number-wrap ghostkit-count-up"><strong>99.5</strong>%</div></div><div class="ghostkit-counter-box-content"></div></div>
<!-- /wp:ghostkit/counter-box -->`;

const SPACER = `<!-- wp:spacer {"height":"2000px"} -->
<div style="height:2000px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->`;

function counter(number, attributes, data) {
	return `<!-- wp:ghostkit/counter-box ${JSON.stringify({ animateInViewport: true, ...attributes })} -->
<div class="ghostkit-counter-box"><div class="ghostkit-counter-box-number ghostkit-counter-box-number-align-top ghostkit-counter-box-number-top-align-center"><div class="ghostkit-counter-box-number-wrap ghostkit-count-up" ${data}>${number}</div></div><div class="ghostkit-counter-box-content"></div></div>
<!-- /wp:ghostkit/counter-box -->`;
}

const CUSTOM_COUNTER = counter(
	'1 234,50 €',
	{ numberFormat: 'custom', thousandsSeparator: ' ', decimalSeparator: ',' },
	'data-count-format="custom" data-count-thousands=" " data-count-decimal=","'
);

const LOCALE_COUNTER = counter(
	'12345.5',
	{ numberFormat: 'locale' },
	'data-count-format="locale"'
);

/**
 * Scroll the counter into view and return the visible text of every frame, and what assistive technology reads during them.
 *
 * @param {import('@playwright/test').Page} page page with one counter below the fold.
 */
async function countUp(page) {
	const number = page.locator('.ghostkit-count-up');

	await expect(number).toHaveClass(/ghostkit-count-up-ready/);

	const before = await number.ariaSnapshot();

	await page.evaluate(() => {
		const $counter = document.querySelector('.ghostkit-count-up');

		window.gktFrames = [];
		new MutationObserver(() => {
			const $value = $counter.querySelector('[aria-hidden="true"]');

			if ($value) {
				window.gktFrames.push($value.textContent);
			}
		}).observe($counter, {
			childList: true,
			subtree: true,
			characterData: true,
		});
	});

	await number.scrollIntoViewIfNeeded();
	await expect(number.locator('span')).toHaveCount(0);

	return {
		before,
		frames: await page.evaluate(() => window.gktFrames),
		after: await number.textContent(),
	};
}

test.describe('counter box number format', () => {
	test.beforeAll(async ({ requestUtils }) => {
		const pluginName = process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit';
		await requestUtils.activatePlugin(pluginName);
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deleteAllPosts();
	});

	test('counters saved before the option stay valid and serialize byte for byte', async ({
		page,
		admin,
	}) => {
		await admin.createNewPost();

		const result = await page.evaluate((content) => {
			const blocks = wp.blocks.parse(content);

			return {
				valid: blocks.every((block) => block.isValid),
				serialized: wp.blocks.serialize(blocks),
			};
		}, SAVED_COUNTERS);

		expect(result.valid).toBe(true);
		expect(result.serialized).toBe(SAVED_COUNTERS);
	});

	test('custom separators keep the decimals on every frame', async ({
		page,
		requestUtils,
	}) => {
		const post = await requestUtils.createPost({
			title: 'GKT counter custom',
			content: `${SPACER}\n\n${CUSTOM_COUNTER}`,
			status: 'publish',
		});

		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto(post.link);

		const { frames, after } = await countUp(page);

		expect(frames.length).toBeGreaterThan(3);
		for (const frame of frames) {
			expect(frame).toMatch(/^\d{1,3}(?: \d{3})*,\d{2} €$/);
		}
		expect(frames.at(-1)).toBe('1 234,50 €');
		expect(after).toBe('1 234,50 €');
	});

	test('site language format groups the number on every frame', async ({
		page,
		requestUtils,
	}) => {
		const post = await requestUtils.createPost({
			title: 'GKT counter locale',
			content: `${SPACER}\n\n${LOCALE_COUNTER}`,
			status: 'publish',
		});

		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto(post.link);

		await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');

		const { frames, after } = await countUp(page);

		expect(frames.length).toBeGreaterThan(3);
		for (const frame of frames) {
			expect(frame).toMatch(/^\d{1,3}(?:,\d{3})*\.\d$/);
		}
		expect(after).toBe('12,345.5');
	});

	test('reduced motion shows the final formatted value', async ({
		page,
		requestUtils,
	}) => {
		const post = await requestUtils.createPost({
			title: 'GKT counter reduced motion',
			content: `${CUSTOM_COUNTER}\n\n${LOCALE_COUNTER}`,
			status: 'publish',
		});

		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto(post.link);

		const numbers = page.locator('.ghostkit-count-up');

		await expect(numbers).toHaveText(['1 234,50 €', '12,345.5']);
	});

	test('assistive technology reads the final value while the number counts', async ({
		page,
		requestUtils,
	}) => {
		const post = await requestUtils.createPost({
			title: 'GKT counter accessibility',
			content: `${SPACER}\n\n${CUSTOM_COUNTER}`,
			status: 'publish',
		});

		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto(post.link);

		const number = page.locator('.ghostkit-count-up');

		await expect(number.locator('[aria-hidden="true"]')).toHaveText(
			'0,00 €'
		);
		expect(await number.ariaSnapshot()).toBe('- text: 1 234,50 €');

		const { after } = await countUp(page);

		expect(after).toBe('1 234,50 €');
		expect(await number.ariaSnapshot()).toBe('- text: 1 234,50 €');
	});

	test('counter without a format keeps its typed text for assistive technology', async ({
		page,
		requestUtils,
	}) => {
		const post = await requestUtils.createPost({
			title: 'GKT counter as typed',
			content: `${SPACER}\n\n${counter('250+', {}, 'data-count-from="200"')}`,
			status: 'publish',
		});

		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto(post.link);

		const { before, frames, after } = await countUp(page);

		expect(before).toBe('- text: 250+');
		for (const frame of frames) {
			expect(frame).toMatch(/^2[0-5]\d\+$/);
		}
		expect(after).toBe('250+');
	});

	test('custom separators are saved with the counter', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost();
		await editor.insertBlock({
			name: 'ghostkit/counter-box',
			attributes: { number: '1 234,5' },
		});
		await editor.openDocumentSettingsSidebar();

		const settings = page.getByRole('region', { name: 'Editor settings' });

		await expect(
			settings.getByRole('combobox', { name: 'Number format' })
		).toHaveCount(0);

		await settings.getByLabel('Animate in viewport').check();
		await settings
			.getByRole('combobox', { name: 'Number format' })
			.selectOption('custom');
		await settings
			.getByRole('textbox', { name: 'Thousands separator' })
			.fill(' ');
		await settings
			.getByRole('textbox', { name: 'Decimal separator' })
			.fill(',');

		expect(await editor.getEditedPostContent()).toContain(
			'data-count-format="custom" data-count-thousands=" " data-count-decimal=","'
		);

		await settings
			.getByRole('combobox', { name: 'Number format' })
			.selectOption('none');

		await expect(
			settings.getByRole('textbox', { name: 'Thousands separator' })
		).toHaveCount(0);
		expect(await editor.getEditedPostContent()).not.toContain(
			'data-count-format'
		);
	});
});
