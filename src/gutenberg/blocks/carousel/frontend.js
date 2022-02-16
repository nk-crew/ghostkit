/**
 * Block Carousel
 */
const { GHOSTKIT, jQuery: $ } = window;
const $doc = $(document);

/**
 * Prepare Carousels.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  if ('undefined' === typeof window.Swiper) {
    return;
  }

  GHOSTKIT.triggerEvent('beforePrepareCarousels', self);

  $('.ghostkit-carousel:not(.ghostkit-carousel-ready)').each(function () {
    const $carousel = $(this);
    const $items = $carousel.children('.ghostkit-carousel-items');
    const effect = $carousel.attr('data-effect') || 'slide';
    const slidesPerView = parseInt($carousel.attr('data-slides-per-view'), 10);

    const options = {
      speed: (parseFloat($carousel.attr('data-speed')) || 0) * 1000,
      effect,
      fadeEffect: {
        // fixed fade out for previous slider.
        crossFade: true,
      },
      spaceBetween: parseFloat($carousel.attr('data-gap')) || 0,
      centeredSlides: 'true' === $carousel.attr('data-centered-slides'),
      freeMode: 'true' === $carousel.attr('data-free-scroll'),
      loop: 'true' === $carousel.attr('data-loop'),
      autoplay: 0 < parseFloat($carousel.attr('data-autoplay')) && {
        delay: parseFloat($carousel.attr('data-autoplay')) * 1000,
        disableOnInteraction: false,
      },
      navigation: 'true' === $carousel.attr('data-show-arrows') && {
        nextEl: '.ghostkit-carousel-arrow-next',
        prevEl: '.ghostkit-carousel-arrow-prev',
      },
      pagination: 'true' === $carousel.attr('data-show-bullets') && {
        el: '.ghostkit-carousel-bullets',
        clickable: true,
        dynamicBullets: 'true' === $carousel.attr('data-dynamic-bullets'),
      },
      slidesPerView: 1,
      keyboard: true,
      grabCursor: true,
    };

    $carousel.addClass('ghostkit-carousel-ready swiper-container');
    $items.addClass('swiper-wrapper');
    $items.children().addClass('swiper-slide');

    // add arrows
    if (options.navigation) {
      let $prevArrowIcon = $carousel.find('.ghostkit-carousel-arrow-prev-icon');
      let $nextArrowIcon = $carousel.find('.ghostkit-carousel-arrow-next-icon');

      if ($prevArrowIcon.length) {
        $prevArrowIcon = $prevArrowIcon.html();
      } else if ($carousel.attr('data-arrow-prev-icon')) {
        $prevArrowIcon = `<span class="${$carousel.attr('data-arrow-prev-icon')}"></span>`;
      } else {
        $prevArrowIcon = '';
      }

      if ($nextArrowIcon.length) {
        $nextArrowIcon = $nextArrowIcon.html();
      } else if ($carousel.attr('data-arrow-next-icon')) {
        $nextArrowIcon = `<span class="${$carousel.attr('data-arrow-next-icon')}"></span>`;
      } else {
        $nextArrowIcon = '';
      }

      $carousel.append(`
        <div class="ghostkit-carousel-arrow ghostkit-carousel-arrow-prev">${$prevArrowIcon}</div>
        <div class="ghostkit-carousel-arrow ghostkit-carousel-arrow-next">${$nextArrowIcon}</div>
      `);
    }

    // add bullets
    if (options.pagination) {
      $carousel.append('<div class="ghostkit-carousel-bullets"></div>');
    }

    // calculate responsive.
    const breakPoints = {};
    if ('fade' !== effect && !Number.isNaN(slidesPerView)) {
      let count = slidesPerView;
      let currentPoint = Math.min(self.screenSizes.length - 1, count - 1);

      for (; 0 <= currentPoint; currentPoint -= 1) {
        if (0 < count && 'undefined' !== typeof self.screenSizes[currentPoint]) {
          breakPoints[self.screenSizes[currentPoint] + 1] = {
            slidesPerView: count,
          };
        }
        count -= 1;
      }

      options.slidesPerView = count || 1;
    }
    options.breakpoints = breakPoints;

    // Since Swiper 5.0 this option is removed and it is `true` by default, but in older versions it was `false`.
    // So we need to keep it as a fallback.
    options.breakpoints.breakpointsInverse = true;

    // Events.
    options.on = {
      // These events used to add fixes for
      // conflict with custom cursor movement.
      touchStart(swiper, evt) {
        GHOSTKIT.triggerEvent('swiperTouchStart', self, swiper, evt);
      },
      touchMove(swiper, evt) {
        GHOSTKIT.triggerEvent('swiperTouchMove', self, swiper, evt);
      },
      touchEnd(swiper, evt) {
        GHOSTKIT.triggerEvent('swiperTouchEnd', self, swiper, evt);
      },
    };

    // init swiper
    // eslint-disable-next-line no-new
    new window.Swiper($carousel[0], options);

    // autoplay hover pause.
    if ('true' === $carousel.attr('data-autoplay-hover-pause') && options.autoplay) {
      $carousel.on('mouseenter', () => {
        $carousel[0].swiper.autoplay.stop();
      });
      $carousel.on('mouseleave', () => {
        $carousel[0].swiper.autoplay.start();
      });
    }
  });

  GHOSTKIT.triggerEvent('afterPrepareCarousels', self);
});

/**
 * Re-create slides duplicates.
 * https://github.com/nolimits4web/swiper/issues/2629
 */
$doc.on('activateTab.ghostkit afterActivateAccordionItem.ghostkit', (e, self, $item) => {
  const $carousels = $item.parents('.ghostkit-carousel-ready');

  $carousels.each(function () {
    if (this.swiper) {
      this.swiper.loopDestroy();
      this.swiper.loopCreate();
    }
  });
});
