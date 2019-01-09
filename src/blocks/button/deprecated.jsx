// External Dependencies.
import classnames from 'classnames/dedupe';

const {
    RichText,
} = wp.editor;

const {
    createBlock,
} = wp.blocks;

export default [
    {
        ghostkit: {
            customStylesCallback( attributes ) {
                return {
                    '.ghostkit-button': {
                        backgroundColor: attributes.color,
                        color: attributes.textColor,
                        borderRadius: attributes.borderRadius,
                        border: attributes.borderWeight && attributes.borderColor ? `${ attributes.borderWeight }px solid ${ attributes.borderColor }` : false,
                        '&:hover, &:focus': {
                            backgroundColor: attributes.hoverColor,
                            color: attributes.hoverTextColor,
                            borderColor: attributes.borderWeight && attributes.borderColor && attributes.hoverBorderColor ? attributes.hoverBorderColor : false,
                        },
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
            align: [ 'wide', 'full' ],
        },
        attributes: {
            variant: {
                type: 'string',
                default: 'default',
            },
            url: {
                type: 'string',
                source: 'attribute',
                selector: 'a',
                attribute: 'href',
            },
            title: {
                type: 'string',
                source: 'attribute',
                selector: 'a',
                attribute: 'title',
            },
            text: {
                type: 'array',
                source: 'children',
                selector: '.ghostkit-button',
                default: 'Button',
            },
            align: {
                type: 'string',
                default: 'none',
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
        migrate( attributes ) {
            return [
                {
                    variant: attributes.variant,
                    align: attributes.align,
                    count: 1,
                    gap: 'md',
                    ghostkitClassname: '',
                    ghostkitId: '',
                    ghostkitDisplay: {},
                    ghostkitIndents: {},
                    ghostkitSpacings: {},
                    ghostkitStyles: {},
                },
                [
                    createBlock( 'ghostkit/button-single', {
                        url: attributes.url,
                        title: attributes.title,
                        text: attributes.text,
                        size: attributes.size,
                        color: attributes.color,
                        textColor: attributes.textColor,
                        borderRadius: attributes.borderRadius,
                        borderWeight: attributes.borderWeight,
                        borderColor: attributes.borderColor,
                        hoverColor: attributes.hoverColor,
                        hoverTextColor: attributes.hoverTextColor,
                        hoverBorderColor: attributes.hoverBorderColor,
                    } ),
                ],
            ];
        },
        save( { attributes, className = '' } ) {
            const {
                text,
                url,
                title,
                align,
                size,
                variant,
            } = attributes;

            className = classnames( 'ghostkit-button-wrapper', className );

            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-button-variant-${ variant }` );
            }

            return (
                <div className={ classnames( className, `align${ align }` ) }>
                    <RichText.Content
                        tagName="a"
                        className={ classnames( 'ghostkit-button', size ? `ghostkit-button-${ size }` : '' ) }
                        href={ url }
                        title={ title }
                        value={ text }
                    />
                </div>
            );
        },
    },
];
