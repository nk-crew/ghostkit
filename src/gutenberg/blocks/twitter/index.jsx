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
    title: __( 'Twitter' ),
    description: __( 'Show Twitter feed and user data.' ),
    icon: getIcon( 'block-twitter', true ),
    keywords: [
        __( 'twitter' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/twitter/',
    },
    edit,
    save,
};
