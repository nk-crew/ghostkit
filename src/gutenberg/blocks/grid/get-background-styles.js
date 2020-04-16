/**
 * Returns object with background image styles for Row and Column.
 *
 * @param {object} attributes - block attributes.
 *
 * @return {object} Styles object.
 */
export default function getBackgroundStyles( attributes ) {
    const {
        awb_imageBackgroundSize: imageBackgroundSize,
        awb_imageBackgroundPosition: imageBackgroundPosition,
    } = attributes;

    const result = {};

    result[ '> .nk-awb .jarallax-img' ] = {};

    // <img> tag with object-fit style
    if ( 'pattern' !== imageBackgroundSize ) {
        if ( imageBackgroundSize ) {
            result[ '> .nk-awb .jarallax-img' ][ 'object-fit' ] = imageBackgroundSize;
            result[ '> .nk-awb .jarallax-img' ][ 'font-family' ] = `object-fit: ${ imageBackgroundSize }`;
        }
        if ( imageBackgroundPosition ) {
            result[ '> .nk-awb .jarallax-img' ][ 'object-position' ] = imageBackgroundPosition;

            if ( result[ '> .nk-awb .jarallax-img' ][ 'font-family' ] ) {
                result[ '> .nk-awb .jarallax-img' ][ 'font-family' ] += `;object-position: ${ imageBackgroundPosition }`;
            } else {
                result[ '> .nk-awb .jarallax-img' ][ 'font-family' ] = `object-position: ${ imageBackgroundPosition }`;
            }
        }

        if ( result[ '> .nk-awb .jarallax-img' ][ 'font-family' ] ) {
            result[ '> .nk-awb .jarallax-img' ][ 'font-family' ] = `"${ result[ '> .nk-awb .jarallax-img' ][ 'font-family' ] }"`;
        }

    // background image with pattern size
    } else {
        if ( imageBackgroundSize ) {
            result[ '> .nk-awb .jarallax-img' ][ 'background-repeat' ] = 'repeat';
        }
        if ( imageBackgroundSize ) {
            result[ '> .nk-awb .jarallax-img' ][ 'background-position' ] = imageBackgroundPosition;
        }
    }

    return result;
}
