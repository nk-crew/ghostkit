/**
 * WordPress dependencies
 */
const { useInnerBlocksProps } = wp.blockEditor;

/**
 * Block Save component.
 */
export default function BlockSave() {
  const innerBlocksProps = useInnerBlocksProps.save();

  return innerBlocksProps.children;
}
