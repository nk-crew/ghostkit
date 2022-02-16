/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { Component } = wp.element;

const { InnerBlocks } = wp.blockEditor;

const { withSelect } = wp.data;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  render() {
    const { attributes, hasChildBlocks } = this.props;

    let { className } = attributes;

    className = classnames(className, 'ghostkit-carousel-slide');

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <div className={className}>
        <InnerBlocks
          templateLock={false}
          renderAppender={hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender />}
        />
      </div>
    );
  }
}

export default withSelect((select, ownProps) => {
  const { clientId } = ownProps;
  const blockEditor = select('core/block-editor');

  return {
    hasChildBlocks: blockEditor ? 0 < blockEditor.getBlockOrder(clientId).length : false,
  };
})(BlockEdit);
