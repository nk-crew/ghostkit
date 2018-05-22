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
        let $style = $( '#ghostkit-blocks-custom-css' );
        if ( ! $style.length ) {
            $style = $( '<style id="ghostkit-blocks-custom-css">' ).appendTo( 'head' );
        }
        $style.html( customStyles );
    }
}

/**
 * Prepare Grid Columns
 */
function prepareGrid() {
    $( '.wp-block-ghostkit-grid:not(.ghostkit-grid-ready)' ).each( function() {
        const $this = $( this );
        const columnsContent = {};

        $this.addClass( 'ghostkit-grid-ready' );

        // get columns count.
        let columns = $this.attr( 'class' ).match( /ghostkit-grid-cols-\d+/ );
        if ( columns && columns[ 0 ] ) {
            columns = columns[ 0 ].match( /\d+/ );
        }
        if ( columns && columns[ 0 ] ) {
            columns = parseInt( columns[ 0 ], 10 );
        } else {
            return;
        }

        // create columns.
        for ( let k = 1; k <= columns; k++ ) {
            const $content = $this.children( `.ghostkit-col-${ k }` );
            let columnClasses = '';
            let getClassesFromContent = true;

            // move grid classes from the content items to the column.
            $content.each( function() {
                const $contentItem = $( this );
                let itemClasses = $contentItem.attr( 'class' ) || '';
                let newItemClasses = '';
                itemClasses = itemClasses.split( ' ' );

                if ( itemClasses && itemClasses.length ) {
                    itemClasses.forEach( ( val ) => {
                        if ( ! /layout\-ghostkit|ghostkit\-col/.test( val ) ) {
                            newItemClasses += ( newItemClasses ? ' ' : '' ) + val;
                        } else if ( getClassesFromContent ) {
                            columnClasses += ( columnClasses ? ' ' : '' ) + val;
                        }
                    } );

                    if ( columnClasses ) {
                        getClassesFromContent = false;
                    }
                }

                $contentItem.attr( 'class', newItemClasses );
            } );

            columnsContent[ k ] = $( `<div class="${ columnClasses || `ghostkit-col-${ k }` }">` ).append( $content );
        }

        for ( const i in columnsContent ) {
            $this.append( columnsContent[ i ] );
        }
    } );
}

// dynamically watch for elements ready state.
let observer = false;
if ( typeof window.MutationObserver !== 'undefined' ) {
    observer = new window.MutationObserver( ( mutations ) => {
        let readyCustomStyles = false;
        let readyGridBlock = false;

        mutations.forEach( function( mutation ) {
            if ( mutation.addedNodes && mutation.addedNodes.length ) {
                mutation.addedNodes.forEach( function( node ) {
                    if ( $( node ).is( '[data-ghostkit-styles]' ) ) {
                        readyCustomStyles = 1;
                    }
                    if ( $( node ).is( '.ghostkit-grid:not(.ghostkit-grid-ready)' ) ) {
                        readyGridBlock = 1;
                    }
                } );
            }
        } );

        if ( readyCustomStyles ) {
            prepareCustomStyles();
        }
        if ( readyGridBlock ) {
            prepareGrid();
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
    prepareGrid();
} );
