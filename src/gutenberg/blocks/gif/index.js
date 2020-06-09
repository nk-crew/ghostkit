/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'GIF', '@@text_domain' ),
    description: __( 'Search for and insert an animated image.', '@@text_domain' ),
    icon: getIcon( 'block-gif', true ),
    keywords: [
        __( 'animated', '@@text_domain' ),
        __( 'giphy', '@@text_domain' ),
        __( 'image', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/gif/',
        supports: {
            styles: true,
            frame: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },
    edit,
    save,
};
