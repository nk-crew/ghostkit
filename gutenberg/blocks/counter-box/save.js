import classnames from 'classnames/dedupe';

import metadata from './block.json';

const { name } = metadata;

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { attributes } = props;
	const {
		number,
		animateInViewport,
		numberPosition,
		numberAlign,
		showContent,
		url,
		ariaLabel,
		target,
		rel,
	} = attributes;

	let { animateInViewportFrom } = attributes;

	animateInViewportFrom = parseFloat(animateInViewportFrom);

	let className = classnames(
		'ghostkit-counter-box',
		url && 'ghostkit-counter-box-with-link'
	);
	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const classNameNumber = classnames(
		'ghostkit-counter-box-number',
		`ghostkit-counter-box-number-align-${numberPosition || 'left'}`,
		numberPosition === 'top'
			? `ghostkit-counter-box-number-top-align-${numberAlign || 'center'}`
			: ''
	);

	const blockProps = useBlockProps.save({ className });
	const innerBlockProps = useInnerBlocksProps.save({
		className: 'ghostkit-counter-box-content',
	});

	return (
		<div {...blockProps}>
			{url ? (
				<a
					className="ghostkit-counter-box-link"
					href={url}
					target={target || null}
					rel={rel || null}
					aria-label={ariaLabel || null}
				>
					<span />
				</a>
			) : null}
			<div className={classNameNumber}>
				<RichText.Content
					tagName="div"
					className={`ghostkit-counter-box-number-wrap${
						animateInViewport ? ' ghostkit-count-up' : ''
					}`}
					value={number}
					{...{
						'data-count-from':
							animateInViewport && animateInViewportFrom
								? animateInViewportFrom
								: null,
					}}
				/>
			</div>
			{showContent ? <div {...innerBlockProps} /> : null}
		</div>
	);
}
