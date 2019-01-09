// External Dependencies.
import classnames from 'classnames/dedupe';

const {
    InnerBlocks,
    RichText,
} = wp.editor;

export default [
    {
        ghostkit: {
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
        },
        attributes: {
            variant: {
                type: 'string',
                default: 'default',
            },
            heading: {
                type: 'array',
                default: 'Accordion Item',
            },
            active: {
                type: 'boolean',
                default: false,
            },
            itemNumber: {
                type: 'number',
            },
        },
        save: function( { attributes } ) {
            const {
                variant,
                heading,
                active,
                itemNumber,
            } = attributes;

            let {
                className,
            } = attributes;

            className = classnames(
                className,
                'ghostkit-accordion-item',
                active ? 'ghostkit-accordion-item-active' : ''
            );

            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-accordion-item-variant-${ variant }` );
            }

            return (
                <div className={ className }>
                    <a href={ `#accordion-${ itemNumber }` } className="ghostkit-accordion-item-heading">
                        <RichText.Content
                            value={ heading }
                        />
                        <span className="ghostkit-accordion-item-collapse">
                            <span className="fas fa-angle-right" />
                        </span>
                    </a>
                    <div className="ghostkit-accordion-item-content"><InnerBlocks.Content /></div>
                </div>
            );
        },
    },
];
