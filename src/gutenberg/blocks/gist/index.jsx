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
    title: __( 'GitHub Gist', '@@text_domain' ),
    description: __( 'Embed code parts form GitHub Gist to your site or documentation.', '@@text_domain' ),
    icon: getIcon( 'block-gist', true ),
    keywords: [
        __( 'github', '@@text_domain' ),
        __( 'gist', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/github-gist/',
        supports: {
            styles: true,
            frame: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },
    example: {
        attributes: {
            url: 'https://gist.github.com/nk-o/fc0422389f3baa4e66d243b6f0c0ef1a',
            file: 'example.php',
        },
    },
    transforms,
    edit,
    save,
};
