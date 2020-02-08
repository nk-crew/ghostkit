/**
* Block Accordion
*/
const {
    location,
    GHOSTKIT,
    jQuery: $,
} = window;

const $doc = $( document );
const $wnd = $( window );

let pageHash = location.hash;

/**
 * Activate accordion item
 *
 * @param {jQuery} $heading - heading element
 * @param {Int} animationSpeed - animation speed
 * @param {Object} self - ghostkit class object
 */
function activateAccordionItem( $heading, animationSpeed = 150, self ) {
    const $accordion = $heading.closest( '.ghostkit-accordion' );
    const $item = $heading.closest( '.ghostkit-accordion-item' );
    const $content = $item.find( '.ghostkit-accordion-item-content' );
    const isActive = $item.hasClass( 'ghostkit-accordion-item-active' );
    const collapseOne = $accordion.hasClass( 'ghostkit-accordion-collapse-one' );

    if ( isActive ) {
        $content.stop().css( 'display', 'block' ).slideUp( animationSpeed );
        $item.removeClass( 'ghostkit-accordion-item-active' );
    } else {
        $content.stop().css( 'display', 'none' ).slideDown( animationSpeed );
        $item.addClass( 'ghostkit-accordion-item-active' );
    }

    if ( collapseOne ) {
        const $collapseItems = $accordion.find( '.ghostkit-accordion-item-active' ).not( $item );
        if ( $collapseItems.length ) {
            $collapseItems.find( '.ghostkit-accordion-item-content' ).stop().css( 'display', 'block' ).slideUp( animationSpeed );
            $collapseItems.removeClass( 'ghostkit-accordion-item-active' );
        }
    }

    self.hasScrolled();
}

/**
 * Prepare Accordions.
 */
$doc.on( 'initBlocks.ghostkit', function( e, self ) {
    GHOSTKIT.triggerEvent( 'beforePrepareAccordions', self );

    $( '.ghostkit-accordion:not(.ghostkit-accordion-ready)' ).each( function() {
        const $this = $( this );

        $this.addClass( 'ghostkit-accordion-ready' );

        // click action
        $this.on( 'click', '.ghostkit-accordion-item .ghostkit-accordion-item-heading', function( evt ) {
            evt.preventDefault();

            activateAccordionItem( $( this ), 150, self );
        } );

        // activate by page hash
        if ( pageHash ) {
            const $activeAccordion = $this.find( `> :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading[href="${ pageHash }"]` );

            if ( $activeAccordion.length ) {
                activateAccordionItem( $activeAccordion, 0, self );
            }
        }
    } );

    GHOSTKIT.triggerEvent( 'afterPrepareAccordions', self );
} );

/*
 * Activate tab on hash change.
 */
$wnd.on( 'hashchange', () => {
    if ( window.location.hash === pageHash ) {
        return;
    }

    pageHash = window.location.hash;

    if ( ! pageHash ) {
        return;
    }

    // Activate accordion item.
    $( `.ghostkit-accordion-ready > :not(.ghostkit-accordion-item-active) > .ghostkit-accordion-item-heading[href="${ pageHash }"]` ).each( function() {
        activateAccordionItem( $( this ), 150, GHOSTKIT.classObject );
    } );
} );
