/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { registerBlockStyle } = wp.blocks;

registerBlockStyle( 'core/list', {
    name: 'styled',
    label: __( 'Styled', '@@text_domain' ),
} );

registerBlockStyle( 'core/list', {
    name: 'none',
    label: __( 'None', '@@text_domain' ),
} );
