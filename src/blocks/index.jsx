/**
 * Gutenberg Blocks
 */
import * as spacer from './spacer/index.jsx';
import * as button from './button/index.jsx';
import * as progress from './progress/index.jsx';
import * as iconBox from './icon-box/index.jsx';

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
    progress,
    iconBox,
].forEach( ( { name, settings } ) => {
    registerBlockType( name, settings );
} );
