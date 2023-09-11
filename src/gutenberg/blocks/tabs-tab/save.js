/**
 * Internal dependencies
 */
import metadata from './block.json';

const { name } = metadata;

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { useInnerBlocksProps: __stableUseInnerBlocksProps, __experimentalUseInnerBlocksProps } =
  wp.blockEditor;

const useInnerBlocksProps = __stableUseInnerBlocksProps || __experimentalUseInnerBlocksProps;

/**
 * Block Save Class.
 */
export default function BlockEdit(props) {
  const { slug } = props.attributes;

  let className = 'ghostkit-tab';

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{ name },
    ...props,
  });

  const innerBlockProps = useInnerBlocksProps.save({ className, 'data-tab': slug });

  return <div {...innerBlockProps} />;
}
