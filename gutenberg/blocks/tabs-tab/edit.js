/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { useSelect } from '@wordpress/data';
import { InnerBlocks, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

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

  const blockProps = useBlockProps({ className, 'data-tab': slug });

  const innerBlockProps = useInnerBlocksProps(blockProps, {
    renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
    templateLock: false,
  });

  return <div {...innerBlockProps} />;
}