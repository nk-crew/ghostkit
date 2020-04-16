/**
* Block Pricing Table
*/
const $ = window.jQuery;
const $doc = $( document );

/**
 * Prepare Pricing Table Fallback for v2.9 and higher.
 * Since v2.9 added inner block inside main wrapper to prevent bugs in TwentyTwenty theme.
 */
$doc.on( 'initBlocks.ghostkit', () => {
    $( '.ghostkit-pricing-table > .ghostkit-pricing-table-item-wrap:eq(0)' ).each( function() {
        const $wrap = $( this ).parent();
        const $items = $wrap.children( '.ghostkit-pricing-table-item-wrap' );

        $( '<div class="ghostkit-pricing-table-inner">' ).append( $items ).appendTo( $wrap );
    } );
} );
