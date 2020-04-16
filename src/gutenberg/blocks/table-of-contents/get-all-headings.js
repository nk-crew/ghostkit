/**
 * Get all available headings.
 *
 * @param {Array} blocks blocks array.
 * @param {Array} allowedHeaders allowed headers list.
 * @return {Array} headings array.
 */
export default function getAllHeadings( blocks, allowedHeaders ) {
    let headings = [];

    if ( allowedHeaders && allowedHeaders.length ) {
        blocks.forEach( ( block ) => {
            if ( 'core/heading' === block.name && -1 < allowedHeaders.indexOf( block.attributes.level ) ) {
                headings.push( {
                    level: block.attributes.level,
                    content: block.attributes.content,
                    // in preview we don't need to create proper anchors
                    // anchor: block.attributes.anchor,
                    anchor: '',
                } );
            }

            if ( block.innerBlocks && block.innerBlocks.length ) {
                headings = [
                    ...headings,
                    ...getAllHeadings( block.innerBlocks, allowedHeaders ),
                ];
            }
        } );
    }

    return headings;
}
