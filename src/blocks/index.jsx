/**
 * Gutenberg Blocks
 */
import * as grid from './grid/index.jsx';
import * as button from './button/index.jsx';
import * as progress from './progress/index.jsx';
import * as iconBox from './icon-box/index.jsx';
import * as counterBox from './counter-box/index.jsx';
import * as alert from './alert/index.jsx';
import * as customizer from './customizer/index.jsx';

/**
 * Extensions
 */
import './_extend/styles.jsx';
import './_extend/indents.jsx';
import './_extend/display.jsx';

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
    customizer,
].forEach( ( { name, settings } ) => {
    registerBlockType( name, settings );
} );
