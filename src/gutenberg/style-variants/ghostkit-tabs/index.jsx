/**
 * Styles
 */
import './style.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { registerBlockStyle } = wp.blocks;

registerBlockStyle( 'ghostkit/tabs-v2', {
    name: 'pills',
    label: __( 'Pills', '@@text_domain' ),
} );
