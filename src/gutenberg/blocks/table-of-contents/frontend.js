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
$doc.on( 'click', '.ghostkit-toc a', ( evt ) => {
    evt.preventDefault();

    if ( ! evt.target || ! evt.target.hash ) {
        return;
    }

    const offset = $( evt.target.hash ).offset();

    if ( 'undefined' === typeof offset ) {
        return;
    }

    let scrollTop = offset.top;

    const $adminBar = $( '#wpadminbar' );

    if ( $adminBar.length ) {
        if ( 'absolute' !== $adminBar.css( 'position' ) ) {
            scrollTop -= $adminBar.outerHeight();
        }
    }

    window.scrollTo( {
        top: scrollTop,
        behavior: 'smooth',
    } );
} );
