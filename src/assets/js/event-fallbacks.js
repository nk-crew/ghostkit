/**
 * Fallbacks for JS events for Ghost Kit < v3.0
 */
import getjQuery from './utils/get-jquery';

const { GHOSTKIT } = window;
const { events } = GHOSTKIT;

function trigger(name, ...args) {
  const $ = getjQuery();

  if ($) {
    $(document).trigger(`${name}.ghostkit`, [...args]);
  }
}
function getElement(element) {
  const $ = getjQuery();

  if ($) {
    return $(element);
  }

  return element;
}

let warnOnce = true;
GHOSTKIT.triggerEvent = (...args) => {
  if (warnOnce) {
    warnOnce = false;

    // eslint-disable-next-line no-console
    console.warn(
      'Using `GHOSTKIT.triggerEvent` function is deprecated since version 3.0.0. Please use `GHOSTKIT.events.trigger` function instead.'
    );
  }

  trigger(...args);
};

// Init.
events.on(document, 'init.gkt', () => {
  trigger('beforeInit', GHOSTKIT.class);

  window.requestAnimationFrame(() => {
    trigger('afterInit', GHOSTKIT.class);
  });
});

// Init blocks.
events.on(document, 'init.blocks.gkt', () => {
  trigger('beforeInitBlocks', GHOSTKIT.class);
  trigger('initBlocks', GHOSTKIT.class);

  trigger('beforePrepareNumberedLists', GHOSTKIT.class);
  trigger('beforePrepareCounters', GHOSTKIT.class);
  trigger('beforePrepareSR', GHOSTKIT.class);
  trigger('beforePrepareAccordions', GHOSTKIT.class);
  trigger('beforePrepareCarousels', GHOSTKIT.class);
  trigger('beforePrepareChangelog', GHOSTKIT.class);
  trigger('beforePrepareCountdown', GHOSTKIT.class);
  trigger('beforePrepareGist', GHOSTKIT.class);
  trigger('beforePrepareGoogleMaps', GHOSTKIT.class);
  trigger('beforePrepareTabs', GHOSTKIT.class);
  trigger('beforePrepareVideo', GHOSTKIT.class);

  window.requestAnimationFrame(() => {
    trigger('afterPrepareNumberedLists', GHOSTKIT.class);
    trigger('afterPrepareCounters', GHOSTKIT.class);
    trigger('afterPrepareSR', GHOSTKIT.class);
    trigger('afterPrepareAccordions', GHOSTKIT.class);
    trigger('afterPrepareCarousels', GHOSTKIT.class);
    trigger('afterPrepareChangelog', GHOSTKIT.class);
    trigger('afterPrepareCountdown', GHOSTKIT.class);
    trigger('afterPrepareGist', GHOSTKIT.class);
    trigger('afterPrepareGoogleMaps', GHOSTKIT.class);
    trigger('afterPrepareTabs', GHOSTKIT.class);
    trigger('afterPrepareVideo', GHOSTKIT.class);

    trigger('afterInitBlocks', GHOSTKIT.class);
  });
});

// Counters.
events.on(document, 'prepare.counter.gkt', ({ config }) => {
  trigger('prepareCounters', GHOSTKIT.class, config);
});
events.on(document, 'counted.counter.gkt', ({ config }) => {
  trigger('animatedCounters', GHOSTKIT.class, config);
});

// Scroll Reveal.
events.on(document, 'prepare.scrollReveal.gkt', ({ config, target }) => {
  trigger('beforePrepareSRStart', GHOSTKIT.class, getElement(target));
  trigger('beforeInitSR', GHOSTKIT.class, getElement(target), config);
});
events.on(document, 'prepared.scrollReveal.gkt', ({ target }) => {
  trigger('beforePrepareSREnd', GHOSTKIT.class, getElement(target));
});

// Accordion.
events.on(document, 'show.accordion.gkt hide.accordion.gkt', ({ relatedTarget }) => {
  trigger('toggleAccordionItem', GHOSTKIT.class, getElement(relatedTarget));
  trigger('activateAccordionItem', GHOSTKIT.class, getElement(relatedTarget));
});
events.on(document, 'shown.accordion.gkt hidden.accordion.gkt', ({ relatedTarget }) => {
  trigger('afterActivateAccordionItem', GHOSTKIT.class, getElement(relatedTarget));
});

// Alert.
events.on(document, 'closed.alert.gkt', ({ target }) => {
  trigger('dismissedAlert', GHOSTKIT.class, getElement(target));
});

// Carousel.
events.on(document, 'touchStart.carousel.gkt', ({ target, originalEvent }) => {
  trigger('swiperTouchStart', GHOSTKIT.class, target.swiper, originalEvent);
});
events.on(document, 'touchMove.carousel.gkt', ({ target, originalEvent }) => {
  trigger('swiperTouchMove', GHOSTKIT.class, target.swiper, originalEvent);
});
events.on(document, 'touchEnd.carousel.gkt', ({ target, originalEvent }) => {
  trigger('swiperTouchEnd', GHOSTKIT.class, target.swiper, originalEvent);
});

// Google Maps.
events.on(document, 'prepare.googleMaps.gkt', ({ target }) => {
  trigger('beforePrepareGoogleMapsStart', GHOSTKIT.class, getElement(target));
});
events.on(document, 'prepared.googleMaps.gkt', ({ target, instance }) => {
  trigger('beforePrepareGoogleMapsEnd', GHOSTKIT.class, getElement(target), instance);
});

// Image Compare.
events.on(document, 'move.imageCompare.gkt', ({ target, originalEvent }) => {
  trigger('movedImageCompare', GHOSTKIT.class, getElement(target), originalEvent);
});

// Tabs.
events.on(document, 'show.tab.gkt', ({ target }) => {
  window.requestAnimationFrame(() => {
    const tabNameEncoded = target.getAttribute('href');
    trigger('activateTab', GHOSTKIT.class, getElement(target), tabNameEncoded);
  });
});

// Video.
events.on(document, 'prepare.videoObserver.gkt', ({ config }) => {
  trigger('prepareVideoObserver', GHOSTKIT.class, config);
});
