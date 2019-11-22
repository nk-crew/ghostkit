if ( typeof window.ghostkitWebfontList !== 'undefined' ) {
    const adobeFonts = window.ghostkitWebfontList[ 'fonts_list' ][ 'adobe-fonts' ];
    const googleFonts = window.ghostkitWebfontList[ 'fonts_list' ][ 'google-fonts' ];
    const adobeProjectId = window.ghostkitWebfontList.adobeProjectId;
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
    if ( typeof adobeFonts !== 'undefined' && typeof adobeProjectId !== 'undefined' ) {
        window.WebFont.load( {
            typekit: {
                id: adobeProjectId,
            },
        } );
    }
}
