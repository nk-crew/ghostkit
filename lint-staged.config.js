// eslint-disable-next-line import/no-extraneous-dependencies
const micromatch = require( 'micromatch' );

function excludeVendor( lint ) {
    return ( filenames ) => (
        `${ lint } ${ micromatch( filenames, '!src/**/vendor/**/*' ).join( ' ' ) }`
    );
}

module.exports = {
    'src/**/*.php': excludeVendor( 'composer run-script phpcs' ),
    'src/**/*.css': excludeVendor( 'stylelint' ),
    'src/**/*.scss': excludeVendor( 'stylelint --syntax scss' ),
    'src/**/*.{js}': excludeVendor( 'eslint' ),
};
