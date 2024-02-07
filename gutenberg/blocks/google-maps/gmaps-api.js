import scriptjs from 'scriptjs';

const {
	GHOSTKIT: { events, googleMapsAPIKey, googleMapsAPIUrl },
} = window;

export function InitGoogleMaps(element, options, callback) {
	const {
		markers,
		apiUrl = `${googleMapsAPIUrl}&key=${googleMapsAPIKey}`,
		onZoomChange,
		onCenterChange,
		...restOptions
	} = options;

	scriptjs(apiUrl, () => {
		events.trigger(element, 'prepare.googleMaps.gkt', {
			options,
		});

		const instance = new window.google.maps.Map(element, restOptions);

		// add gestureHandling
		const gestureHandling = element.getAttribute('data-gesture-handling');
		if (instance && gestureHandling === 'cooperative') {
			instance.setOptions({
				gestureHandling,
				scrollwheel: options.scrollwheel ? null : options.scrollwheel,
			});
		}

		if (markers && markers.length) {
			markers.forEach((markerData) => {
				addMarker({
					map: instance,
					lat: markerData.lat,
					lng: markerData.lng,
					title: markerData.title,
					description: markerData.infoWindowText,
					iconURL: markerData.iconUrl,
					iconWidth: markerData.iconWidth,
					iconHeight: markerData.iconHeight,
				});
			});
		}

		// Events.
		if (onZoomChange) {
			instance.addListener('zoom_changed', () => {
				onZoomChange(instance.getZoom());
			});
		}
		if (onCenterChange) {
			instance.addListener('center_changed', () => {
				onCenterChange(instance.getCenter());
			});
		}

		events.trigger(element, 'prepared.googleMaps.gkt', {
			options,
			instance,
		});

		if (callback) {
			callback(instance);
		}
	});
}

export function addMarker(data) {
	const {
		map,
		lat,
		lng,
		title,
		description,
		iconURL,
		iconWidth,
		iconHeight,
		...rest
	} = data;

	let icon = null;
	const thereIsIcon = iconURL && iconWidth && iconHeight;
	if (thereIsIcon) {
		icon = {
			url: iconURL,
			scaledSize: new window.google.maps.Size(iconWidth, iconHeight),
		};
	}

	const position = new window.google.maps.LatLng(lat, lng);

	const marker = new window.google.maps.Marker({
		map,
		position,
		title,
		icon,
		...rest,
	});

	let infoWindow = null;

	if (description || title) {
		let content = '';

		if (title) {
			content += `<h3>${title}</h3>`;
		}
		if (description) {
			content += description;
		}

		infoWindow = new window.google.maps.InfoWindow({
			content,
		});

		marker.addListener('click', () => {
			infoWindow.open(map, marker);
		});
	}

	return { marker, infoWindow };
}
