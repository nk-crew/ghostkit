/**
 * https://youmightnotneedjquery.com/#on
 *
 * Use the return value to remove that event listener, see #off
 * addEventListener(el, eventName, eventHandler);
 * Or when you want to delegate event handling
 * addEventListener(el, eventName, eventHandler, selector);
 *
 * @param {Element} el
 * @param {String} eventName
 * @param {Function} eventHandler
 * @param {String} selector
 * @return {Function}
 */
export default function addEventListener(el, eventName, eventHandler, selector) {
  let wrappedHandler;

  if (selector) {
    wrappedHandler = (e) => {
      if (!e.target) return;

      const targetEl = e.target.closest(selector);
      if (targetEl) {
        eventHandler.call(targetEl, e);
      }
    };

    el.addEventListener(eventName, wrappedHandler);
  } else {
    wrappedHandler = (e) => {
      eventHandler.call(el, e);
    };

    el.addEventListener(eventName, wrappedHandler);
  }

  return wrappedHandler;
}
