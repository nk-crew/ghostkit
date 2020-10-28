/**
* Image Compare Video
*/
import rafSchd from 'raf-schd';

const {
    jQuery: $,
} = window;

const $doc = $( document );

let $currentImageCompare = false;
let disabledTransition = false;

function movePosition( e ) {
    if ( $currentImageCompare ) {
        const rect = $currentImageCompare[ 0 ].getBoundingClientRect();
        const x = Math.max( 0, Math.min( 1, ( e.clientX - rect.left ) / rect.width ) );

        $currentImageCompare[ 0 ].style.setProperty( '--gkt-image-compare__position', `${ 100 * x }%` );
    }
}

$doc.on( 'mousedown', '.ghostkit-image-compare', function( e ) {
    e.preventDefault();

    $currentImageCompare = $( this );
} );
$doc.on( 'mouseup', ( e ) => {
    if ( $currentImageCompare ) {
        movePosition( e );

        $currentImageCompare[ 0 ].style.removeProperty( '--gkt-image-compare__transition-duration' );

        $currentImageCompare = false;
        disabledTransition = false;
    }
} );
$doc.on( 'mousemove', ( e ) => {
    if ( $currentImageCompare ) {
        e.preventDefault();

        if ( ! disabledTransition ) {
            $currentImageCompare[ 0 ].style.setProperty( '--gkt-image-compare__transition-duration', '0s' );

            disabledTransition = true;
        }
    }
} );
$doc.on( 'mousemove', rafSchd( ( e ) => {
    movePosition( e );
} ) );
