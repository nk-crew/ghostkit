/**
 * Block Google Maps
 */
import { InitGoogleMaps } from './gmaps-api';

const {
	GHOSTKIT: { events, googleMapsAPIKey },
} = window;

/**
 * Prepare Google Maps.
 */
events.on(document, 'init.blocks.gkt', () => {
	if (!googleMapsAPIKey) {
		return;
	}

	document
		.querySelectorAll(
			'.ghostkit-google-maps:not(.ghostkit-google-maps-ready)'
		)
		.forEach(($this) => {
			$this.classList.add('ghostkit-google-maps-ready');

			let styles = '';
			let markers = '';

			try {
				styles = JSON.parse($this.getAttribute('data-styles'));
			} catch (evt) {}

			const $markers = $this.querySelectorAll(
				'.ghostkit-google-maps-marker'
			);
			if ($markers.length) {
				markers = [];

				$markers.forEach(($marker) => {
					const markerData = $marker.dataset;

					const $infoWindow = $marker.querySelector(
						':scope .ghostkit-pro-google-maps-marker-info-window-text'
					);

					// info window
					if ($infoWindow) {
						markerData.infoWindowText = $infoWindow.innerHTML;
					}

					markers.push(markerData);
				});

				// old way.
			} else if ($this.getAttribute('data-markers')) {
				try {
					markers = JSON.parse($this.getAttribute('data-markers'));
				} catch (evt) {}
			}

			InitGoogleMaps($this, {
				styles,
				markers,
				center: {
					lat: parseFloat($this.getAttribute('data-lat')),
					lng: parseFloat($this.getAttribute('data-lng')),
				},
				zoom: parseInt($this.getAttribute('data-zoom'), 10),
				zoomControl:
					$this.getAttribute('data-show-zoom-buttons') === 'true',
				zoomControlOpt: {
					style: 'DEFAULT',
					position: 'RIGHT_BOTTOM',
				},
				mapTypeControl:
					$this.getAttribute('data-show-map-type-buttons') === 'true',
				streetViewControl:
					$this.getAttribute('data-show-street-view-button') ===
					'true',
				fullscreenControl:
					$this.getAttribute('data-show-fullscreen-button') ===
					'true',
				scrollwheel:
					$this.getAttribute('data-option-scroll-wheel') === 'true',
				draggable:
					$this.getAttribute('data-option-draggable') === 'true',
			});
		});
});
