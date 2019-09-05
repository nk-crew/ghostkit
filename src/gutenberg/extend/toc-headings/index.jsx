/**
 * External dependencies
 */
import slugify from 'slugify';
import striptags from 'striptags';
import { debounce } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
const {
    addFilter,
} = wp.hooks;

const {
    subscribe,
    select,
} = wp.data;

/**
 * Get available TOC block.
 *
 * @param {Array} blocks blocks array.
 *
 * @return {Array} toc block data.
 */
function getTOC( blocks = false ) {
    let result = false;

    if ( ! blocks ) {
        const {
            getBlocks,
        } = select( 'core/editor' );

        blocks = getBlocks();
    }

    blocks.forEach( ( block ) => {
        if ( ! result ) {
            if ( 'ghostkit/table-of-contents' === block.name ) {
                result = block;
            } else if ( block.innerBlocks && block.innerBlocks.length ) {
                result = getTOC( block.innerBlocks );
            }
        }
    } );

    return result;
}

/**
 * Get available heading blocks.
 *
 * @param {Array} blocks blocks array.
 *
 * @return {Array} toc block data.
 */
function getHeadings( blocks = false ) {
    let result = [];

    if ( ! blocks ) {
        const {
            getBlocks,
        } = select( 'core/editor' );

        blocks = getBlocks();
    }

    blocks.forEach( ( block ) => {
        if ( 'core/heading' === block.name ) {
            result.push( block );
        } else if ( block.innerBlocks && block.innerBlocks.length ) {
            result = [
                ...result,
                ...getHeadings( block.innerBlocks ),
            ];
        }
    } );

    return result;
}

let prevHeadings = '';

/**
 * Update heading ID.
 */
function maybeUpdateHeadingIDs() {
    const tocBlock = getTOC();

    if ( ! tocBlock ) {
        return;
    }

    const headings = getHeadings();

    if ( prevHeadings && prevHeadings === JSON.stringify( headings ) ) {
        return;
    }

    const collisionCollector = {};

    headings.forEach( ( block ) => {
        let {
            anchor,
        } = block.attributes;

        const {
            content,
            ghostkitTocId,
        } = block.attributes;

        // create new
        if ( content && ( ! anchor || ghostkitTocId === anchor ) ) {
            anchor = slugify( striptags( content ), {
                replacement: '-',
                lower: true,
            } );
            block.attributes.anchor = anchor;
            block.attributes.ghostkitTocId = anchor;
        }

        // check collisions.
        if ( anchor ) {
            if ( typeof collisionCollector[ anchor ] !== 'undefined' ) {
                anchor += `-${ collisionCollector[ anchor ]++ }`;
                block.attributes.anchor = anchor;
                block.attributes.ghostkitTocId = anchor;
            } else {
                collisionCollector[ anchor ] = 1;
            }
        }
    } );

    prevHeadings = JSON.stringify( headings );
}
maybeUpdateHeadingIDs = debounce( 300, maybeUpdateHeadingIDs );

/**
 * Subscribe to all editor changes.
 */
subscribe( () => {
    maybeUpdateHeadingIDs();
} );

/**
 * Filters registered block settings, extending attributes with anchor using ID
 * of the first node.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings ) {
    if ( settings.name && 'core/heading' === settings.name ) {
        settings.attributes.ghostkitTocId = {
            type: 'string',
        };
    }

    return settings;
}

addFilter( 'blocks.registerBlockType', 'ghostkit/toc/heading/id/attribute', addAttribute );
