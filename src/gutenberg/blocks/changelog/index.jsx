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
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Changelog' ),
    description: __( 'Show the changes log of your product.' ),
    icon: getIcon( 'block-changelog', true ),
    keywords: [
        __( 'changelog' ),
        __( 'log' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/changelog/',
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
};
