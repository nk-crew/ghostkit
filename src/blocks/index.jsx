/**
 * Gutenberg Blocks
 */
import * as grid from './grid/index.jsx';
import * as button from './button/index.jsx';
import * as progress from './progress/index.jsx';
import * as iconBox from './icon-box/index.jsx';
import * as counterBox from './counter-box/index.jsx';
import * as alert from './alert/index.jsx';

/**
 * Extensions
 */
import { styles } from './_extend/index.jsx';

/**
 * Add Custom Styles Selector in Blocks
 */
styles();

/**
 * Internal dependencies
 */
const { registerBlockType } = wp.blocks;

/**
 * Register blocks
 */
[
    grid,
    button,
    progress,
    iconBox,
    counterBox,
    alert,
].forEach( ( { name, settings } ) => {
    registerBlockType( name, settings );
} );
