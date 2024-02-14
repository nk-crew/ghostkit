import transitionCallback from '../../../assets/js/utils/transition-callback';
import { maybeDecode } from '../../utils/encode-decode';
import getSiblings from '../../utils/get-siblings';

/**
 * Block Tabs
 */
const {
	location,
	GHOSTKIT: { events },
} = window;

let pageHash = location.hash;

const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const HOME_KEY = 'Home';
const END_KEY = 'End';

function getTabByName($tabs, tabName) {
	const tabNameEncoded = maybeDecode(tabName);

	let $button = $tabs.querySelector(
		`:scope > .ghostkit-tabs-buttons > [data-tab="${tabNameEncoded}"]`
	);

	// Legacy tab name.
	if (!$button) {
		$button = $tabs.querySelector(
			`:scope > .ghostkit-tabs-buttons > [href="#${tabNameEncoded}"]`
		);
	}
	if (!$button) {
		$button = $tabs.querySelector(
			`:scope > .ghostkit-tabs-buttons > [href="${tabNameEncoded}"]`
		);
	}
	if (!$button) {
		$button = $tabs.querySelector(
			`:scope > .ghostkit-tabs-buttons > [href="#tab-${tabNameEncoded}"]`
		);
	}

	const $tab = $button
		? $tabs.querySelector(
				`:scope > .ghostkit-tabs-content > [data-tab="${tabNameEncoded.replace(
					/^#/,
					''
				)}"]`
			)
		: null;

	return [$button, $tab];
}

/**
 * Activate tab
 *
 * @param {Element} $tabs   - tabs block element
 * @param {string}  tabName - tab name
 *
 * @return {boolean} is tab activated.
 */
function activateTab($tabs, tabName) {
	const [$activeBtn, $activeTab] = getTabByName($tabs, tabName);

	if (!$activeBtn || !$activeTab) {
		return false;
	}

	// Show tab.
	events.trigger($tabs, 'show.tab.gkt', { relatedTarget: $activeTab });

	const isModern = $activeBtn.nodeName === 'BUTTON';

	$activeBtn.classList.add('ghostkit-tabs-buttons-item-active');

	if (isModern) {
		$activeBtn.removeAttribute('tabindex');
		$activeBtn.setAttribute('aria-selected', true);
	}

	$activeTab.classList.add('ghostkit-tab-active');

	transitionCallback(() => {
		events.trigger($tabs, 'shown.tab.gkt', { relatedTarget: $activeTab });
	}, $activeTab);

	// Hide all siblings.
	getSiblings($activeBtn).forEach(($this) => {
		if ($this.classList.contains('ghostkit-tabs-buttons-item-active')) {
			$this.classList.remove('ghostkit-tabs-buttons-item-active');

			if (isModern) {
				$this.setAttribute('aria-selected', false);
				$this.setAttribute('tabindex', -1);
			}
		}
	});
	getSiblings($activeTab).forEach(($this) => {
		if ($this.classList.contains('ghostkit-tab-active')) {
			events.trigger($tabs, 'hide.tab.gkt', { relatedTarget: $this });

			$this.classList.remove('ghostkit-tab-active');

			transitionCallback(() => {
				events.trigger($tabs, 'hidden.tab.gkt', {
					relatedTarget: $this,
				});
			}, $activeTab);
		}
	});

	return true;
}

/**
 * Prepare Tabs.
 */
events.on(document, 'init.blocks.gkt', () => {
	document
		.querySelectorAll('.ghostkit-tabs:not(.ghostkit-tabs-ready)')
		.forEach(($tabs) => {
			events.trigger($tabs, 'prepare.tabs.gkt');

			$tabs.classList.add('ghostkit-tabs-ready');

			const $buttons = $tabs.querySelector(
				`:scope > .ghostkit-tabs-buttons[role="tablist"]`
			);

			// Add tabindex -1 to inactive tabs.
			if ($buttons) {
				$buttons
					.querySelectorAll(':scope > .ghostkit-tabs-buttons-item')
					.forEach(($btn) => {
						if (
							!$btn.classList.contains(
								'ghostkit-tabs-buttons-item-active'
							)
						) {
							$btn.setAttribute('tabindex', '-1');
						}
					});
			}

			// activate by page hash
			let tabActivated = false;
			if (pageHash) {
				tabActivated = activateTab($tabs, pageHash.replace('#', ''));
			}

			// legacy
			const tabsActive = $tabs.getAttribute('data-tab-active');
			if (tabsActive) {
				if (!tabActivated) {
					tabActivated = activateTab($tabs, `#${tabsActive}`);
				}

				if (!tabActivated) {
					tabActivated = activateTab($tabs, tabsActive);
				}
			}

			events.trigger($tabs, 'prepared.tabs.gkt');
		});
});

/**
 * Click Tabs.
 */
events.on(document, 'click', '.ghostkit-tabs-buttons-item', (e) => {
	e.preventDefault();

	const $btn = e.delegateTarget;
	const $tab = $btn.closest('.ghostkit-tabs');
	const tabName = $btn.getAttribute('data-tab') || $btn.hash;

	activateTab($tab, tabName);
});

/**
 * Hover Tabs.
 */
events.on(
	document,
	'mouseenter',
	'.ghostkit-tabs-buttons-trigger-hover > .ghostkit-tabs-buttons .ghostkit-tabs-buttons-item',
	(e) => {
		const $btn = e.delegateTarget;
		const $tab = $btn.closest('.ghostkit-tabs');
		const tabName = $btn.getAttribute('data-tab') || $btn.hash;

		activateTab($tab, tabName);
	}
);

/*
 * Activate tab on keydown.
 */
events.on(
	document,
	'keydown',
	'.ghostkit-tabs-buttons[role="tablist"]',
	(e) => {
		if (
			![
				ARROW_LEFT_KEY,
				ARROW_RIGHT_KEY,
				ARROW_UP_KEY,
				ARROW_DOWN_KEY,
				HOME_KEY,
				END_KEY,
			].includes(e.key)
		) {
			return;
		}

		// stopPropagation/preventDefault both added to support up/down keys without scrolling the page.
		e.stopPropagation();
		e.preventDefault();

		const $buttons = e.delegateTarget.querySelectorAll(
			':scope > .ghostkit-tabs-buttons-item'
		);

		let $nextActiveTab;

		if ([HOME_KEY, END_KEY].includes(e.key)) {
			$nextActiveTab =
				$buttons[e.key === HOME_KEY ? 0 : $buttons.length - 1];
		} else {
			const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(e.key);
			const currentIndex = [].indexOf.call($buttons, e.target);

			if (isNext) {
				$nextActiveTab = $buttons[currentIndex + 1] ?? $buttons[0];
			} else {
				$nextActiveTab =
					$buttons[currentIndex - 1] ?? $buttons[$buttons.length - 1];
			}
		}

		if ($nextActiveTab) {
			$nextActiveTab.focus({ preventScroll: true });
			activateTab(
				$nextActiveTab.closest('.ghostkit-tabs'),
				$nextActiveTab.getAttribute('data-tab')
			);
		}
	}
);

/*
 * Activate tab on hash change.
 */
events.on(window, 'hashchange', function () {
	if (window.location.hash === pageHash) {
		return;
	}

	pageHash = window.location.hash;

	if (!pageHash) {
		return;
	}

	// Activate tab.
	document.querySelectorAll('.ghostkit-tabs-ready').forEach(($this) => {
		activateTab($this, pageHash.replace('#', ''));
	});
});
