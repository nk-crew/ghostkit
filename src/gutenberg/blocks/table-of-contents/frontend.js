/**
 * Internal dependencies
 */
import { maybeDecode } from '../../utils/encode-decode';

/**
 * Block TOC
 */
const { jQuery: $ } = window;
const $doc = $(document);
const $html = $('html');

/**
 * Prepare TOCs click to link.
 */
function initSmoothScroll() {
  $doc.on('click', '.ghostkit-toc a', (evt) => {
    evt.preventDefault();

    if (!evt.target || !evt.target.hash) {
      return;
    }

    const offset = $(maybeDecode(evt.target.hash)).offset();

    if ('undefined' === typeof offset) {
      return;
    }

    let { top } = offset;

    // Get offset from CSS.
    const scrollPadding = parseFloat($html.css('scroll-padding-top'));

    if (scrollPadding) {
      top -= scrollPadding;
    } else {
      const $adminBar = $('#wpadminbar');

      // Admin bar offset.
      if ($adminBar.length && 'fixed' === $adminBar.css('position')) {
        top -= $adminBar.outerHeight();
      }
    }

    // Limit max offset.
    top = Math.max(0, top);

    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  });
}

// If smooth scroll enabled in CSS, we don't need to run it with JS.
if (
  !('scrollBehavior' in document.documentElement.style) ||
  'smooth' !== $html.css('scroll-behavior')
) {
  initSmoothScroll();
}
