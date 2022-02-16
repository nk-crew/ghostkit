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
const { applyFilters } = wp.hooks;

const { InnerBlocks } = wp.blockEditor;

const { Component } = wp.element;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
    const { align } = this.props.attributes;

    let className = classnames(
      'ghostkit-form-submit-button',
      align && 'none' !== align ? `ghostkit-form-submit-button-align-${align}` : false
    );

    className = applyFilters('ghostkit.blocks.className', className, {
      ...{
        name,
      },
      ...this.props,
    });

    return (
      <div className={className}>
        <InnerBlocks.Content />
      </div>
    );
  }
}

export default BlockSave;
