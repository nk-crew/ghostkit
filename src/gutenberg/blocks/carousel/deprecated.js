/**
 * Internal dependencies
 */
import metadata from './block.json';
import save from './save';

export default [
    // v2.8.2
    {
        ghostkit: {
            supports: {
                styles: true,
                frame: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        supports: metadata.supports,
        attributes: {
            ...metadata.attributes,
            arrowPrevIcon: {
                type: 'string',
                default: 'fas fa-angle-left',
            },
            arrowNextIcon: {
                type: 'string',
                default: 'fas fa-angle-right',
            },
        },
        save,
    },
];
