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
    $( '.wp-block-ghostkit-tabs:not(.ghostkit-tabs-ready)' ).each( function() {
        const $this = $( this );
        const $tabsCont = $this.children( '.ghostkit-tabs-content' );
        const $tabsButtons = $this.children( '.ghostkit-tabs-buttons' );
        const tabsContent = {};

        $this.addClass( 'ghostkit-tabs-ready' );

        // get tabs count.
        let tabs = $this.attr( 'class' ).match( /ghostkit-tabs-\d+/ );
        if ( tabs && tabs[ 0 ] ) {
            tabs = tabs[ 0 ].match( /\d+/ );
        }
        if ( tabs && tabs[ 0 ] ) {
            tabs = parseInt( tabs[ 0 ], 10 );
        } else {
            return;
        }

        // get tabs active.
        let tabsActive = $this.attr( 'class' ).match( /ghostkit-tabs-active-\d+/ );
        if ( tabsActive && tabsActive[ 0 ] ) {
            tabsActive = tabsActive[ 0 ].match( /\d+/ );
        }
        if ( tabsActive && tabsActive[ 0 ] ) {
            tabsActive = parseInt( tabsActive[ 0 ], 10 );
        } else {
            tabsActive = 1;
        }

        // create tabs.
        for ( let k = 1; k <= tabs; k++ ) {
            const $content = $tabsCont.children( `.ghostkit-tab-${ k }` );
            let tabClasses = '';
            let getClassesFromContent = true;

            // move grid classes from the content items to the tab.
            $content.each( function() {
                const $contentItem = $( this );
                let itemClasses = $contentItem.attr( 'class' ) || '';
                let newItemClasses = '';
                itemClasses = itemClasses.split( ' ' );

                if ( itemClasses && itemClasses.length ) {
                    itemClasses.forEach( ( val ) => {
                        if ( ! /layout\-ghostkit|ghostkit\-tab/.test( val ) ) {
                            newItemClasses += ( newItemClasses ? ' ' : '' ) + val;
                        } else if ( getClassesFromContent ) {
                            tabClasses += ( tabClasses ? ' ' : '' ) + val;
                        }
                    } );

                    if ( tabClasses ) {
                        getClassesFromContent = false;
                    }
                }

                $contentItem.attr( 'class', newItemClasses );
            } );

            tabsContent[ k ] = $( `<div class="${ tabClasses || `ghostkit-tab-${ k }` }${ tabsActive === k ? ' ghostkit-tab-active' : '' }">` ).append( $content );
        }

        for ( const i in tabsContent ) {
            $tabsCont.append( tabsContent[ i ] );
        }

        // click action
        $this.on( 'click', '.ghostkit-tabs-buttons-item', function( e ) {
            e.preventDefault();

            const $thisBtn = $( this );

            $thisBtn.addClass( 'ghostkit-tabs-buttons-item-active' )
                .siblings().removeClass( 'ghostkit-tabs-buttons-item-active' );

            $tabsCont.children( `.ghostkit-tab-${ $thisBtn.attr( 'data-tab' ) }` )
                .addClass( 'ghostkit-tab-active' )
                .siblings().removeClass( 'ghostkit-tab-active' );
        } );
        $tabsButtons.find( `[data-tab="${ tabsActive }"]` ).click();
    } );
}

// dynamically watch for elements ready state.
let observer = false;
if ( typeof window.MutationObserver !== 'undefined' ) {
    observer = new window.MutationObserver( ( mutations ) => {
        let readyCustomStyles = false;
        let readyTabsBlock = false;

        mutations.forEach( function( mutation ) {
            if ( mutation.addedNodes && mutation.addedNodes.length ) {
                mutation.addedNodes.forEach( function( node ) {
                    if ( $( node ).is( '[data-ghostkit-styles]' ) ) {
                        readyCustomStyles = 1;
                    }
                    if ( $( node ).is( '.wp-block-ghostkit-tabs:not(.ghostkit-tabs-ready)' ) ) {
                        readyTabsBlock = 1;
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
} );
