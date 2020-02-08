/**
* Block TOC
*/
const {
    jQuery: $,
} = window;
const $doc = $( document );

/**
 * Prepare TOCs.
 */
$doc.on( 'click', '.ghostkit-toc a', function( evt ) {
    evt.preventDefault();

    if ( ! evt.target || ! evt.target.hash ) {
        return;
    }

    const offset = $( evt.target.hash ).offset();

    if ( typeof offset === 'undefined' ) {
        return;
    }

    let scrollTop = offset.top;

    const $adminBar = $( '#wpadminbar' );

    if ( $adminBar.length ) {
        if ( 'absolute' !== $adminBar.css( 'position' ) ) {
            scrollTop -= $adminBar.outerHeight();
        }
    }

    $( 'body, html' ).stop().animate( {
        scrollTop,
    }, 350 );
} );
