/**
* Block Countdown
*/
import countDownApi from './api';

const {
    GHOSTKIT,
    jQuery: $,
    moment,
} = window;

const $doc = $( document );

/**
 * Prepare Countdowns.
 */
$doc.on( 'initBlocks.ghostkit', ( e, self ) => {
    function updateUnits( momentData, units, unitsElements, $this ) {
        const dateData = countDownApi( momentData.toDate(), moment().toDate(), units, 0 );
        const isEnd = 0 <= dateData.value;

        if ( isEnd ) {
            $this.children( '.ghostkit-countdown-unit' ).hide();
            $this.children( '.ghostkit-countdown-expire-action' ).show();
            return;
        }

        Object.keys( unitsElements ).forEach( ( unitName ) => {
            let formattedUnit = false;

            if ( dateData && 'undefined' !== typeof dateData[ unitName ] ) {
                formattedUnit = countDownApi.formatUnit( dateData[ unitName ], unitName );
            }

            const newNumber = formattedUnit ? formattedUnit.number : '00';
            const newLabel = formattedUnit ? formattedUnit.label : unitName;

            if ( unitsElements[ unitName ].$number.html() !== newNumber ) {
                unitsElements[ unitName ].$number.html( newNumber );
            }
            if ( unitsElements[ unitName ].$label.html() !== newLabel ) {
                unitsElements[ unitName ].$label.html( newLabel );
            }
        } );

        setTimeout( () => {
            updateUnits( momentData, units, unitsElements, $this );
        }, countDownApi.getDelay( units ) );
    }

    GHOSTKIT.triggerEvent( 'beforePrepareCountdown', self );

    $( '.ghostkit-countdown:not(.ghostkit-countdown-ready)' ).each( function() {
        const $this = $( this );
        $this.addClass( 'ghostkit-countdown-ready' );

        const momentData = moment( $this.attr( 'data-date' ) );
        const unitsElements = [];
        const units = [
            'years',
            'months',
            'weeks',
            'days',
            'hours',
            'minutes',
            'seconds',
        ].filter( ( unitName ) => {
            const $unit = $this.children( `.ghostkit-countdown-unit-${ unitName }` );

            if ( $unit.length ) {
                unitsElements[ unitName ] = {
                    $number: $unit.find( '.ghostkit-countdown-unit-number' ),
                    $label: $unit.find( '.ghostkit-countdown-unit-label' ),
                };
                return true;
            }

            return false;
        } );

        updateUnits( momentData, units, unitsElements, $this );
    } );

    GHOSTKIT.triggerEvent( 'afterPrepareCountdown', self );
} );
