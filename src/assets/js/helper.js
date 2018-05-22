window.GHOSTKIT = {
    // TODO: Move this to plugin options (part 1).
    vars: {
        media_sm: '(max-width: 576px)',
        media_md: '(max-width: 768px)',
        media_lg: '(max-width: 992px)',
        media_xl: '(max-width: 1200px)',
    },
    replaceVars( str ) {
        Object.keys( this.vars ).map( ( key ) => {
            // TODO: we need also check for valid key value https://stackoverflow.com/a/4371855/9039306
            str = str.replace( new RegExp( `#{ghostkitvar:${ key }}`, 'g' ), this.vars[ key ] );
        } );

        return str;
    },
};
