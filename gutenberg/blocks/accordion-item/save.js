import classnames from 'classnames/dedupe';

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { attributes } = props;
	const { heading, active, slug, titleTag } = attributes;

	let className = classnames(
		'ghostkit-accordion-item',
		active && 'ghostkit-accordion-item-active'
	);

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const TitleTag = titleTag || 'div';

	const blockProps = useBlockProps.save({
		className,
		'data-accordion': slug,
	});
	const innerBlocksProps = useInnerBlocksProps.save({
		id: `${slug}-content`,
		className: 'ghostkit-accordion-item-content',
		role: 'region',
		'aria-labelledby': `${slug}-button`,
	});

	return (
		<div {...blockProps}>
			<TitleTag className="ghostkit-accordion-item-heading">
				<button
					type="button"
					id={`${slug}-button`}
					aria-expanded={active ? 'true' : 'false'}
					aria-controls={`${slug}-content`}
				>
					<RichText.Content
						className="ghostkit-accordion-item-label"
						tagName="span"
						value={heading}
					/>
					<span className="ghostkit-accordion-item-collapse">
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
					</span>
				</button>
			</TitleTag>
			<div {...innerBlocksProps} />
		</div>
	);
}
