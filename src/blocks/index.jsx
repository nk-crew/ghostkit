/**
 * Gutenberg Blocks
 */
import * as grid from './grid/index.jsx';
import * as gridColumn from './grid/column.jsx';
import * as button from './button/index.jsx';
import * as progress from './progress/index.jsx';
import * as iconBox from './icon-box/index.jsx';
import * as tabs from './tabs/index.jsx';
import * as counterBox from './counter-box/index.jsx';
import * as alert from './alert/index.jsx';
import * as customizer from './customizer/index.jsx';
import * as customCSS from './custom-css/index.jsx';

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
    gridColumn,
    button,
    progress,
    iconBox,
    tabs,
    counterBox,
    alert,
    customizer,
    customCSS,
].forEach( ( { name, settings } ) => {
    registerBlockType( name, settings );
} );
