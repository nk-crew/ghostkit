import { useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Block Save component.
 */
export default function BlockSave() {
	const innerBlocksProps = useInnerBlocksProps.save();

	return innerBlocksProps.children;
}
