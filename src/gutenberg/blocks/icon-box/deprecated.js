/**
 * Internal dependencies
 */
import metadata from './block.json';
import save from './save';

export default [
    // v2.10.2
    {
        ...metadata,
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    '--gkt-icon-box--icon__font-size': attributes.iconSize ? `${ attributes.iconSize }px` : false,
                    '--gkt-icon-box--icon__color': attributes.iconColor,
                };

                if ( attributes.hoverIconColor ) {
                    styles[ '&:hover' ] = {
                        '--gkt-icon-box--icon__color': attributes.hoverIconColor,
                    };
                }

                return styles;
            },
            supports: {
                styles: true,
                frame: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        attributes: {
            icon: {
                type: 'string',
                default: '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7813 9.75C16.7813 7.10939 14.6406 4.96875 12 4.96875C9.35939 4.96875 7.21875 7.10939 7.21875 9.75C7.21875 12.3906 9.35939 14.5312 12 14.5312C14.6406 14.5312 16.7813 12.3906 16.7813 9.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.15625 18C10.6023 19.25 13.3977 19.25 15.8437 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
            },
            iconPosition: {
                type: 'string',
                default: 'left',
            },
            iconSize: {
                type: 'number',
                default: 30,
            },
            showContent: {
                type: 'boolean',
                default: true,
            },
            iconColor: {
                type: 'string',
                default: '#0366d6',
            },
            hoverIconColor: {
                type: 'string',
            },
            url: {
                type: 'string',
            },
            target: {
                type: 'string',
            },
            rel: {
                type: 'string',
            },
        },
        save,
    },

    // v2.8.2
    {
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    '.ghostkit-icon-box-icon': {
                        fontSize: attributes.iconSize,
                        color: attributes.iconColor,
                    },
                };

                if ( attributes.hoverIconColor ) {
                    styles[ '&:hover .ghostkit-icon-box-icon' ] = {
                        color: attributes.hoverIconColor,
                    };
                }

                return styles;
            },
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
            icon: {
                type: 'string',
                default: 'fab fa-wordpress-simple',
            },
        },
        save,
    },
];
