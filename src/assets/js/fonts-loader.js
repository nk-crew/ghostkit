( () => {
    const {
        ghostkitWebfontList,
    } = window;

    if ( 'undefined' === typeof ghostkitWebfontList || 'undefined' === typeof ghostkitWebfontList[ 'google-fonts' ] ) {
        return;
    }

    const googleFonts = ghostkitWebfontList[ 'google-fonts' ];
    const googleFamilies = [];

    Object.keys( googleFonts ).forEach( ( key ) => {
        const data = googleFonts[ key ];
        const weights = 'undefined' !== typeof data.widths ? data.widths : false;
        let weightsString = '';

        if ( weights ) {
            weights.forEach( ( weight ) => {
                if ( weightsString ) {
                    weightsString += ',';
                }
                weightsString += weight;
            } );
        }

        googleFamilies.push( `${ key }:${ weightsString }` );
    } );

    window.WebFont.load( {
        google: {
            families: googleFamilies,
        },
    } );
} )();
