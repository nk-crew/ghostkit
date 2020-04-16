/**
* Block Button
*/
const $ = window.jQuery;
const $doc = $( document );

/**
 * Prepare Button Fallback for v2.9 and higher.
 * Since v2.9 added inner block inside main wrapper to prevent bugs in TwentyTwenty theme.
 */
$doc.on( 'initBlocks.ghostkit', () => {
    $( '.ghostkit-button-wrapper > .ghostkit-button:eq(0)' ).each( function() {
        const $wrap = $( this ).parent();
        const $buttons = $wrap.children( '.ghostkit-button' );

        $( '<div class="ghostkit-button-wrapper-inner">' ).append( $buttons ).appendTo( $wrap );
    } );
} );
