/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { useSelect } = wp.data;
const { InnerBlocks, useInnerBlocksProps } = wp.blockEditor;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { clientId } = props;
  let { className = '' } = props;
  const { slug } = props.attributes;

  const hasChildBlocks = useSelect(
    (select) => {
      const blockEditor = select('core/block-editor');

      return blockEditor ? blockEditor.getBlockOrder(clientId).length > 0 : false;
    },
    [clientId]
  );

  className = classnames(className, 'ghostkit-tab');

  className = applyFilters('ghostkit.editor.className', className, props);

  const innerBlockProps = useInnerBlocksProps(
    { className, 'data-tab': slug },
    {
      renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
      templateLock: false,
    }
  );

  return <div {...innerBlockProps} />;
}
