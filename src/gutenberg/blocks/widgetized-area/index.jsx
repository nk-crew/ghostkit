/**
 * Import CSS
 */
import './editor.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Widgetized Area' ),
    description: __( 'Select registered sidebars and put it in any place.' ),
    icon: getIcon( 'block-widgetized-area', true ),
    keywords: [
        __( 'widget' ),
        __( 'sidebar' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/widgetized-area/',
    },
    edit,
    save,
};
