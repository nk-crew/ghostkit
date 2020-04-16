/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const {
    InnerBlocks,
    RichText,
} = wp.blockEditor;

const { Component } = wp.element;

const { name } = metadata;

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
        attributes: metadata.attributes,
        save: class BlockSave extends Component {
            render() {
                const {
                    heading,
                    active,
                    slug,
                } = this.props.attributes;

                let className = classnames(
                    'ghostkit-accordion-item',
                    active ? 'ghostkit-accordion-item-active' : ''
                );

                className = applyFilters( 'ghostkit.blocks.className', className, {
                    ...{
                        name,
                    },
                    ...this.props,
                } );

                return (
                    <div className={ className }>
                        <a href={ `#${ slug }` } className="ghostkit-accordion-item-heading">
                            <RichText.Content
                                className="ghostkit-accordion-item-label"
                                tagName="span"
                                value={ heading }
                            />
                            <span className="ghostkit-accordion-item-collapse">
                                <span className="fas fa-angle-right" />
                            </span>
                        </a>
                        <div className="ghostkit-accordion-item-content"><InnerBlocks.Content /></div>
                    </div>
                );
            }
        },
    },

    // v2.6.3
    {
        ghostkit: {
            supports: {
                styles: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        supports: {
            html: false,
            className: false,
            anchor: true,
            align: [ 'wide', 'full' ],
            inserter: false,
            reusable: false,
        },
        attributes: {
            heading: {
                type: 'array',
                source: 'children',
                selector: '.ghostkit-accordion-item-label',
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
        save: class BlockSave extends Component {
            render() {
                const {
                    heading,
                    active,
                    itemNumber,
                } = this.props.attributes;

                let className = classnames(
                    'ghostkit-accordion-item',
                    active ? 'ghostkit-accordion-item-active' : ''
                );

                className = applyFilters( 'ghostkit.blocks.className', className, {
                    ...{
                        name,
                    },
                    ...this.props,
                } );

                return (
                    <div className={ className }>
                        <a href={ `#accordion-${ itemNumber }` } className="ghostkit-accordion-item-heading">
                            <RichText.Content
                                className="ghostkit-accordion-item-label"
                                tagName="span"
                                value={ heading }
                            />
                            <span className="ghostkit-accordion-item-collapse">
                                <span className="fas fa-angle-right" />
                            </span>
                        </a>
                        <div className="ghostkit-accordion-item-content"><InnerBlocks.Content /></div>
                    </div>
                );
            }
        },
    },

    // v1.0.0
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
        save( props ) {
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
                    name,
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
