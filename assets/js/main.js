/**
 * External dependencies
 */
import { throttle } from 'throttle-debounce';
import rafSchd from 'raf-schd';

const { GHOSTKIT } = window;
const { events } = GHOSTKIT;

events.trigger(document, 'init.gkt');

const initBlocksThrottled = throttle(
  200,
  rafSchd(() => {
    events.trigger(document, 'init.blocks.gkt');
  })
);

// Init blocks.
new window.MutationObserver(initBlocksThrottled).observe(document.documentElement, {
  childList: true,
  subtree: true,
});
