import classnames from 'classnames/dedupe';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { align, gap } = props.attributes;

	let className = classnames(
		'ghostkit-button-wrapper',
		gap ? `ghostkit-button-wrapper-gap-${gap}` : false,
		align && align !== 'none'
			? `ghostkit-button-wrapper-align-${align}`
			: false
	);

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const blockProps = useBlockProps.save({
		className,
	});
	const { children, ...innerBlocksProps } = useInnerBlocksProps.save({
		className: 'ghostkit-button-wrapper-inner',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlocksProps}>{children}</div>
		</div>
	);
}
