import classnames from 'classnames/dedupe';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, clientId } = props;
	let { className } = attributes;

	const hasChildBlocks = useSelect(
		(select) => {
			const blockEditor = select('core/block-editor');

			return blockEditor
				? blockEditor.getBlockOrder(clientId).length > 0
				: false;
		},
		[clientId]
	);

	className = classnames(className, 'ghostkit-carousel-slide');

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });
	const innerBlockProps = useInnerBlocksProps(blockProps, {
		renderAppender: hasChildBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
		templateLock: false,
	});

	return <div {...innerBlockProps} />;
}
