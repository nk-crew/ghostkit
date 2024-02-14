import classnames from 'classnames/dedupe';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { clientId, attributes, setAttributes, context } = props;
	const { slug, active, anchor } = attributes;
	const { 'ghostkit/tabActive': tabActive } = context;

	let { className = '' } = props;

	// Update active state.
	useEffect(() => {
		if (tabActive === slug && !active) {
			setAttributes({ active: true });
		} else if (tabActive !== slug && active) {
			setAttributes({ active: false });
		}
	}, [active, setAttributes, slug, tabActive]);

	// Update anchor.
	useEffect(() => {
		if (anchor !== `${slug}-content`) {
			setAttributes({ anchor: `${slug}-content` });
		}
	}, [slug, anchor, setAttributes]);

	const hasChildBlocks = useSelect(
		(select) => {
			const blockEditor = select('core/block-editor');

			return blockEditor
				? blockEditor.getBlockOrder(clientId).length > 0
				: false;
		},
		[clientId]
	);

	className = classnames(
		className,
		'ghostkit-tab',
		tabActive === slug && 'ghostkit-tab-active'
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({
		className,
		tabIndex: 0,
		role: 'tabpanel',
		'aria-labelledby': slug,
		'data-tab': slug,
	});

	const innerBlockProps = useInnerBlocksProps(blockProps, {
		renderAppender: hasChildBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
		templateLock: false,
	});

	return <div {...innerBlockProps} />;
}
