/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import save from './save';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const {
    RichText,
} = wp.blockEditor;

const {
    applyFilters,
} = wp.hooks;

export default [
    // v2.10.2
    {
        ...metadata,
        ghostkit: {
            customStylesCallback( attributes ) {
                const result = {
                    '--gkt-button__background-color': attributes.color,
                    '--gkt-button__color': attributes.textColor,
                    '--gkt-button__border-radius': `${ attributes.borderRadius }px`,
                    '--gkt-button-hover__background-color': attributes.hoverColor,
                    '--gkt-button-hover__color': attributes.hoverTextColor,
                    '--gkt-button-focus__background-color': attributes.hoverColor,
                    '--gkt-button-focus__color': attributes.hoverTextColor,
                };

                // Border.
                if ( attributes.borderWeight && attributes.borderColor ) {
                    result[ '--gkt-button__border-width' ] = `${ attributes.borderWeight }px`;
                    result[ '--gkt-button__border-color' ] = attributes.borderColor;

                    if ( attributes.hoverBorderColor ) {
                        result[ '--gkt-button-hover__border-color' ] = attributes.hoverBorderColor;
                    }
                }

                // Box Shadow.
                if ( attributes.focusOutlineWeight && attributes.focusOutlineColor ) {
                    result[ '--gkt-button-focus__box-shadow' ] = `0 0 0 ${ attributes.focusOutlineWeight }px ${ attributes.focusOutlineColor }`;
                }

                return result;
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
            tagName: {
                type: 'string',
            },
            url: {
                type: 'string',
                source: 'attribute',
                selector: 'a.ghostkit-button',
                attribute: 'href',
            },
            target: {
                type: 'string',
                source: 'attribute',
                selector: 'a.ghostkit-button',
                attribute: 'target',
            },
            rel: {
                type: 'string',
                source: 'attribute',
                selector: 'a.ghostkit-button',
                attribute: 'rel',
            },
            text: {
                type: 'string',
                source: 'html',
                selector: '.ghostkit-button .ghostkit-button-text',
                default: 'Button',
            },
            hideText: {
                type: 'boolean',
                default: false,
            },
            icon: {
                type: 'string',
                default: '',
            },
            iconPosition: {
                type: 'string',
                default: 'left',
            },
            size: {
                type: 'string',
                default: 'md',
            },
            color: {
                type: 'string',
                default: '#0366d6',
            },
            textColor: {
                type: 'string',
                default: '#ffffff',
            },

            borderRadius: {
                type: 'number',
                default: 2,
            },
            borderWeight: {
                type: 'number',
                default: 0,
            },
            borderColor: {
                type: 'string',
                default: '#00669b',
            },

            focusOutlineWeight: {
                type: 'number',
                default: 0,
            },

            hoverColor: {
                type: 'string',
            },
            hoverTextColor: {
                type: 'string',
            },
            hoverBorderColor: {
                type: 'string',
            },

            focusOutlineColor: {
                type: 'string',
                default: 'rgba(3, 102, 214, 0.5)',
            },
        },
        save,
    },

    // v1.6.3
    {
        ghostkit: {
            customStylesCallback( attributes ) {
                return {
                    backgroundColor: attributes.color,
                    color: attributes.textColor,
                    borderRadius: attributes.borderRadius,
                    border: attributes.borderWeight && attributes.borderColor ? `${ attributes.borderWeight }px solid ${ attributes.borderColor }` : false,
                    '&:hover, &:focus': {
                        backgroundColor: attributes.hoverColor,
                        color: attributes.hoverTextColor,
                        borderColor: attributes.borderWeight && attributes.borderColor && attributes.hoverBorderColor ? attributes.hoverBorderColor : false,
                    },
                };
            },
            supports: {
                styles: true,
                spacings: true,
                display: true,
                scrollReveal: true,
            },
        },
        supports: {
            html: false,
            className: false,
            anchor: true,
        },
        attributes: {
            url: {
                type: 'string',
                source: 'attribute',
                selector: 'a.ghostkit-button',
                attribute: 'href',
            },
            title: {
                type: 'string',
                source: 'attribute',
                selector: '.ghostkit-button',
                attribute: 'title',
            },
            text: {
                type: 'array',
                source: 'children',
                selector: '.ghostkit-button',
                default: 'Button',
            },
            size: {
                type: 'string',
                default: 'md',
            },
            color: {
                type: 'string',
                default: '#0366d6',
            },
            textColor: {
                type: 'string',
                default: '#ffffff',
            },
            borderRadius: {
                type: 'number',
                default: 2,
            },
            borderWeight: {
                type: 'number',
                default: 0,
            },
            borderColor: {
                type: 'string',
                default: '#00669b',
            },
            hoverColor: {
                type: 'string',
            },
            hoverTextColor: {
                type: 'string',
            },
            hoverBorderColor: {
                type: 'string',
            },
        },

        save( props ) {
            const {
                title,
                text,
                url,
                size,
            } = props.attributes;

            let {
                className,
            } = props.attributes;

            className = classnames(
                'ghostkit-button',
                size ? `ghostkit-button-${ size }` : '',
                className
            );

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/button-single',
                },
                ...props,
            } );

            return url ? (
                <RichText.Content
                    tagName="a"
                    className={ className }
                    href={ url }
                    title={ title }
                    value={ text }
                />
            ) : (
                <RichText.Content
                    tagName="span"
                    className={ className }
                    title={ title }
                    value={ text }
                />
            );
        },
    },
];
