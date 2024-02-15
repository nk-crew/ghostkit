import classNames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import IconPicker from '../../components/icon-picker';
import metadata from './block.json';
const { name } = metadata;

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const {
		effect,
		speed,
		autoplay,
		autoplayHoverPause,
		slidesPerView,
		centeredSlides,
		loop,
		freeScroll,
		fadeEdges,
		showArrows,
		arrowPrevIcon,
		arrowNextIcon,
		showBullets,
		dynamicBullets,
		gap,
	} = props.attributes;

	let className = classNames(
		'ghostkit-carousel',
		fadeEdges && 'ghostkit-carousel-fade-edges'
	);

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const dataAttrs = {
		'data-effect': effect,
		'data-speed': speed,
		'data-autoplay': autoplay,
		'data-autoplay-hover-pause':
			autoplay && autoplayHoverPause ? 'true' : null,
		'data-slides-per-view': slidesPerView,
		'data-centered-slides': centeredSlides ? 'true' : 'false',
		'data-loop': loop ? 'true' : 'false',
		'data-free-scroll': freeScroll ? 'true' : 'false',
		'data-show-arrows': showArrows ? 'true' : 'false',
		'data-show-bullets': showBullets ? 'true' : 'false',
		'data-dynamic-bullets': dynamicBullets ? 'true' : 'false',
		'data-gap': gap,
	};

	const blockProps = useBlockProps.save({ className, ...dataAttrs });
	const innerBlockProps = useInnerBlocksProps.save({
		className: 'ghostkit-carousel-items',
	});

	return (
		<div {...blockProps}>
			<div {...innerBlockProps} />
			{arrowPrevIcon ? (
				<IconPicker.Render
					name={arrowPrevIcon}
					tag="div"
					className="ghostkit-carousel-arrow-prev-icon"
				/>
			) : null}
			{arrowNextIcon ? (
				<IconPicker.Render
					name={arrowNextIcon}
					tag="div"
					className="ghostkit-carousel-arrow-next-icon"
				/>
			) : null}
		</div>
	);
}
