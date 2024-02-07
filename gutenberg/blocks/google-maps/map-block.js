import { useEffect, useRef, useState } from '@wordpress/element';

import { addMarker, InitGoogleMaps } from './gmaps-api';

export default function MapBlock(props) {
	const { apiUrl, options, markers, onChangeMarkers } = props;

	const [instance, setInstance] = useState(null);
	const mapRef = useRef(null);
	const markersRef = useRef(null);

	// Load Google Maps API and initialize the map
	useEffect(() => {
		if (!mapRef.current) {
			return;
		}

		if (!instance) {
			InitGoogleMaps(
				mapRef.current,
				{ apiUrl, ...options },
				(newInstance) => {
					setInstance(newInstance);
				}
			);
		} else {
			instance.setOptions(options);
		}
	}, [apiUrl, instance, options]);

	// Add markers to the map.
	useEffect(() => {
		if (!instance || !markers || !markers.length) {
			return;
		}

		// Reset old markers.
		if (markersRef.current?.length) {
			markersRef.current.forEach((marker) => {
				marker.setMap(null);
			});
		}

		markersRef.current = [];

		markers.forEach((markerData, i) => {
			const thereIsIcon =
				markerData.iconImageURL &&
				markerData.iconImageCustomWidth &&
				markerData.iconImageWidth &&
				markerData.iconImageHeight;
			let iconURL = null;
			let iconWidth = null;
			let iconHeight = null;
			if (thereIsIcon) {
				const iconImageCustomHeight =
					markerData.iconImageCustomWidth *
					(markerData.iconImageHeight / markerData.iconImageWidth);

				iconURL = markerData.iconImageURL;
				iconWidth = markerData.iconImageCustomWidth;
				iconHeight = iconImageCustomHeight;
			}

			const { marker } = addMarker({
				map: instance,
				lat: markerData.lat,
				lng: markerData.lng,
				title: markerData.title,
				description: markerData.infoWindowText,
				iconURL,
				iconWidth,
				iconHeight,
				draggable: true,
			});

			markersRef.current.push(marker);

			// Drag markers.
			window.google.maps.event.addListener(marker, 'dragend', (event) => {
				const lat = event.latLng.lat();
				const lng = event.latLng.lng();

				const newMarkers = Object.assign([], markers);

				newMarkers[i].lat = lat;
				newMarkers[i].lng = lng;

				onChangeMarkers(newMarkers);
			});
		});
	}, [apiUrl, instance, options, markers, onChangeMarkers]);

	return (
		<div
			ref={mapRef}
			className="ghostkit-google-maps-wrap"
			style={{ minHeight: '100%' }}
		/>
	);
}
