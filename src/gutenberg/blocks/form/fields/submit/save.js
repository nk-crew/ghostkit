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
        let className = classnames(
            'ghostkit-form-submit-button'
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
