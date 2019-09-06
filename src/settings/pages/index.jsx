/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import Blocks from './blocks.jsx';
import Typography from './typography.jsx';
import Icons from './icons.jsx';
import CssJs from './css-js.jsx';

export default {
    blocks: {
        label: __( 'Blocks' ),
        block: Blocks,
    },
    icons: {
        label: __( 'Icons' ),
        block: Icons,
    },
    typography: {
        label: __( 'Typography' ),
        block: Typography,
    },
    css_js: {
        label: __( 'CSS & JavaScript' ),
        block: CssJs,
    },
};
