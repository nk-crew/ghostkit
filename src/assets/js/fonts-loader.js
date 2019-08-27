if ( typeof window.ghostkitWebfontList !== 'undefined' ) {
    const googleFonts = window.ghostkitWebfontList[ 'google-fonts' ];
    if ( typeof googleFonts !== 'undefined' ) {
        const googleFamilies = [];
        for ( const key in googleFonts ) {
            let weights = '';
            for ( const keyWeight in googleFonts[ key ].widths ) {
                if ( keyWeight > 0 && keyWeight !== ( googleFonts[ key ].widths.length - 1 ) ) {
                    weights = weights + ',';
                }
                weights = weights + googleFonts[ key ].widths[ keyWeight ];
            }
            googleFamilies.push( key + ':' + weights );
        }
        window.WebFont.load( {
            google: {
                families: googleFamilies,
            },
        } );
    }
}
