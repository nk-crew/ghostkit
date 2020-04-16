/**
* Block Grid
*/
const $ = window.jQuery;
const $doc = $( document );

/**
 * Prepare Grid Fallback for v2.9 and higher.
 * Since v2.9 added inner block inside main wrapper to prevent bugs in TwentyTwenty theme.
 */
$doc.on( 'initBlocks.ghostkit', () => {
    $( '.ghostkit-grid > .ghostkit-col:eq(0)' ).each( function() {
        const $grid = $( this ).parent();
        const $cols = $grid.children( '.ghostkit-col' );

        $( '<div class="ghostkit-grid-inner">' ).append( $cols ).appendTo( $grid );
    } );
} );
