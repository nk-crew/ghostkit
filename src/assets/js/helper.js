const { ghostkitVariables } = window;
const $ = window.jQuery;
const $doc = $( document );

// prepare media vars.
const vars = {};
Object.keys( ghostkitVariables.media_sizes ).forEach( ( k ) => {
    vars[ `media_${ k }` ] = ghostkitVariables.media_sizes[ k ];
} );

function escapeRegExp( s ) {
    return s.replace( /[-/\\^$*+?.()|[\]{}]/g, '\\$&' );
}

window.GHOSTKIT = {
    vars: vars,
    replaceVars( str ) {
        Object.keys( this.vars ).map( ( key ) => {
            str = str.replace( new RegExp( `#{ghostkitvar:${ escapeRegExp( key ) }}`, 'g' ), `(max-width: ${ this.vars[ key ] }px)` );
        } );

        return str;
    },

    sidebars: ghostkitVariables.sidebars,

    googleMapsAPIKey: ghostkitVariables.googleMapsAPIKey,
    googleMapsAPIUrl: ghostkitVariables.googleMapsAPIUrl,
    googleMapsLibrary: ghostkitVariables.googleMapsLibrary,

    icons: ghostkitVariables.icons,

    variants: ghostkitVariables.variants,
    getVariants( name ) {
        if ( typeof this.variants[ name ] !== 'undefined' ) {
            return this.variants[ name ];
        }
        return false;
    },

    adminUrl: ghostkitVariables.admin_url,

    triggerEvent( name, ...args ) {
        $doc.trigger( `${ name }.ghostkit`, [ ...args ] );
    },
};
