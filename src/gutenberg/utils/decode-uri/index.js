const cache = {};

/**
 * Decode URI component with `try {} catch` and caching.
 *
 * @param {string} str - encoded string.
 * @return {string} - new decoded string.
 */
export default function decodeURI( str ) {
    // return cached string.
    if ( cache[ str ] ) {
        return cache[ str ];
    }

    let result = str;

    try {
        result = decodeURIComponent( str );
    } catch ( e ) {
        // eslint-disable-next-line
        console.warn(e);
    }

    // save to cache.
    cache[ str ] = result;

    return result;
}
