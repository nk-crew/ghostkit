/**
 * Prepare Numbered Lists with `start` attribute.
 */
const {
	GHOSTKIT: { events },
} = window;

events.on(document, 'init.blocks.gkt', () => {
	document
		.querySelectorAll('.is-style-styled:not(.is-style-styled-ready)')
		.forEach(($list) => {
			const start = parseInt($list.getAttribute('start'), 10);
			const isReversed = $list.getAttribute('reversed') !== null;
			const itemsCount = $list.children.length;

			$list.classList.add('is-style-styled-ready');

			if (isReversed) {
				$list.style.counterReset = `li ${(start || itemsCount) + 1}`;
			} else if (start) {
				$list.style.counterReset = `li ${start - 1}`;
			}

			events.trigger($list, 'prepare.numberedList.gkt');
		});
});
