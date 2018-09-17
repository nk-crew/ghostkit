// External Dependencies.
import classnames from 'classnames/dedupe';

export default [
    {
        supports: {
            html: false,
            ghostkitStyles: true,
            ghostkitSpacings: true,
            ghostkitDisplay: true,
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
                selector: 'a',
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
                default: '#016c91',
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
        save: function( { attributes, className = '' } ) {
            const {
                text,
                url,
                title,
                align,
                size,
                variant,
            } = attributes;

            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-button-variant-${ variant }` );
            }

            return (
                <div className={ classnames( className, `align${ align }` ) }>
                    <a className={ classnames( 'ghostkit-button', size ? `ghostkit-button-${ size }` : '' ) } href={ url } title={ title }>
                        { text }
                    </a>
                </div>
            );
        },
    },
];
