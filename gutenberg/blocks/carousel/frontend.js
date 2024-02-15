/**
 * Block Carousel
 */
import getParents from '../../utils/get-parents';
import getSiblings from '../../utils/get-siblings';

const {
	GHOSTKIT: { screenSizes, events },
} = window;

function getSwiperVersion(Swiper) {
	let ver = 8;

	// in version 8 added new parameter `maxBackfaceHiddenSlides`.
	if (typeof Swiper.defaults.maxBackfaceHiddenSlides === 'undefined') {
		ver = 7;
	}

	// in version 7 added new parameter `rewind`.
	if (typeof Swiper.defaults.rewind === 'undefined') {
		ver = 6;
	}

	// in version 6 added new parameter `loopPreventsSlide`.
	if (typeof Swiper.defaults.loopPreventsSlide === 'undefined') {
		ver = 5;
	}

	return ver;
}

/**
 * Prepare Carousels.
 */
events.on(document, 'init.blocks.gkt', () => {
	if (typeof window.Swiper === 'undefined') {
		return;
	}

	document
		.querySelectorAll('.ghostkit-carousel:not(.ghostkit-carousel-ready)')
		.forEach(($carousel) => {
			const $items = $carousel.querySelector(
				':scope > .ghostkit-carousel-items'
			);
			const effect = $carousel.getAttribute('data-effect') || 'slide';
			const slidesPerView = parseInt(
				$carousel.getAttribute('data-slides-per-view'),
				10
			);

			const options = {
				speed:
					(parseFloat($carousel.getAttribute('data-speed')) || 0) *
					1000,
				effect,
				fadeEffect: {
					// fixed fade out for previous slider.
					crossFade: true,
				},
				spaceBetween:
					parseFloat($carousel.getAttribute('data-gap')) || 0,
				centeredSlides:
					$carousel.getAttribute('data-centered-slides') === 'true',
				freeMode: {
					enabled:
						$carousel.getAttribute('data-free-scroll') === 'true',
				},
				loop: $carousel.getAttribute('data-loop') === 'true',
				// This feature is cool, but not working properly when loop enabled
				// and fast clicking on previous button is not working properly
				// https://github.com/nolimits4web/swiper/issues/5945
				// loopPreventsSlide: false,
				autoplay: parseFloat($carousel.getAttribute('data-autoplay')) >
					0 && {
					delay:
						parseFloat($carousel.getAttribute('data-autoplay')) *
						1000,
					disableOnInteraction: false,
				},
				navigation: $carousel.getAttribute('data-show-arrows') ===
					'true' && {
					nextEl: '.ghostkit-carousel-arrow-next',
					prevEl: '.ghostkit-carousel-arrow-prev',
				},
				pagination: $carousel.getAttribute('data-show-bullets') ===
					'true' && {
					el: '.ghostkit-carousel-bullets',
					clickable: true,
					dynamicBullets:
						$carousel.getAttribute('data-dynamic-bullets') ===
						'true',
				},
				slidesPerView: 1,
				keyboard: true,
				grabCursor: true,
				preloadImages: false,

				// fixes text selection when swipe in the items gap.
				touchEventsTarget: 'container',

				// disable swiping on some elements.
				noSwipingSelector: 'input, textarea, .ghostkit-image-compare',
			};

			$carousel.classList.add('ghostkit-carousel-ready', 'swiper');
			$items.classList.add('swiper-wrapper');
			$items
				.querySelectorAll(':scope > .ghostkit-carousel-slide')
				.forEach(($slide) => {
					$slide.classList.add('swiper-slide');
				});

			// add arrows
			if (options.navigation) {
				const $prevArrowIcon = $carousel.querySelector(
					'.ghostkit-carousel-arrow-prev-icon'
				);
				const $nextArrowIcon = $carousel.querySelector(
					'.ghostkit-carousel-arrow-next-icon'
				);

				// Create and add arrow previous.
				const $prevArrow = document.createElement('div');
				$prevArrow.classList.add(
					'ghostkit-carousel-arrow',
					'ghostkit-carousel-arrow-prev'
				);
				$prevArrow.innerHTML = $prevArrowIcon.innerHTML;
				$carousel.append($prevArrow);

				// Create and add arrow next.
				const $nextArrow = document.createElement('div');
				$nextArrow.classList.add(
					'ghostkit-carousel-arrow',
					'ghostkit-carousel-arrow-next'
				);
				$nextArrow.innerHTML = $nextArrowIcon.innerHTML;
				$carousel.append($nextArrow);
			}

			// Add bullets.
			if (options.pagination) {
				const $bullets = document.createElement('div');
				$bullets.classList.add('ghostkit-carousel-bullets');
				$carousel.append($bullets);
			}

			// Calculate responsive.
			const breakPoints = {};
			if (effect !== 'fade' && !Number.isNaN(slidesPerView)) {
				let count = slidesPerView;
				let currentPoint = Math.min(screenSizes.length - 1, count - 1);

				for (; currentPoint >= 0; currentPoint -= 1) {
					if (
						count > 0 &&
						typeof screenSizes[currentPoint] !== 'undefined'
					) {
						breakPoints[screenSizes[currentPoint] + 1] = {
							slidesPerView: count,
						};
					}
					count -= 1;
				}

				options.slidesPerView = count || 1;
			}
			options.breakpoints = breakPoints;

			// Events.
			options.on = {
				// These events used to add fixes for
				// conflict with custom cursor movement.
				touchStart(swiper, evt) {
					events.trigger($carousel, 'touchStart.carousel.gkt', {
						originalEvent: evt,
					});
				},
				touchMove(swiper, evt) {
					events.trigger($carousel, 'touchMove.carousel.gkt', {
						originalEvent: evt,
					});
				},
				touchEnd(swiper, evt) {
					events.trigger($carousel, 'touchEnd.carousel.gkt', {
						originalEvent: evt,
					});
				},
			};

			// Fallbacks for old Swiper versions.
			(() => {
				const swiperVersion = getSwiperVersion(window.Swiper);

				// Since v7 used container class `swiper`, we should also add old `swiper-container` class.
				if (swiperVersion < 7) {
					$carousel.classList.add('swiper-container');
				}

				// Since v7 freeMode options moved under `freeMode` object.
				if (swiperVersion < 7) {
					options.freeMode = options.freeMode.enabled;
				}

				// Since v5 `breakpointsInverse` option is removed and it is now `true` by default, but in older versions it was `false`.
				if (swiperVersion >= 5) {
					options.breakpointsInverse = true;
				}
			})();

			events.trigger($carousel, 'init.carousel.gkt', { options });

			// init swiper
			new window.Swiper($carousel, options);

			events.trigger($carousel, 'inited.carousel.gkt', { options });
		});
});

/**
 * Autoplay pause/play on hover.
 */
events.on(
	document,
	'mouseenter',
	'.ghostkit-carousel-ready[data-autoplay-hover-pause="true"]',
	(e) => {
		const $slider = e.delegateTarget;

		if (
			!$slider?.swiper?.autoplay ||
			!$slider?.swiper?.params?.autoplay?.enabled
		) {
			return;
		}

		$slider.swiper.autoplay.stop();
	}
);
events.on(
	document,
	'mouseleave',
	'.ghostkit-carousel-ready[data-autoplay-hover-pause="true"]',
	(e) => {
		const $slider = e.delegateTarget;

		if (
			!$slider?.swiper?.autoplay ||
			!$slider?.swiper?.params?.autoplay?.enabled
		) {
			return;
		}

		$slider.swiper.autoplay.start();
	}
);

/**
 * Re-create slides duplicates.
 * https://github.com/nolimits4web/swiper/issues/2629
 */
events.on(
	document,
	'shown.tab.gkt shown.accordion.gkt move.image-compare.gkt closed.alert.gkt animated.counter.gkt',
	(e) => {
		const $el = e.delegateTarget;
		const $carousels = getParents($el);

		$carousels.forEach(($this) => {
			if (
				$this.classList.contains('ghostkit-carousel-ready') &&
				$this.getAttribute('data-loop') === 'true' &&
				$this.swiper
			) {
				const $slide = $el.closest('.swiper-slide');

				// Copy the content of duplicated slide to original when changed content inside duplicated slide.
				if (
					$slide &&
					$slide.classList.contains('swiper-slide-duplicate')
				) {
					getSiblings($slide).forEach(($slideSibling) => {
						if (
							$slideSibling.getAttribute(
								'data-swiper-slide-index'
							) ===
								$slide.getAttribute(
									'data-swiper-slide-index'
								) &&
							$slideSibling.classList.contains(
								':not(.swiper-slide-duplicate):first-child'
							)
						) {
							$slideSibling.innerHTML = $slide.innerHTML;
						}
					});

					// Recreate loop when changed content inside original slide.
				} else {
					$this.swiper.loopDestroy();
					$this.swiper.loopCreate();
				}
			}
		});
	}
);
