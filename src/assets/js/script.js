const $ = window.jQuery;

/**
 * Prepare custom styles.
 */
let customStyles = '';
function prepareCustomStyles() {
    let reloadStyles = false;
    $( '[data-ghostkit-styles]' ).each( function() {
        const $this = $( this );
        customStyles += window.GHOSTKIT.replaceVars( $this.attr( 'data-ghostkit-styles' ) );
        $this.removeAttr( 'data-ghostkit-styles' );
        reloadStyles = true;
    } );

    if ( reloadStyles ) {
        let $style = $( '#ghostkit-blocks-custom-css-inline-css' );
        if ( ! $style.length ) {
            $style = $( '<style id="ghostkit-blocks-custom-css-inline-css">' ).appendTo( 'head' );
        }
        $style.html( customStyles );
    }
}

/**
 * Prepare Tabs
 */
function prepareTabs() {
    $( '.ghostkit-tabs:not(.ghostkit-tabs-ready)' ).each( function() {
        const $this = $( this );
        const $tabsCont = $this.children( '.ghostkit-tabs-content' );
        const $tabsButtons = $this.children( '.ghostkit-tabs-buttons' );
        const tabsActive = $this.attr( 'data-tab-active' );

        $this.addClass( 'ghostkit-tabs-ready' );

        // click action
        $this.on( 'click', '.ghostkit-tabs-buttons-item', function( e ) {
            e.preventDefault();

            const $thisBtn = $( this );

            $thisBtn.addClass( 'ghostkit-tabs-buttons-item-active' )
                .siblings().removeClass( 'ghostkit-tabs-buttons-item-active' );

            $tabsCont.children( `[data-tab="${ $thisBtn.attr( 'data-tab' ) }"]` )
                .addClass( 'ghostkit-tab-active' )
                .siblings().removeClass( 'ghostkit-tab-active' );
        } );
        $tabsButtons.find( `[data-tab="${ tabsActive }"]` ).click();
    } );
}

/**
 * Prepare Accordions
 */
function prepareAccordions() {
    $( '.ghostkit-accordion:not(.ghostkit-accordion-ready)' ).each( function() {
        $( this ).addClass( 'ghostkit-accordion-ready' )
            .on( 'click', '.ghostkit-accordion-item .ghostkit-accordion-item-heading', function( e ) {
                e.preventDefault();

                const $heading = $( this );
                const $item = $heading.closest( '.ghostkit-accordion-item' );
                const $content = $item.find( '.ghostkit-accordion-item-content' );
                const isActive = $item.hasClass( 'ghostkit-accordion-item-active' );

                if ( isActive ) {
                    $content.css( 'display', 'block' ).slideUp( 150 );
                    $item.removeClass( 'ghostkit-accordion-item-active' );
                } else {
                    $content.css( 'display', 'none' ).slideDown( 150 );
                    $item.addClass( 'ghostkit-accordion-item-active' );
                }
            } );
    } );
}

// dynamically watch for elements ready state.
let observer = false;
if ( typeof window.MutationObserver !== 'undefined' ) {
    observer = new window.MutationObserver( ( mutations ) => {
        let readyCustomStyles = false;
        let readyTabsBlock = false;
        let readyAccordionBlock = false;

        mutations.forEach( function( mutation ) {
            if ( mutation.addedNodes && mutation.addedNodes.length ) {
                mutation.addedNodes.forEach( function( node ) {
                    if ( $( node ).is( '[data-ghostkit-styles]' ) ) {
                        readyCustomStyles = 1;
                    }
                    if ( $( node ).is( '.ghostkit-tabs:not(.ghostkit-tabs-ready)' ) ) {
                        readyTabsBlock = 1;
                    }
                    if ( $( node ).is( '.ghostkit-accordion:not(.ghostkit-accordion-ready)' ) ) {
                        readyAccordionBlock = 1;
                    }
                } );
            }
        } );

        if ( readyCustomStyles ) {
            prepareCustomStyles();
        }
        if ( readyTabsBlock ) {
            prepareTabs();
        }
        if ( readyAccordionBlock ) {
            prepareAccordions();
        }
    } );

    observer.observe( document.documentElement, {
        childList: true,
        subtree: true,
    } );
}

// on dom ready.
$( document ).on( 'DOMContentLoaded load', () => {
    // disconnect mutation observer.
    if ( observer ) {
        observer.disconnect();
        observer = false;
    }

    prepareCustomStyles();
    prepareTabs();
    prepareAccordions();
} );
