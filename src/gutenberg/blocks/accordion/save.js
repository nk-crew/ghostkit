/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import metadata from './block.json';

const { name } = metadata;

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const {
  useBlockProps,
  useInnerBlocksProps: __stableUseInnerBlocksProps,
  __experimentalUseInnerBlocksProps,
} = wp.blockEditor;

const useInnerBlocksProps = __stableUseInnerBlocksProps || __experimentalUseInnerBlocksProps;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { itemsCount, collapseOne } = props.attributes;

  let className = classnames(
    'ghostkit-accordion',
    `ghostkit-accordion-${itemsCount}`,
    collapseOne ? 'ghostkit-accordion-collapse-one' : ''
  );

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{
      name,
    },
    ...props,
  });

  const blockProps = useBlockProps.save({ className });
  const innerBlockProps = useInnerBlocksProps.save(blockProps);

  return <div {...innerBlockProps} />;
}
