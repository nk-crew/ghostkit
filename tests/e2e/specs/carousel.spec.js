import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import createCarouselContent from '../utils/create-carousel-content.cjs';

test('short carousel keeps its loop, columns and nested state', async ({
	page,
	admin,
	requestUtils,
}) => {
	await requestUtils.activatePlugin(
		process.env.CORE ? 'ghost-kit-pro' : 'ghost-kit'
	);
	await admin.createNewPost();
	const content = await createCarouselContent(page);
	const post = await requestUtils.createPost({
		title: 'Carousel compatibility',
		content,
		status: 'publish',
	});
	try {
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto(post.link);
		const root = page.locator('.ghostkit-carousel');
		await expect
			.poll(() => root.evaluate((el) => Boolean(el.swiper?.initialized)))
			.toBe(true);
		await expect
			.poll(() => root.evaluate((el) => el.swiper.params.slidesPerView))
			.toBe(3);
		expect(
			await root.evaluate(
				(el) => el.swiper.constructor === window.GhostKitSwiper
			)
		).toBe(true);
		await expect(
			root.locator(
				':scope > .ghostkit-carousel-bullets > .swiper-pagination-bullet'
			)
		).toHaveCount(3);
		const field = root.locator(
			'.ghostkit-carousel-slide:not(.swiper-slide-duplicate)[data-swiper-slide-index="0"] .ghostkit-form-field-text input[type="text"]'
		);
		await field.fill('retained');
		await field.evaluate((el) => {
			window.carouselOriginalField = el;
		});
		for (let index = 1; index <= 9; index += 1) {
			await expect
				.poll(() => root.evaluate((el) => el.swiper.animating))
				.toBe(false);
			await root
				.locator(':scope > .ghostkit-carousel-arrow-next')
				.click();
			await expect
				.poll(() => root.evaluate((el) => el.swiper.realIndex))
				.toBe(index % 3);
		}
		await expect
			.poll(() => root.evaluate((el) => el.swiper.animating))
			.toBe(false);
		await root
			.locator('.swiper-slide-active')
			.getByRole('button', { name: 'Details', exact: true })
			.click();
		await expect(
			root
				.locator('.swiper-slide-active')
				.getByRole('button', { name: 'Details', exact: true })
		).toHaveAttribute('aria-expanded', 'true');
		await expect(field).toHaveValue('retained');
		expect(
			await field.evaluate((el) => el === window.carouselOriginalField)
		).toBe(true);
		await expect
			.poll(() =>
				root.evaluate((el) =>
					Array.from(
						el.querySelectorAll(
							'[data-swiper-slide-index="0"] [aria-expanded]'
						)
					).every(
						(button) =>
							button.getAttribute('aria-expanded') === 'true'
					)
				)
			)
			.toBe(true);
	} finally {
		await requestUtils.rest({
			path: `/wp/v2/posts/${post.id}`,
			method: 'DELETE',
			params: { force: true },
		});
	}
});
