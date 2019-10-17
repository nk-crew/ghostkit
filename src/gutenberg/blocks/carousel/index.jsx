/**
 * Import CSS
 */
import './editor.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import deprecated from './deprecated';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Carousel' ),
    description: __( 'Carousel for any type of content – images or other blocks.' ),
    icon: getIcon( 'block-carousel', true ),
    keywords: [
        __( 'carousel' ),
        __( 'slider' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/carousel/',
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
    deprecated,
};
