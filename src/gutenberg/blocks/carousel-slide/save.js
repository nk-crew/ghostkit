/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import metadata from './block.json';

const { applyFilters } = wp.hooks;

const {
  useBlockProps,
  useInnerBlocksProps: __stableUseInnerBlocksProps,
  __experimentalUseInnerBlocksProps,
} = wp.blockEditor;

const useInnerBlocksProps = __stableUseInnerBlocksProps || __experimentalUseInnerBlocksProps;

const { name } = metadata;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  let className = 'ghostkit-carousel-slide';

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
