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

/**
 * Block Save Class.
 */
class BlockSave extends Component {
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
                <div className="ghostkit-pricing-table-inner">
                    <InnerBlocks.Content />
                </div>
            </div>
        );
    }
}

export default BlockSave;
