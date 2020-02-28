/**
 * WordPress dependencies
 */
const { merge } = window.lodash;

/**
 * Internal dependencies
 */
import metadata from './block.json';
import save from './save';

export default [
    // v2.8.2
    {
        ghostkit: {
            previewUrl: 'https://ghostkit.io/blocks/divider/',
            customStylesCallback( attributes ) {
                const styles = {
                    '&::before, &::after': {
                        borderColor: attributes.color,
                        borderWidth: attributes.size,
                    },
                    '.ghostkit-divider-icon': {
                        fontSize: attributes.iconSize,
                        color: attributes.iconColor,
                    },
                };

                if ( attributes.hoverColor ) {
                    styles[ '&:hover' ] = {
                        '&::before, &::after': {
                            borderColor: attributes.hoverColor,
                        },
                    };
                }
                if ( attributes.hoverIconColor ) {
                    styles[ '&:hover' ] = merge( styles[ '&:hover' ] || {}, {
                        '.ghostkit-divider-icon': {
                            color: attributes.hoverIconColor,
                        },
                    } );
                }

                return styles;
            },
            supports: {
                styles: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        supports: metadata.supports,
        attributes: {
            ...metadata.attributes,
            icon: {
                type: 'string',
                default: 'fab fa-twitter',
            },
        },
        save,
    },
];
