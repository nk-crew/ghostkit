/**
 * Import CSS
 */
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
    title: __( 'Testimonial' ),
    description: __( 'Show how your users love your products and what saying.' ),
    icon: getIcon( 'block-testimonial', true ),
    keywords: [
        __( 'testimonial' ),
        __( 'blockquote' ),
        __( 'quote' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/testimonial/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    edit,
    save,
    transforms,
    deprecated,
};
