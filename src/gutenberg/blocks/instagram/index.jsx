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
    title: __( 'Instagram' ),
    description: __( 'Show Instagram feed and user data.' ),
    icon: getIcon( 'block-instagram', true ),
    keywords: [
        __( 'instagram' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/instagram/',
        supports: {
            styles: true,
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
