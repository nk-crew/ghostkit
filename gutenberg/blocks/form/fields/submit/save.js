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

const { useBlockProps, useInnerBlocksProps } = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save component.
 */
export default function BlockSave(props) {
  const { align } = props.attributes;

  let className = classnames(
    'ghostkit-form-submit-button',
    align && align !== 'none' ? `ghostkit-form-submit-button-align-${align}` : false
  );

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{
      name,
    },
    ...props,
  });

  const blockProps = useBlockProps.save({ className });
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);

  return <div {...innerBlocksProps} />;
}
