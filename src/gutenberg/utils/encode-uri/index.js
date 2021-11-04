const cache = {};

/**
 * Encode URI component with `try {} catch` and caching.
 *
 * @param {string} str - decoded string.
 * @return {string} - new encoded string.
 */
export default function encodeURI( str ) {
    // return cached string.
    if ( cache[ str ] ) {
        return cache[ str ];
    }

    let result = str;

    try {
        result = encodeURIComponent( str );
    } catch ( e ) {
        // eslint-disable-next-line
        console.warn(e);
    }

    // save to cache.
    cache[ str ] = result;

    return result;
}
