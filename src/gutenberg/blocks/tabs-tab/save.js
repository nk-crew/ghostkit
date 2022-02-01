/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { Component } = wp.element;

const { InnerBlocks } = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
    const { slug } = this.props.attributes;

    let className = 'ghostkit-tab';

    className = applyFilters('ghostkit.blocks.className', className, {
      ...{
        name,
      },
      ...this.props,
    });

    return (
      <div className={className} data-tab={slug}>
        <InnerBlocks.Content />
      </div>
    );
  }
}

export default BlockSave;
