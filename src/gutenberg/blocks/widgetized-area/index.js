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
    title: __( 'Widgetized Area', '@@text_domain' ),
    description: __( 'Select registered sidebars and put it in any place.', '@@text_domain' ),
    icon: getIcon( 'block-widgetized-area', true ),
    keywords: [
        __( 'widget', '@@text_domain' ),
        __( 'sidebar', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/widgetized-area/',
    },
    edit,
    save,
};
