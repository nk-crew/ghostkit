/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { InnerBlocks } = wp.blockEditor;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
    return <InnerBlocks.Content />;
  }
}

export default BlockSave;
