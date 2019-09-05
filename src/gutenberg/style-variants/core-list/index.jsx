/**
 * Styles
 */
import './editor.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { registerBlockStyle } = wp.blocks;

registerBlockStyle( 'core/list', {
    name: 'styled',
    label: __( 'Styled' ),
} );

registerBlockStyle( 'core/list', {
    name: 'none',
    label: __( 'None' ),
} );
