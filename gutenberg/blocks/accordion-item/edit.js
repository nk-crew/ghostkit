import classnames from 'classnames/dedupe';

import {
	BlockControls,
	InnerBlocks,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';
import getUniqueSlug from '../../utils/get-unique-slug';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, context, clientId } = props;
	const { heading, slug, active, titleTag } = attributes;

	const didMountRef = useRef();

	const contextTitleTag = context['ghostkit/collapseTitleTag'] || 'div';

	useEffect(() => {
		// Did update.
		// Update item slug.
		if (didMountRef.current) {
			const newSlug = getUniqueSlug(`accordion ${heading}`, clientId);

			setAttributes({
				slug: newSlug,
			});

			// Did mount.
		} else {
			didMountRef.current = true;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [heading, slug]);

	// Update title tag.
	useEffect(() => {
		if (titleTag !== contextTitleTag) {
			setAttributes({ titleTag: contextTitleTag });
		}
	}, [contextTitleTag, setAttributes, titleTag]);

	let className = classnames(
		attributes.className,
		'ghostkit-accordion-item',
		active && 'ghostkit-accordion-item-active'
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const { hasChildBlocks } = useSelect(
		(select) => {
			const blockEditor = select('core/block-editor');

			return {
				hasChildBlocks: blockEditor
					? blockEditor.getBlockOrder(clientId).length > 0
					: false,
			};
		},
		[clientId]
	);

	const TitleTag = titleTag || 'div';

	const blockProps = useBlockProps({
		className,
		'data-accordion': slug,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			id: `${slug}-content`,
			className: 'ghostkit-accordion-item-content',
		},
		{
			templateLock: false,
			renderAppender: hasChildBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={getIcon('block-accordion-collapse')}
						label={__('Collapse', 'ghostkit')}
						onClick={() => setAttributes({ active: !active })}
						isActive={active}
					/>
				</ToolbarGroup>
			</BlockControls>
			<div {...blockProps}>
				<TitleTag className="ghostkit-accordion-item-heading">
					<RichText
						tagName="div"
						id={`${slug}-button`}
						className="ghostkit-accordion-item-label"
						placeholder={__('Write label…', 'ghostkit')}
						value={heading}
						onChange={(value) => {
							setAttributes({ heading: value });
						}}
						withoutInteractiveFormatting
					/>
					<button
						className="ghostkit-accordion-item-collapse"
						onClick={() => setAttributes({ active: !active })}
					>
						<svg
							className="ghostkit-svg-icon"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9.21967 6.2197C9.51256 5.9268 9.98744 5.9268 10.2803 6.2197L15.5303 11.4697C15.8232 11.7626 15.8232 12.2374 15.5303 12.5303L10.2803 17.7803C9.98744 18.0732 9.51256 18.0732 9.21967 17.7803C8.92678 17.4874 8.92678 17.0126 9.21967 16.7197L13.9393 12L9.21967 7.2803C8.92678 6.9874 8.92678 6.5126 9.21967 6.2197Z"
								fill="currentColor"
							/>
						</svg>
					</button>
				</TitleTag>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}
