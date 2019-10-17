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
            customCSS: true,
        },
    },
    example: {
        attributes: {
            count: 2,
        },
        innerBlocks: [
            {
                name: 'ghostkit/pricing-table-item',
                attributes: {
                    title: 'Standard',
                    price: '$49',
                    features: '<li>Feature 1</li><li>Feature 2</li>',
                    showPopular: true,
                },
            }, {
                name: 'ghostkit/pricing-table-item',
                attributes: {
                    title: 'Developers',
                    price: '$99',
                    features: '<li>Feature 1</li><li>Feature 2</li>',
                },
            },
        ],
    },
    edit,
    save,
};
