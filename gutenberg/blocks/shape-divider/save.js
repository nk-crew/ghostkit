import classnames from 'classnames/dedupe';

import { useBlockProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import { maybeDecode } from '../../utils/encode-decode';
import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { svg, flipVertical, flipHorizontal } = props.attributes;

	let className = classnames('ghostkit-shape-divider', {
		'ghostkit-shape-divider-flip-vertical': flipVertical,
		'ghostkit-shape-divider-flip-horizontal': flipHorizontal,
	});

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const blockProps = useBlockProps.save({
		className,
		dangerouslySetInnerHTML: { __html: maybeDecode(svg) },
	});

	return <div {...blockProps} />;
}
