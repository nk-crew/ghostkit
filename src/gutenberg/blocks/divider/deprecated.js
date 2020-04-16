/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import metadata from './block.json';
import save from './save';

const { merge } = window.lodash;

export default [
    // v2.10.2
    {
        ...metadata,
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    '--gkt-divider__border-width': attributes.size ? `${ attributes.size }px` : false,
                    '--gkt-divider__border-color': attributes.color,
                    '--gkt-divider--icon__font-size': attributes.iconSize ? `${ attributes.iconSize }px` : false,
                    '--gkt-divider--icon__color': attributes.iconColor,
                };

                if ( attributes.hoverColor ) {
                    styles[ '&:hover' ] = {
                        '--gkt-divider__border-color': attributes.hoverColor,
                    };
                }
                if ( attributes.hoverIconColor ) {
                    styles[ '&:hover' ] = merge( styles[ '&:hover' ] || {}, {
                        '--gkt-divider--icon__color': attributes.hoverIconColor,
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
        attributes: {
            type: {
                type: 'string',
                default: 'solid',
            },
            size: {
                type: 'number',
                default: 2,
            },
            icon: {
                type: 'string',
                default: '',
            },
            iconSize: {
                type: 'number',
                default: 10,
            },
            color: {
                type: 'string',
                default: '#a7a9ab',
            },
            iconColor: {
                type: 'string',
                default: '#a7a9ab',
            },
            hoverColor: {
                type: 'string',
            },
            hoverIconColor: {
                type: 'string',
            },
        },
        save,
    },

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
