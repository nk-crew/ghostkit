/**
 * Internal dependencies
 */
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

/**
 * Activate tab
 *
 * @param {Element} $tabs   - tabs block element
 * @param {string}  tabName - tab name
 *
 * @return {boolean} is tab activated.
 */
function activateTab( $tabs, tabName ) {
	const isLegacy = ! /^#/g.test( tabName );
	let $activeBtn = false;
	const tabNameEncoded = maybeDecode( tabName );
	const $activeTab = $tabs.querySelector(
		`:scope > .ghostkit-tabs-content > [data-tab="${ tabNameEncoded.replace( /^#/, '' ) }"]`
	);

	if ( isLegacy ) {
		$activeBtn = $tabs.querySelector(
			`:scope > .ghostkit-tabs-buttons > [href="#tab-${ tabNameEncoded }"]`
		);
	} else {
		$activeBtn = $tabs.querySelector(
			`:scope > .ghostkit-tabs-buttons > [href="${ tabNameEncoded }"]`
		);
	}

	if ( ! $activeBtn || ! $activeTab ) {
		return false;
	}

	// Show tab.
	events.trigger( $tabs, 'show.tab.gkt', { relatedTarget: $activeTab } );

	$activeBtn.classList.add( 'ghostkit-tabs-buttons-item-active' );
	$activeTab.classList.add( 'ghostkit-tab-active' );

	transitionCallback( () => {
		events.trigger( $tabs, 'shown.tab.gkt', { relatedTarget: $activeTab } );
	}, $activeTab );

	// Hide all siblings.
	getSiblings( $activeBtn ).forEach( ( $this ) => {
		if ( $this.classList.contains( 'ghostkit-tabs-buttons-item-active' ) ) {
			$this.classList.remove( 'ghostkit-tabs-buttons-item-active' );
		}
	} );
	getSiblings( $activeTab ).forEach( ( $this ) => {
		if ( $this.classList.contains( 'ghostkit-tab-active' ) ) {
			events.trigger( $tabs, 'hide.tab.gkt', { relatedTarget: $this } );

			$this.classList.remove( 'ghostkit-tab-active' );

			transitionCallback( () => {
				events.trigger( $tabs, 'hidden.tab.gkt', { relatedTarget: $this } );
			}, $activeTab );
		}
	} );

	return true;
}

/**
 * Prepare Tabs.
 */
events.on( document, 'init.blocks.gkt', () => {
	document.querySelectorAll( '.ghostkit-tabs:not(.ghostkit-tabs-ready)' ).forEach( ( $tabs ) => {
		events.trigger( $tabs, 'prepare.tabs.gkt' );

		const tabsActive = $tabs.getAttribute( 'data-tab-active' );

		$tabs.classList.add( 'ghostkit-tabs-ready' );

		// activate by page hash
		let tabActivated = false;
		if ( pageHash ) {
			tabActivated = activateTab( $tabs, pageHash );
		}

		if ( ! tabActivated && tabsActive ) {
			tabActivated = activateTab( $tabs, `#${ tabsActive }` );
		}

		// legacy
		if ( ! tabActivated && tabsActive ) {
			tabActivated = activateTab( $tabs, tabsActive );
		}

		events.trigger( $tabs, 'prepared.tabs.gkt' );
	} );
} );

/**
 * Click Tabs.
 */
events.on( document, 'click', '.ghostkit-tabs-buttons-item', ( e ) => {
	e.preventDefault();

	const $btn = e.delegateTarget;
	const $tab = $btn.closest( '.ghostkit-tabs' );
	const tabName = $btn.getAttribute( 'data-tab' ) || $btn.hash;

	activateTab( $tab, tabName );
} );

/**
 * Hover Tabs.
 */
events.on(
	document,
	'mouseenter',
	'.ghostkit-tabs-buttons-trigger-hover > .ghostkit-tabs-buttons .ghostkit-tabs-buttons-item',
	( e ) => {
		const $btn = e.delegateTarget;
		const $tab = $btn.closest( '.ghostkit-tabs' );
		const tabName = $btn.getAttribute( 'data-tab' ) || $btn.hash;

		activateTab( $tab, tabName );
	}
);

/*
 * Activate tab on hash change.
 */
events.on( window, 'hashchange', function() {
	if ( window.location.hash === pageHash ) {
		return;
	}

	pageHash = window.location.hash;

	if ( ! pageHash ) {
		return;
	}

	// Activate tab.
	document.querySelectorAll( '.ghostkit-tabs-ready' ).forEach( ( $this ) => {
		activateTab( $this, pageHash );
	} );
} );
