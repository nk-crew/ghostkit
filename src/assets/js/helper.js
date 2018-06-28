const { ghostkitVariables } = window;

// prepare media vars.
const vars = {};
Object.keys( ghostkitVariables.media_sizes ).forEach( ( k ) => {
    vars[ `media_${ k }` ] = ghostkitVariables.media_sizes[ k ];
} );

window.GHOSTKIT = {
    vars: vars,
    replaceVars( str ) {
        Object.keys( this.vars ).map( ( key ) => {
            // TODO: we need also check for valid key value https://stackoverflow.com/a/4371855/9039306
            str = str.replace( new RegExp( `#{ghostkitvar:${ key }}`, 'g' ), this.vars[ key ] );
        } );

        return str;
    },

    variants: ghostkitVariables.variants,
    getVariants( name ) {
        if ( typeof this.variants[ name ] !== 'undefined' ) {
            return this.variants[ name ];
        }
        return false;
    },
};
