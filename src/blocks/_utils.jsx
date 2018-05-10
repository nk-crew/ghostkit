const cssPropsWithPixels = [ 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-width', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-radius', 'bottom', 'top', 'left', 'right', 'font-size', 'height', 'width', 'min-height', 'min-width', 'max-height', 'max-width', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'margin', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'padding', 'outline-width' ];

/**
 * Get styles from object.
 *
 * @param {object} data - styles data.
 * @param {string} selector - current styles selector (useful for nested styles).
 * @return {string} - ready to use styles string.
 */
export const getStyles = ( data = {}, selector = '' ) => {
    const result = {};
    let resultCSS = '';

    // add styles.
    Object.keys( data ).map( ( key ) => {
        if ( data[ key ] !== null && typeof data[ key ] === 'object' ) {
            // prepare nested selector.
            let nestedSelector = selector;
            if ( nestedSelector ) {
                if ( key.indexOf( '&' ) !== -1 ) {
                    nestedSelector = key.replace( /&/g, nestedSelector );
                } else {
                    nestedSelector = `${ nestedSelector } ${ key }`;
                }
            } else {
                nestedSelector = key;
            }
            resultCSS += getStyles( data[ key ], nestedSelector );
        } else if ( typeof data[ key ] !== 'undefined' && data[ key ] !== false ) {
            if ( ! result[ selector ] ) {
                result[ selector ] = '';
            }
            const propName = camelCaseToDash( key );
            let propValue = data[ key ];

            // add pixels.
            if ( typeof propValue === 'number' && propValue !== 0 && cssPropsWithPixels.includes( propName ) ) {
                propValue += 'px';
            }

            result[ selector ] += ` ${ propName }: ${ propValue };`;
        }
    } );

    // add styles to selectors.
    Object.keys( result ).map( ( key ) => {
        resultCSS = `${ key } {${ result[ key ] } }${ resultCSS ? ` ${ resultCSS }` : '' }`;
    } );

    // render new styles.
    renderStyles();

    return resultCSS;
};

/**
 * Get styles attribute.
 *
 * @param {object} data - styles data.
 * @return {string} - data attribute with styles.
 */
export const getCustomStylesAttr = ( data = {} ) => {
    return {
        'data-ghostkit-styles': getStyles( data ),
    };
};

/**
 * Render styles from all available ghostkit components.
 */
let renderTimeout;
export const renderStyles = () => {
    clearTimeout( renderTimeout );
    renderTimeout = setTimeout( () => {
        let styles = '';
        jQuery( '[data-ghostkit-styles]' ).each( function() {
            styles += jQuery( this ).attr( 'data-ghostkit-styles' );
        } );

        let $style = jQuery( '#ghostkit-blocks-custom-css' );

        if ( ! $style.length ) {
            $style = jQuery( '<style type="text/css" id="ghostkit-blocks-custom-css">' ).appendTo( 'head' );
        }

        $style.html( styles );
    }, 30 );
};

/**
 *
 * camelCaseToDash('userId') => "user-id"
 * camelCaseToDash('waitAMoment') => "wait-a-moment"
 * camelCaseToDash('TurboPascal') => "turbo-pascal"
 *
 * https://gist.github.com/youssman/745578062609e8acac9f
 *
 * @param {string} str - camel-cased string.
 * @return {string} - new dashed string.
 */
function camelCaseToDash( str ) {
    if ( typeof str !== 'string' ) {
        return str;
    }

    str = str.replace( /[a-z]([A-Z])+/g, m => `${ m[ 0 ] }-${ m.substring( 1 ) }` );

    return str.toLowerCase();
}
