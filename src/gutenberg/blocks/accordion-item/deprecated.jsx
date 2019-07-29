/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

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
        save: function( props ) {
            const {
                heading,
                active,
                itemNumber,
            } = props.attributes;

            let {
                className,
            } = props.attributes;

            className = classnames(
                className,
                'ghostkit-accordion-item',
                active ? 'ghostkit-accordion-item-active' : ''
            );

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/accordion-item',
                },
                ...props,
            } );

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
