export default function prepareQuery( { id, ...data } ) {
    const additionalData = Object.keys( data ).map( key => `${ key }=${ encodeURIComponent( data[ key ] ) }` ).join( '&' );
    const query = `/ghostkit/v1/get_attachment_image/${ id }${ additionalData ? `?${ additionalData }` : '' }`;

    return query;
}
