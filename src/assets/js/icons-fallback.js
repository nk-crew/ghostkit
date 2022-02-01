/**
 * Fallback for old icons.
 */
import { throttle } from 'throttle-debounce';

const { jQuery: $, ghostkitIconsFallback } = window;
const $doc = $(document);

const maybeReplaceIcons = throttle(300, () => {
  Object.keys(ghostkitIconsFallback).forEach((name) => {
    const icon = ghostkitIconsFallback[name];
    const $oldIcons = $(
      '.ghostkit-icon-box-icon, .ghostkit-alert-icon, .ghostkit-accordion-item-collapse, .ghostkit-button-icon, .ghostkit-carousel-arrow, .ghostkit-divider-icon, .ghostkit-testimonial-icon, .ghostkit-testimonial-stars-front > span, .ghostkit-testimonial-stars-back > span, .ghostkit-video-play-icon, .ghostkit-video-loading-icon, .ghostkit-video-fullscreen-close-icon, .ghostkit-video-fullscreen-close'
    ).children(`span[class="${name}"]`);

    if ($oldIcons.length) {
      $oldIcons.replaceWith(icon);
    }
  });
});

$doc.on('initBlocks.ghostkit', maybeReplaceIcons);
$(maybeReplaceIcons);
