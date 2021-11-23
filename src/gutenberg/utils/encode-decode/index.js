const eCache = {};
const dCache = {};

/**
 * Encode URI component with `try {} catch` and caching.
 *
 * @param {string} str - decoded string.
 * @return {string} - new encoded string.
 */
export function maybeEncode( str ) {
    // return cached string.
    if ( eCache[ str ] ) {
        return eCache[ str ];
    }

    let result = {};

    // Object
    if ( 'object' === typeof str ) {
        Object.keys( str ).forEach( ( k ) => {
            result[ maybeEncode( k ) ] = maybeEncode( str[ k ] );
        } );

        return result;
    }

    // String
    result = str;

    if ( 'string' === typeof result ) {
        try {
            // Because of these replacements, some attributes can't be exported to XML without being broken. So, we need to replace it manually with something safe.
            // https://github.com/WordPress/gutenberg/blob/88645e4b268acf5746e914159e3ce790dcb1665a/packages/blocks/src/api/serializer.js#L246-L271
            result = result.replace( /--/gm, '_u002d__u002d_' );

            result = encodeURIComponent( result );
        } catch ( e ) {
            // eslint-disable-next-line
            console.warn(e);
        }
    }

    // save to cache.
    eCache[ str ] = result;

    return result;
}

/**
 * Encode URI component with `try {} catch` and caching.
 *
 * @param {string} str - decoded string.
 * @return {string} - new encoded string.
 */
export function maybeDecode( str ) {
    // return cached string.
    if ( dCache[ str ] ) {
        return dCache[ str ];
    }

    let result = {};

    // Object
    if ( 'object' === typeof str ) {
        Object.keys( str ).forEach( ( k ) => {
            result[ maybeDecode( k ) ] = maybeDecode( str[ k ] );
        } );

        return result;
    }

    // String
    result = str;

    if ( 'string' === typeof result ) {
        try {
            result = decodeURIComponent( result );

            // Because of these replacements, some attributes can't be exported to XML without being broken. So, we need to replace it manually with something safe.
            // https://github.com/WordPress/gutenberg/blob/88645e4b268acf5746e914159e3ce790dcb1665a/packages/blocks/src/api/serializer.js#L246-L271
            result = result.replace( /_u002d__u002d_/gm, '--' );
        } catch ( e ) {
            // eslint-disable-next-line
            console.warn(e);
        }
    }

    // save to cache.
    dCache[ str ] = result;

    return result;
}
