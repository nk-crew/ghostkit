/**
 * Internal dependencies
 */
import camelCaseToDash from '../../utils/camel-case-to-dash';

const cssPropsWithPixels = [ 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-width', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-radius', 'bottom', 'top', 'left', 'right', 'font-size', 'height', 'width', 'min-height', 'min-width', 'max-height', 'max-width', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'margin', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'padding', 'outline-width' ];

/**
 * Get styles from object.
 *
 * @param {object} data - styles data.
 * @param {string} selector - current styles selector (useful for nested styles).
 * @param {boolean} escape - escape strings to save in database.
 * @return {string} - ready to use styles string.
 */
export default function getStyles( data = {}, selector = '', escape = true ) {
    const result = {};
    let resultCSS = '';

    // add styles.
    Object.keys( data ).forEach( ( key ) => {
        // object values.
        if ( null !== data[ key ] && 'object' === typeof data[ key ] ) {
            // media for different screens
            if ( /^media_/.test( key ) ) {
                resultCSS += `${ resultCSS ? ' ' : '' }@media #{ghostkitvar:${ key }} { ${ getStyles( data[ key ], selector, escape ) } }`;

            // @supports css
            } else if ( /^@supports/.test( key ) ) {
                resultCSS += `${ resultCSS ? ' ' : '' }${ key } { ${ getStyles( data[ key ], selector, escape ) } }`;

            // nested selectors.
            } else {
                let nestedSelector = selector;

                if ( nestedSelector ) {
                    if ( -1 !== key.indexOf( '&' ) ) {
                        nestedSelector = key.replace( /&/g, nestedSelector );

                    // inside exported xml file all & symbols converted to \u0026
                    } else if ( -1 !== key.indexOf( 'u0026' ) ) {
                        nestedSelector = key.replace( /u0026/g, nestedSelector );
                    } else {
                        nestedSelector = `${ nestedSelector } ${ key }`;
                    }
                } else {
                    nestedSelector = key;
                }

                resultCSS += ( resultCSS ? ' ' : '' ) + getStyles( data[ key ], nestedSelector, escape );
            }

        // style properties and values.
        } else if ( 'undefined' !== typeof data[ key ] && false !== data[ key ] ) {
            // fix selector > and < usage.
            if ( escape ) {
                selector = selector.replace( />/g, '&gt;' );
                selector = selector.replace( /</g, '&lt;' );
            }

            // inside exported xml file all > symbols converted to \u003e
            // inside exported xml file all < symbols converted to \u003c
            if ( -1 !== selector.indexOf( 'u003e' ) ) {
                selector = selector.replace( /u003e/g, '&gt;' );
                selector = selector.replace( /u003c/g, '&lt;' );
            }

            if ( ! result[ selector ] ) {
                result[ selector ] = '';
            }

            const propName = camelCaseToDash( key );
            let propValue = data[ key ];

            // inside exported xml file all " symbols converted to \u0022
            if ( 'string' === typeof propValue && -1 !== propValue.indexOf( 'u0022' ) ) {
                propValue = propValue.replace( /u0022/g, '"' );
            }
            // inside exported xml file all ' symbols converted to \u0027
            if ( 'string' === typeof propValue && -1 !== propValue.indexOf( 'u0027' ) ) {
                propValue = propValue.replace( /u0027/g, '\'' );
            }

            const thereIsImportant = / !important$/.test( propValue );
            if ( thereIsImportant ) {
                propValue = propValue.replace( / !important$/, '' );
            }

            // add pixels.
            if (
                ( 'number' === typeof propValue && 0 !== propValue && cssPropsWithPixels.includes( propName ) )
                || ( 'string' === typeof propValue && propValue && /^[0-9.-]*$/.test( propValue ) )
            ) {
                propValue += 'px';
            }

            // add custom css.
            if ( 'undefined' !== typeof propValue && '' !== propValue ) {
                if ( thereIsImportant ) {
                    propValue += ' !important';
                }

                result[ selector ] += ` ${ propName }: ${ propValue };`;
            }
        }
    } );

    // add styles to selectors.
    Object.keys( result ).forEach( ( key ) => {
        resultCSS = `${ key } {${ result[ key ] } }${ resultCSS ? ` ${ resultCSS }` : '' }`;
    } );

    return resultCSS;
}
