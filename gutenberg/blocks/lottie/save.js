import { useBlockProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const {
		fileUrl,
		fileWidth,
		fileHeight,
		trigger,
		loop,
		direction,
		speed,
		width,
	} = props.attributes;

	let className = 'ghostkit-lottie';

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const blockProps = useBlockProps.save({
		className,
		'data-trigger': trigger,
		style:
			fileWidth && fileHeight
				? {
						'--gkt-lottie__ar': `${fileWidth} / ${fileHeight}`,
						'--gkt-lottie__width': width,
					}
				: {},
	});

	return (
		<div {...blockProps}>
			<lottie-player
				src={fileUrl}
				direction={direction}
				background="transparent"
				mode="normal"
				{...(trigger !== 'scroll' ? { speed } : {})}
				{...(trigger !== 'scroll' && loop ? { loop: 'loop' } : {})}
				{...(!trigger ? { autoplay: 'autoplay' } : {})}
				{...(trigger === 'hover' ? { hover: 'hover' } : {})}
				style={{
					width: '100%',
					height: 'auto',
				}}
			/>
		</div>
	);
}
