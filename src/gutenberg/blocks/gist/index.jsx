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
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'GitHub Gist' ),
    description: __( 'Embed code parts form GitHub Gist to your site or documentation.' ),
    icon: getIcon( 'block-gist', true ),
    keywords: [
        __( 'github' ),
        __( 'gist' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/github-gist/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    transforms,
    edit,
    save,
};
