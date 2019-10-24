/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

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

        save: function( props ) {
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
