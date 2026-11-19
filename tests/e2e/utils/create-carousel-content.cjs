module.exports = async function createCarouselContent(page) {
	await page.waitForFunction(() =>
		[
			'ghostkit/carousel',
			'ghostkit/carousel-slide',
			'ghostkit/form',
			'ghostkit/form-field-text',
			'ghostkit/accordion',
			'ghostkit/accordion-item',
		].every((name) => window.wp?.blocks?.getBlockType(name))
	);
	return page.evaluate(() => {
		const { createBlock, serialize } = window.wp.blocks;
		return serialize([
			createBlock(
				'ghostkit/carousel',
				{
					slidesPerView: 3,
					centeredSlides: true,
					loop: true,
					showArrows: true,
					showBullets: true,
					autoplay: 0,
					speed: 0.2,
				},
				Array.from({ length: 3 }, (_, index) =>
					createBlock('ghostkit/carousel-slide', {}, [
						createBlock('core/paragraph', {
							content: `Slide ${index + 1}`,
						}),
						createBlock('ghostkit/form', {}, [
							createBlock('ghostkit/form-field-text', {
								label: `Field ${index + 1}`,
							}),
						]),
						...(index === 0
							? [
									createBlock(
										'ghostkit/accordion',
										{ itemsCount: 1, collapseOne: true },
										[
											createBlock(
												'ghostkit/accordion-item',
												{
													slug: 'carousel-details',
													heading: 'Details',
												},
												[
													createBlock(
														'core/paragraph',
														{
															content:
																'Nested content',
														}
													),
												]
											),
										]
									),
								]
							: []),
					])
				)
			),
		]);
	});
};
