/**
 * Gutenberg Blocks
 */
import * as spacer from './spacer/index.jsx';
import * as button from './button/index.jsx';

/**
 * Internal dependencies
 */
const { registerBlockType } = wp.blocks;

/**
 * Register blocks
 */
[
    spacer,
    button,
].forEach( ( { name, settings } ) => {
    registerBlockType( name, settings );
} );
