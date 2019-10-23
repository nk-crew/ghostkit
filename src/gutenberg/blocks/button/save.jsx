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
} = wp.blockEditor;

const { Component } = wp.element;

/**
 * Internal dependencies
 */
import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    render() {
        const {
            align,
            gap,
        } = this.props.attributes;

        let className = classnames(
            'ghostkit-button-wrapper',
            gap ? `ghostkit-button-wrapper-gap-${ gap }` : false,
            align && align !== 'none' ? `ghostkit-button-wrapper-align-${ align }` : false
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
}

export default BlockSave;
