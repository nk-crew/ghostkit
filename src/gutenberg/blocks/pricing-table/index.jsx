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
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Pricing Table' ),
    description: __( 'Sell your products or services and show all features.' ),
    icon: getIcon( 'block-pricing-table', true ),
    keywords: [
        __( 'pricing' ),
        __( 'table' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/pricing-tables/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    edit,
    save,
};
