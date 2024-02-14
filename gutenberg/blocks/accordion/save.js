import classnames from 'classnames/dedupe';

import metadata from './block.json';

const { name } = metadata;

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { itemsCount, collapseOne } = props.attributes;

	let className = classnames(
		'ghostkit-accordion',
		`ghostkit-accordion-${itemsCount}`,
		collapseOne && 'ghostkit-accordion-collapse-one'
	);

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const blockProps = useBlockProps.save({ className });
	const innerBlockProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlockProps} />;
}
