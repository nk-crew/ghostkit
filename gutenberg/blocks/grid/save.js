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
	const { verticalAlign, horizontalAlign, gap } = props.attributes;

	let className = classnames(
		'ghostkit-grid',
		`ghostkit-grid-gap-${gap}`,
		verticalAlign ? `ghostkit-grid-align-items-${verticalAlign}` : false,
		horizontalAlign
			? `ghostkit-grid-justify-content-${horizontalAlign}`
			: false
	);

	// background
	const background = applyFilters('ghostkit.blocks.grid.background', '', {
		name,
		...props,
	});

	if (background) {
		className = classnames(className, 'ghostkit-grid-with-bg');
	}

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const blockProps = useBlockProps.save({
		className,
	});
	const { children, ...innerBlocksProps } =
		useInnerBlocksProps.save(blockProps);

	return (
		<div {...innerBlocksProps}>
			{background}
			<div className="ghostkit-grid-inner">{children}</div>
		</div>
	);
}
