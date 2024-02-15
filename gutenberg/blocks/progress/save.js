import classnames from 'classnames/dedupe';

import metadata from './block.json';

const { name } = metadata;

import { RichText, useBlockProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const {
		caption,
		percent,
		striped,
		showCount,
		countPrefix,
		countSuffix,
		animateInViewport,
	} = props.attributes;

	let className = 'ghostkit-progress';

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const blockProps = useBlockProps.save({ className });

	return (
		<div {...blockProps}>
			{!RichText.isEmpty(caption) ? (
				<div className="ghostkit-progress-caption">
					<RichText.Content value={caption} />
				</div>
			) : null}
			{showCount ? (
				<div
					className="ghostkit-progress-bar-count"
					style={{ width: `${percent}%` }}
				>
					<div>
						<span>{countPrefix}</span>
						<span>{percent}</span>
						<span>{countSuffix}</span>
					</div>
				</div>
			) : null}
			<div
				className={classnames(
					'ghostkit-progress-wrap',
					striped && 'ghostkit-progress-bar-striped'
				)}
			>
				<div
					className={classnames(
						'ghostkit-progress-bar',
						animateInViewport && 'ghostkit-count-up'
					)}
					role="progressbar"
					aria-valuenow={percent}
					aria-valuemin="0"
					aria-valuemax="100"
				/>
			</div>
		</div>
	);
}
