import classnames from 'classnames/dedupe';

import { applyFilters } from '@wordpress/hooks';

import { maybeDecode } from '../../utils/encode-decode';
import metadata from './block.json';

const { name } = metadata;

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const {
		height,
		zoom,
		lat,
		lng,
		showZoomButtons,
		showMapTypeButtons,
		showStreetViewButton,
		showFullscreenButton,
		optionScrollWheel,
		gestureHandling,
		optionDraggable,
		styleCustom,
		markers,
		fullHeight,
	} = props.attributes;

	let className = 'ghostkit-google-maps';

	// add full height classname.
	if (fullHeight) {
		className = classnames(className, 'ghostkit-google-maps-fullheight');
	}

	className = applyFilters('ghostkit.blocks.className', className, {
		...{
			name,
		},
		...props,
	});

	const attrs = {
		className,
		style: { minHeight: height },
		'data-lat': lat,
		'data-lng': lng,
		'data-zoom': zoom,
		'data-show-zoom-buttons': showZoomButtons ? 'true' : 'false',
		'data-show-map-type-buttons': showMapTypeButtons ? 'true' : 'false',
		'data-show-street-view-button': showStreetViewButton ? 'true' : 'false',
		'data-show-fullscreen-button': showFullscreenButton ? 'true' : 'false',
		'data-option-scroll-wheel': optionScrollWheel ? 'true' : 'false',
		'data-option-draggable': optionDraggable ? 'true' : 'false',
		'data-styles': maybeDecode(styleCustom),
	};

	if (gestureHandling !== 'greedy') {
		attrs['data-gesture-handling'] = gestureHandling;
	}

	const blockProps = useBlockProps.save(attrs);

	return (
		<div {...blockProps}>
			{markers
				? markers.map((marker, i) => {
						const markerData = {
							'data-lat': marker.lat,
							'data-lng': marker.lng,
							'data-address': marker.address,
						};

						const markerName = `marker-${i}`;

						return (
							<div
								key={markerName}
								className="ghostkit-google-maps-marker"
								{...markerData}
							/>
						);
					})
				: ''}
		</div>
	);
}
