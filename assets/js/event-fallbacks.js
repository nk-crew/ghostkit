/**
 * Fallbacks for JS events for Ghost Kit < v3.0
 */
import getjQuery from './utils/get-jquery';

const { GHOSTKIT } = window;
const { events } = GHOSTKIT;

class GhostKitFallbackClass {
	constructor() {
		const self = this;

		self.deprecatedWarning = self.deprecatedWarning.bind(self);
		self.initBlocks = self.deprecatedWarning.bind(self);
		self.initBlocksThrottled = self.deprecatedWarning.bind(self);
		self.prepareSR = self.deprecatedWarning.bind(self);
		self.prepareCounters = self.deprecatedWarning.bind(self);
		self.prepareNumberedLists = self.deprecatedWarning.bind(self);
		self.prepareFallbackCustomStyles = self.deprecatedWarning.bind(self);
	}

	deprecatedWarning() {
		// eslint-disable-next-line no-console
		console.warn(
			'Using `classObject` methods are deprecated since version 3.0.0. The main class object is removed and no more used.'
		);
	}
}

const classObject = new GhostKitFallbackClass();
GHOSTKIT.classObject = classObject;

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
	trigger('beforeInit', classObject);

	window.requestAnimationFrame(() => {
		trigger('afterInit', classObject);
	});
});

// Init blocks.
events.on(document, 'init.blocks.gkt', () => {
	trigger('beforeInitBlocks', classObject);
	trigger('initBlocks', classObject);

	trigger('beforePrepareNumberedLists', classObject);
	trigger('beforePrepareCounters', classObject);
	trigger('beforePrepareSR', classObject);
	trigger('beforePrepareAccordions', classObject);
	trigger('beforePrepareCarousels', classObject);
	trigger('beforePrepareChangelog', classObject);
	trigger('beforePrepareCountdown', classObject);
	trigger('beforePrepareGist', classObject);
	trigger('beforePrepareGoogleMaps', classObject);
	trigger('beforePrepareTabs', classObject);
	trigger('beforePrepareVideo', classObject);

	window.requestAnimationFrame(() => {
		trigger('afterPrepareNumberedLists', classObject);
		trigger('afterPrepareCounters', classObject);
		trigger('afterPrepareSR', classObject);
		trigger('afterPrepareAccordions', classObject);
		trigger('afterPrepareCarousels', classObject);
		trigger('afterPrepareChangelog', classObject);
		trigger('afterPrepareCountdown', classObject);
		trigger('afterPrepareGist', classObject);
		trigger('afterPrepareGoogleMaps', classObject);
		trigger('afterPrepareTabs', classObject);
		trigger('afterPrepareVideo', classObject);

		trigger('afterInitBlocks', classObject);
	});
});

// Counters.
events.on(document, 'prepare.counter.gkt', ({ config }) => {
	trigger('prepareCounters', classObject, config);
});
events.on(document, 'counted.counter.gkt', ({ config }) => {
	trigger('animatedCounters', classObject, config);
});

// Scroll Reveal.
events.on(document, 'prepare.scrollReveal.gkt', ({ config, target }) => {
	trigger('beforePrepareSRStart', classObject, getElement(target));
	trigger('beforeInitSR', classObject, getElement(target), config);
});
events.on(document, 'prepared.scrollReveal.gkt', ({ target }) => {
	trigger('beforePrepareSREnd', classObject, getElement(target));
});

// Accordion.
events.on(
	document,
	'show.accordion.gkt hide.accordion.gkt',
	({ relatedTarget }) => {
		trigger('toggleAccordionItem', classObject, getElement(relatedTarget));
		trigger(
			'activateAccordionItem',
			classObject,
			getElement(relatedTarget)
		);
	}
);
events.on(
	document,
	'shown.accordion.gkt hidden.accordion.gkt',
	({ relatedTarget }) => {
		trigger(
			'afterActivateAccordionItem',
			classObject,
			getElement(relatedTarget)
		);
	}
);

// Alert.
events.on(document, 'closed.alert.gkt', ({ target }) => {
	trigger('dismissedAlert', classObject, getElement(target));
});

// Carousel.
events.on(document, 'touchStart.carousel.gkt', ({ target, originalEvent }) => {
	trigger('swiperTouchStart', classObject, target.swiper, originalEvent);
});
events.on(document, 'touchMove.carousel.gkt', ({ target, originalEvent }) => {
	trigger('swiperTouchMove', classObject, target.swiper, originalEvent);
});
events.on(document, 'touchEnd.carousel.gkt', ({ target, originalEvent }) => {
	trigger('swiperTouchEnd', classObject, target.swiper, originalEvent);
});

// Google Maps.
events.on(document, 'prepare.googleMaps.gkt', ({ target }) => {
	trigger('beforePrepareGoogleMapsStart', classObject, getElement(target));
});
events.on(document, 'prepared.googleMaps.gkt', ({ target, instance }) => {
	trigger(
		'beforePrepareGoogleMapsEnd',
		classObject,
		getElement(target),
		instance
	);
});

// Image Compare.
events.on(document, 'move.imageCompare.gkt', ({ target, originalEvent }) => {
	trigger(
		'movedImageCompare',
		classObject,
		getElement(target),
		originalEvent
	);
});

// Tabs.
events.on(document, 'show.tab.gkt', ({ target }) => {
	window.requestAnimationFrame(() => {
		const tabNameEncoded = target.getAttribute('href');
		trigger('activateTab', classObject, getElement(target), tabNameEncoded);
	});
});

// Video.
events.on(document, 'prepare.videoObserver.gkt', ({ config }) => {
	trigger('prepareVideoObserver', classObject, config);
});
