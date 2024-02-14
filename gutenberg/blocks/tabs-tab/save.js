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
	const { slug, active } = props.attributes;

	let className = classnames('ghostkit-tab', active && 'ghostkit-tab-active');

	className = applyFilters('ghostkit.blocks.className', className, {
		...{ name },
		...props,
	});

	const blockProps = useBlockProps.save({
		className,
		tabIndex: 0,
		role: 'tabpanel',
		'aria-labelledby': `${slug}-button`,
		'data-tab': slug,
	});
	const innerBlockProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlockProps} />;
}
