import { maybeDecode } from '../../utils/encode-decode';

/**
 * Block TOC
 */
const $html = document.documentElement;
const { events } = window.GHOSTKIT;

/**
 * Prepare TOCs click to link.
 */
function initSmoothScroll() {
	events.on(document, 'click', '.ghostkit-toc a', (e) => {
		e.preventDefault();

		const $el = e.delegateTarget;

		if (!$el || !$el.hash) {
			return;
		}

		const offsetEl = document.getElementById(
			maybeDecode($el.hash).substring(1)
		);

		if (!offsetEl) {
			return;
		}

		let { top } = offsetEl.getBoundingClientRect();

		// Get offset from CSS.
		const scrollPadding = parseFloat(
			window.getComputedStyle($html)['scroll-padding-top']
		);

		if (scrollPadding) {
			top -= scrollPadding;
		} else {
			const $adminBar = document.getElementById('wpadminbar');

			// Admin bar offset.
			if (
				$adminBar &&
				window.getComputedStyle($adminBar).position === 'fixed'
			) {
				top -= $adminBar.getBoundingClientRect().height;
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
	!('scrollBehavior' in $html.style) ||
	window.getComputedStyle($html)['scroll-behavior'] !== 'smooth'
) {
	initSmoothScroll();
}
