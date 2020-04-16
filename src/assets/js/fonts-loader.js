if ( 'undefined' !== typeof window.ghostkitWebfontList ) {
    const googleFonts = window.ghostkitWebfontList[ 'google-fonts' ];
    if ( 'undefined' !== typeof googleFonts ) {
        const googleFamilies = [];

        Object.keys( googleFonts ).forEach( ( key ) => {
            let weights = '';

            if ( 'undefined' !== typeof googleFonts[ key ].widths ) {
                googleFonts[ key ].widths.forEach( ( keyWeight ) => {
                    if ( 0 < keyWeight && keyWeight !== ( googleFonts[ key ].widths.length - 1 ) ) {
                        weights += ',';
                    }
                    weights += googleFonts[ key ].widths[ keyWeight ];
                } );
            }

            googleFamilies.push( `${ key }:${ weights }` );
        } );

        window.WebFont.load( {
            google: {
                families: googleFamilies,
            },
        } );
    }
}
