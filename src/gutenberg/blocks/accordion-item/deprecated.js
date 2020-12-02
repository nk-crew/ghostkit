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
    // v2.15.0
    {
        ...metadata,
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
                                <svg className="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.21967 6.2197C9.51256 5.9268 9.98744 5.9268 10.2803 6.2197L15.5303 11.4697C15.8232 11.7626 15.8232 12.2374 15.5303 12.5303L10.2803 17.7803C9.98744 18.0732 9.51256 18.0732 9.21967 17.7803C8.92678 17.4874 8.92678 17.0126 9.21967 16.7197L13.9393 12L9.21967 7.2803C8.92678 6.9874 8.92678 6.5126 9.21967 6.2197Z" fill="currentColor" /></svg>
                            </span>
                        </a>
                        <div className="ghostkit-accordion-item-content"><InnerBlocks.Content /></div>
                    </div>
                );
            }
        },
    },

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
];
