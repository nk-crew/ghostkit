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
import Fonts from './fonts.jsx';

export default {
    blocks: {
        label: __( 'Blocks', '@@text_domain' ),
        block: Blocks,
    },
    icons: {
        label: __( 'Icons', '@@text_domain' ),
        block: Icons,
    },
    typography: {
        label: __( 'Typography', '@@text_domain' ),
        block: Typography,
    },
    css_js: {
        label: __( 'CSS & JavaScript', '@@text_domain' ),
        block: CssJs,
    },
    fonts: {
        label: __( 'Fonts', '@@text_domain' ),
        block: Fonts,
    },
};
