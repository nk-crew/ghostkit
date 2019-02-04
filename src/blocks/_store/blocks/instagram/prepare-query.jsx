export default function prepareQuery( type, data ) {
    const additionalData = Object.keys( data ).map( key => `${ key }=${ encodeURIComponent( data[ key ] ) }` ).join( '&' );
    const query = `/ghostkit/v1/get_instagram_${ type }/${ additionalData ? `?${ additionalData }` : '' }`;

    return query;
}
