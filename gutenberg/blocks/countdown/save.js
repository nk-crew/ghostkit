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
	const { attributes } = props;

	const { date, units, unitsAlign } = attributes;

	let className = classnames(
		'ghostkit-countdown',
		unitsAlign && `ghostkit-countdown-units-align-${unitsAlign}`
	);

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const blockProps = useBlockProps.save({ className, 'data-date': date });
	const innerBlockProps = useInnerBlocksProps.save({
		className: 'ghostkit-countdown-expire-action',
	});

	return (
		<div {...blockProps}>
			{units.map((unitName) => (
				<div
					key={unitName}
					className={classnames(
						'ghostkit-countdown-unit',
						`ghostkit-countdown-unit-${unitName}`
					)}
				>
					<span className="ghostkit-countdown-unit-number">00</span>
					<span className="ghostkit-countdown-unit-label">
						{unitName}
					</span>
				</div>
			))}
			<div {...innerBlockProps} />
		</div>
	);
}
