/**
 * Import CSS
 */
import './style.scss';
import './editor.scss';

/**
 * External dependencies
 */
if ( ! global._babelPolyfill ) {
    require( '@babel/polyfill' );
}

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
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Video' ),
    description: __( 'Plain and Fullscreen YouTube, Vimeo and Self-Hosted videos.' ),
    icon: getIcon( 'block-video', true ),
    keywords: [
        __( 'video' ),
        __( 'youtube' ),
        __( 'vimeo' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/video/',
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
    deprecated,
};
