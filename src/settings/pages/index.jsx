import Blocks from './blocks.jsx';
import Settings from './settings.jsx';

const { __ } = wp.i18n;

export default {
    blocks: {
        label: __( 'Blocks' ),
        block: Blocks,
    },
    settings: {
        label: __( 'Settings' ),
        block: Settings,
    },
};
