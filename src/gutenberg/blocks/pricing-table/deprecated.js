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

const { Component } = wp.element;

const {
    InnerBlocks,
} = wp.blockEditor;

const { name } = metadata;

export default [
    // v2.8.2
    {
        ...metadata,
        ghostkit: {
            previewUrl: 'https://ghostkit.io/blocks/pricing-tables/',
            supports: {
                styles: true,
                frame: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        save: class BlockSave extends Component {
            render() {
                const {
                    count,
                    gap,
                    verticalAlign,
                    horizontalAlign,
                } = this.props.attributes;

                let className = classnames(
                    'ghostkit-pricing-table',
                    `ghostkit-pricing-table-gap-${ gap }`,
                    count ? `ghostkit-pricing-table-items-${ count }` : false,
                    verticalAlign ? `ghostkit-pricing-table-align-vertical-${ verticalAlign }` : false,
                    horizontalAlign ? `ghostkit-pricing-table-align-horizontal-${ horizontalAlign }` : false
                );

                className = applyFilters( 'ghostkit.blocks.className', className, {
                    ...{
                        name,
                    },
                    ...this.props,
                } );

                return (
                    <div className={ className }>
                        <InnerBlocks.Content />
                    </div>
                );
            }
        },
    },
];
