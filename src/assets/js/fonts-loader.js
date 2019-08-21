// eslint-disable-next-line no-undef
const googleFonts = webfontList[ 'google-fonts' ];
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
// eslint-disable-next-line no-undef
WebFont.load( {
    google: {
        families: googleFamilies,
    },
} );
