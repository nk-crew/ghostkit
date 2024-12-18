import { maybeDecode } from '../../utils/encode-decode';
import getSiblings from '../../utils/get-siblings';

/**
 * Block Accordion
 */
const {
	location,
	GHOSTKIT,
	Motion: { animate },
	requestAnimationFrame,
} = window;

const { events } = GHOSTKIT;

let pageHash = location.hash;

const ANIMATION_SPEED = 400;

function getCurrentContentStyles($el) {
	return {
		display: $el.style.display,
		overflow: $el.style.overflow,
		height: $el.style.height,
		paddingTop: $el.style.paddingTop,
		paddingBottom: $el.style.paddingBottom,
	};
}
function resetContentStyles($el) {
	$el.style.display = '';
	$el.style.overflow = '';
	$el.style.height = '';
	$el.style.paddingTop = '';
	$el.style.paddingBottom = '';
}

function show($item, animationSpeed, cb) {
	const $button = $item.querySelector(
		'.ghostkit-accordion-item-heading > button'
	);
	const $content = $item.querySelector('.ghostkit-accordion-item-content');

	$item.classList.add('ghostkit-accordion-item-active');

	if ($button) {
		$button.setAttribute('aria-expanded', 'true');
	}

	const currentStyles = getCurrentContentStyles($content);

	resetContentStyles($content);

	const contentStyles = window.getComputedStyle($content);

	const endHeight = contentStyles.height;
	const endPaddingTop = contentStyles.paddingTop;
	const endPaddingBottom = contentStyles.paddingBottom;

	$content.style.display = 'block';
	$content.style.overflow = 'hidden';
	$content.style.height = currentStyles.height || 0;
	$content.style.paddingTop = currentStyles.paddingTop || 0;
	$content.style.paddingBottom = currentStyles.paddingBottom || 0;

	const animation = animate(
		$content,
		{
			height: endHeight,
			paddingTop: endPaddingTop,
			paddingBottom: endPaddingBottom,
		},
		{
			duration: animationSpeed / 1000,
			ease: [0.6, 0, 0.3, 1],
		}
	);

	animation.then(() => {
		// Check if animation stopped manually.
		const isStopped =
			$item.gktAccordion.animation?.animations?.[0]?.isStopped || false;

		if (!isStopped) {
			resetContentStyles($content);
		}

		$item.gktAccordion.animation = null;

		cb();
	});

	$item.gktAccordion.animation = animation;
}

function hide($item, animationSpeed, cb) {
	const $button = $item.querySelector(
		'.ghostkit-accordion-item-heading > button'
	);
	const $content = $item.querySelector('.ghostkit-accordion-item-content');

	$content.style.display = 'block';
	$content.style.overflow = 'hidden';

	const animation = animate(
		$content,
		{
			height: 0,
			paddingTop: 0,
			paddingBottom: 0,
		},
		{
			duration: animationSpeed / 1000,
			ease: [0.6, 0, 0.3, 1],
		}
	);

	animation.then(() => {
		// Check if animation stopped manually.
		const isStopped =
			$item.gktAccordion.animation?.animations?.[0]?.isStopped || false;

		if (!isStopped) {
			resetContentStyles($content);
		}

		$item.gktAccordion.animation = null;

		cb();
	});

	$item.gktAccordion.animation = animation;

	$item.classList.remove('ghostkit-accordion-item-active');

	if ($button) {
		$button.setAttribute('aria-expanded', 'false');
	}
}

/**
 * Toggle accordion item
 *
 * @param {Element} $heading       - heading element
 * @param {Int}     animationSpeed - animation speed
 * @param {boolean} skipCollapse   - skip collapse other items
 */
function toggleAccordionItem(
	$heading,
	animationSpeed = ANIMATION_SPEED,
	skipCollapse = false
) {
	const $accordion = $heading.closest('.ghostkit-accordion');
	const $item = $heading.closest('.ghostkit-accordion-item');
	const isActive = $item.classList.contains('ghostkit-accordion-item-active');
	const collapseOne =
		!skipCollapse &&
		$accordion.classList.contains('ghostkit-accordion-collapse-one');

	if (!$item?.gktAccordion) {
		$item.gktAccordion = {
			animation: null,
		};
	}

	if ($item.gktAccordion.animation) {
		$item.gktAccordion.animation.stop();
	}

	// Wait for the next frame to call this code after animation stopped.
	requestAnimationFrame(() => {
		if (isActive) {
			events.trigger($accordion, 'hide.accordion.gkt', {
				relatedTarget: $item,
			});

			hide($item, animationSpeed, () => {
				events.trigger($accordion, 'hidden.accordion.gkt', {
					relatedTarget: $item,
				});
			});
		} else {
			events.trigger($accordion, 'show.accordion.gkt', {
				relatedTarget: $item,
			});

			show($item, animationSpeed, () => {
				events.trigger($accordion, 'shown.accordion.gkt', {
					relatedTarget: $item,
				});
			});
		}

		// Hide all other elements
		if (collapseOne && !isActive) {
			getSiblings($item).forEach(($this) => {
				if (
					$this.classList.contains('ghostkit-accordion-item-active')
				) {
					toggleAccordionItem($this, animationSpeed, true);
				}
			});
		}
	});
}

/**
 * Prepare Accordions.
 */
events.on(document, 'init.blocks.gkt', () => {
	document
		.querySelectorAll('.ghostkit-accordion:not(.ghostkit-accordion-ready)')
		.forEach(($this) => {
			$this.classList.add('ghostkit-accordion-ready');

			events.trigger($this, 'prepare.accordion.gkt');

			// activate by page hash
			if (pageHash) {
				const pageHashEncoded = maybeDecode(pageHash);

				let $activeAccordion = $this.querySelector(
					`:scope > [data-accordion="${pageHashEncoded.replace('#', '')}"]:not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading > button`
				);

				// Legacy.
				if (!$activeAccordion) {
					$activeAccordion = $this.querySelector(
						`:scope > :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading > [href="${pageHashEncoded}"]`
					);
				}

				if ($activeAccordion) {
					toggleAccordionItem($activeAccordion, 0);
				}
			}

			events.trigger($this, 'prepared.accordion.gkt');
		});
});

/**
 * Click Accordions.
 */
events.on(
	document,
	'click',
	'.ghostkit-accordion-item .ghostkit-accordion-item-heading',
	(e) => {
		e.preventDefault();
		toggleAccordionItem(e.delegateTarget, ANIMATION_SPEED);
	}
);

/*
 * Activate item on hash change.
 */
const handlerActivateItem = () => {
	if (window.location.hash === pageHash) {
		return;
	}

	pageHash = window.location.hash;

	if (!pageHash) {
		return;
	}

	const pageHashEncoded = maybeDecode(pageHash);

	// Activate accordion item.
	document
		.querySelectorAll(
			`.ghostkit-accordion-ready > [data-accordion="${pageHashEncoded.replace('#', '')}"]:not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading > button,
			.ghostkit-accordion-ready > :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading > [href="${pageHashEncoded}"]`
		)
		.forEach(($this) => {
			toggleAccordionItem($this, ANIMATION_SPEED);
		});
};

events.on(window, 'hashchange', handlerActivateItem);
