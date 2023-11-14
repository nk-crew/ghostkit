/**
 * Event handler helper function.
 * Thanks to Bootstrap.
 */
import getjQuery from './get-jquery';

// TODO: once we move to the wp-scripts and it's eslint config,
// most probably these problems will be resolved.
/* eslint-disable prefer-const */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */

/**
 * Constants
 */
const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage
let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout',
};

const nativeEvents = new Set([
  'click',
  'dblclick',
  'mouseup',
  'mousedown',
  'contextmenu',
  'mousewheel',
  'DOMMouseScroll',
  'mouseover',
  'mouseout',
  'mousemove',
  'selectstart',
  'selectend',
  'keydown',
  'keypress',
  'keyup',
  'orientationchange',
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerleave',
  'pointercancel',
  'gesturestart',
  'gesturechange',
  'gestureend',
  'focus',
  'blur',
  'change',
  'reset',
  'select',
  'submit',
  'focusin',
  'focusout',
  'load',
  'unload',
  'beforeunload',
  'resize',
  'move',
  'DOMContentLoaded',
  'readystatechange',
  'error',
  'abort',
  'scroll',
]);

/**
 * Public methods
 */

const EventHandler = {};

/**
 * Private methods
 */

function hydrateObj(obj, meta = {}) {
  for (const [key, value] of Object.entries(meta)) {
    try {
      obj[key] = value;
    } catch {
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          return value;
        },
      });
    }
  }

  return obj;
}

function makeEventUid(element, uid) {
  return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++;
}

function getElementEvents(element) {
  const uid = makeEventUid(element);

  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};

  return eventRegistry[uid];
}

function bootstrapHandler(element, fn) {
  return function handler(event) {
    hydrateObj(event, { delegateTarget: element });

    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }

    return fn.apply(element, [event]);
  };
}

function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);

    for (let { target } = event; target && target !== this; target = target.parentNode) {
      // eslint-disable-next-line no-restricted-syntax
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue;
        }

        hydrateObj(event, { delegateTarget: target });

        if (handler.oneOff) {
          EventHandler.off(element, event.type, selector, fn);
        }

        return fn.apply(target, [event]);
      }
    }

    return false;
  };
}

function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find(
    (event) => event.callable === callable && event.delegationSelector === delegationSelector
  );
}

function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.ghostkit.button' --> 'click')
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}

function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
  const isDelegated = typeof handler === 'string';
  // TODO: tooltip passes `false` instead of selector, so we need to check
  const callable = isDelegated ? delegationFunction : handler || delegationFunction;
  let typeEvent = getTypeEvent(originalTypeEvent);

  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }

  return [isDelegated, callable, typeEvent];
}

function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  let [isDelegated, callable, typeEvent] = normalizeParameters(
    originalTypeEvent,
    handler,
    delegationFunction
  );

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (originalTypeEvent in customEvents) {
    const wrapFunction = (fn) => {
      return function (event) {
        if (
          !event.relatedTarget ||
          (event.relatedTarget !== event.delegateTarget &&
            !event.delegateTarget.contains(event.relatedTarget))
        ) {
          return fn.call(this, event);
        }

        return false;
      };
    };

    callable = wrapFunction(callable);
  }

  const events = getElementEvents(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);

  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;

    return;
  }

  const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = isDelegated
    ? bootstrapDelegationHandler(element, handler, callable)
    : bootstrapHandler(element, callable);

  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;

  element.addEventListener(typeEvent, fn, isDelegated);
}

function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (!fn) {
    return;
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};

  for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}

/**
 * Public methods
 */

EventHandler.on = function (element, event, handler, delegationFunction) {
  if (typeof event !== 'string' || !element) {
    return;
  }

  event.split(' ').forEach((originalTypeEvent) => {
    addHandler(element, originalTypeEvent, handler, delegationFunction, false);
  });
};

EventHandler.one = function (element, event, handler, delegationFunction) {
  if (typeof event !== 'string' || !element) {
    return;
  }

  event.split(' ').forEach((originalTypeEvent) => {
    addHandler(element, originalTypeEvent, handler, delegationFunction, true);
  });
};

EventHandler.off = function (element, event, handler, delegationFunction) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }

  event.split(' ').forEach((originalTypeEvent) => {
    const [isDelegated, callable, typeEvent] = normalizeParameters(
      originalTypeEvent,
      handler,
      delegationFunction
    );
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getElementEvents(element);
    const storeElementEvent = events[typeEvent] || {};
    const isNamespace = originalTypeEvent.startsWith('.');

    if (typeof callable !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!Object.keys(storeElementEvent).length) {
        return;
      }

      removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
      return;
    }

    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }

    for (const [keyHandlers, evt] of Object.entries(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');

      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        removeHandler(element, events, typeEvent, evt.callable, evt.delegationSelector);
      }
    }
  });
};

EventHandler.trigger = function (element, event, args) {
  if (typeof event !== 'string' || !element) {
    return null;
  }

  const $ = getjQuery();
  const typeEvent = getTypeEvent(event);
  const inNamespace = event !== typeEvent;

  let jQueryEvent = null;
  let bubbles = true;
  let nativeDispatch = true;
  let defaultPrevented = false;

  if (inNamespace && $) {
    jQueryEvent = $.Event(event, args);

    $(element).trigger(jQueryEvent);
    bubbles = !jQueryEvent.isPropagationStopped();
    nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
    defaultPrevented = jQueryEvent.isDefaultPrevented();
  }

  const evt = hydrateObj(new Event(event, { bubbles, cancelable: true }), args);

  if (defaultPrevented) {
    evt.preventDefault();
  }

  if (nativeDispatch) {
    element.dispatchEvent(evt);
  }

  if (evt.defaultPrevented && jQueryEvent) {
    jQueryEvent.preventDefault();
  }

  return evt;
};

export default EventHandler;
