/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { Component } = wp.element;

const { withSelect } = wp.data;

const { InnerBlocks } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  render() {
    const { hasChildBlocks } = this.props;

    let { className = '' } = this.props;

    className = classnames(className, 'ghostkit-tab');

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

export default withSelect((select, props) => {
  const { clientId } = props;
  const blockEditor = select('core/block-editor');

  return {
    hasChildBlocks: blockEditor ? 0 < blockEditor.getBlockOrder(clientId).length : false,
  };
})(BlockEdit);
