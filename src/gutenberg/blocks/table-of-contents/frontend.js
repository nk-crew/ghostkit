/**
 * Internal dependencies
 */
import { maybeDecode } from '../../utils/encode-decode';

/**
 * Block TOC
 */
const $html = document.documentElement;

/**
 * Prepare TOCs click to link.
 */
function initSmoothScroll() {
  document.querySelectorAll('.ghostkit-toc a').forEach(($link) => {
    const handler = (evt) => {
      evt.preventDefault();

      if (!evt.target || !evt.target.hash) {
        return;
      }

      const offsetEl = document.getElementById(maybeDecode(evt.target.hash).substring(1));

      if (!offsetEl) {
        return;
      }

      let { top } = offsetEl.getBoundingClientRect();

      // Get offset from CSS.
      const scrollPadding = parseFloat(getComputedStyle($html)['scroll-padding-top']);

      if (scrollPadding) {
        top -= scrollPadding;
      } else {
        const $adminBar = document.getElementById('wpadminbar');

        // Admin bar offset.
        if ($adminBar && getComputedStyle($adminBar).position === 'fixed') {
          top -= $adminBar.getBoundingClientRect().height;
        }
      }

      // Limit max offset.
      top = Math.max(0, top);

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    };

    $link.addEventListener('click', handler);
  });
}

// If smooth scroll enabled in CSS, we don't need to run it with JS.
if (!('scrollBehavior' in $html.style) || getComputedStyle($html)['scroll-behavior'] !== 'smooth') {
  initSmoothScroll();
}
