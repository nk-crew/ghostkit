
// parse data from Scroll Reveal string.
// fade-right;duration:500;delay:1000
export default function parseSRConfig( data ) {
    data = data.split( ';' );

    let effect = data[ 0 ];
    let distance = '50px';
    let scale = 1;
    let origin = effect.split( '-' );

    if ( 2 === origin.length ) {
        effect = origin[ 0 ];
        origin = origin[ 1 ];

        switch ( origin ) {
        case 'up':
            origin = 'bottom';
            break;
        case 'down':
            origin = 'top';
            break;
        case 'right':
            origin = 'right';
            break;
        case 'left':
            origin = 'left';
            break;
        }
    } else {
        origin = 'center';
        distance = 0;
    }

    if ( 'zoom' === effect ) {
        scale = 0.9;
    }

    const config = {
        distance: distance,
        origin: origin,
        opacity: 0,
        scale: scale,
        duration: 900,
        delay: 0,
        reset: false,
        cleanup: true,
    };

    // replace other data config.
    if ( data.length > 1 ) {
        data.forEach( ( item ) => {
            const itemData = item.split( ':' );
            if ( 2 === itemData.length ) {
                config[ itemData[ 0 ] ] = itemData[ 1 ];
            }
        } );
    }

    config.scale = parseFloat( config.scale );
    config.duration = parseFloat( config.duration );
    config.delay = parseFloat( config.delay );

    return config;
}
