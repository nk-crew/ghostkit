/**
 * Import CSS
 */
import './style.scss';
import './editor.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import transforms from './transforms';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Buttons' ),

    description: __( 'Change important links to buttons to get more click rate.' ),

    icon: getIcon( 'block-button', true ),

    keywords: [
        __( 'btn' ),
        __( 'button' ),
    ],

    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/button/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },

    edit,
    save,
    transforms,
};
