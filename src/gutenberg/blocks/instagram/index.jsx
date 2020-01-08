/**
 * Import CSS
 */
import './editor.scss';
import './style.scss';

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
    title: __( 'Instagram', '@@text_domain' ),
    description: __( 'Show Instagram feed and user data.', '@@text_domain' ),
    icon: getIcon( 'block-instagram', true ),
    keywords: [
        __( 'instagram', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/instagram/',
        supports: {
            styles: true,
            frame: true,
            spacings: true,
            display: true,
            customCSS: true,
        },
    },
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
    },
    edit,
    save,
};
