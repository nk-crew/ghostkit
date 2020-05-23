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

    const $adminBar = $( '#wpadminbar' );
    let { top } = offset;

    // Admin bar offset.
    if ( $adminBar.length && 'fixed' === $adminBar.css( 'position' ) ) {
        top -= $adminBar.outerHeight();
    }

    // Limit max offset.
    top = Math.max( 0, top );

    window.scrollTo( {
        top,
        behavior: 'smooth',
    } );
} );
