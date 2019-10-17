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
import edit from './edit';
import save from './save';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Accordion' ),
    description: __( 'Toggle the visibility of content across your project.' ),
    icon: getIcon( 'block-accordion', true ),
    keywords: [
        __( 'accordion' ),
        __( 'collapsible' ),
        __( 'collapse' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/accordion/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },
    example: {
        innerBlocks: [
            {
                name: 'ghostkit/accordion-item',
                attributes: {
                    active: true,
                    heading: 'Accordion Item 1',
                    itemNumber: 1,
                },
                innerBlocks: [
                    {
                        name: 'core/paragraph',
                        attributes: {
                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis.',
                        },
                    },
                ],
            }, {
                name: 'ghostkit/accordion-item',
                attributes: {
                    active: false,
                    heading: 'Accordion Item 2',
                    itemNumber: 2,
                },
            },
        ],
    },
    edit,
    save,
};
