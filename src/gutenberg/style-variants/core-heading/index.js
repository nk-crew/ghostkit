/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { registerBlockStyle } = wp.blocks;

registerBlockStyle( 'core/heading', {
    name: 'numbered',
    label: __( 'Numbered', '@@text_domain' ),
} );
