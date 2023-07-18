/**
 * Block Google Maps
 */
import scriptjs from 'scriptjs';

const {
  GHOSTKIT: { events, googleMapsLibrary, googleMapsAPIKey, googleMapsAPIUrl },
} = window;

/**
 * Prepare Google Maps.
 */
events.on(document, 'init.blocks.gkt', () => {
  if (!googleMapsLibrary || !googleMapsAPIKey) {
    return;
  }

  document
    .querySelectorAll('.ghostkit-google-maps:not(.ghostkit-google-maps-ready)')
    .forEach(($this) => {
      $this.classList.add('ghostkit-google-maps-ready');

      scriptjs(`${googleMapsAPIUrl}&key=${googleMapsAPIKey}`, () => {
        scriptjs(googleMapsLibrary.url, () => {
          let styles = '';
          let markers = '';

          try {
            styles = JSON.parse($this.getAttribute('data-styles'));
            // eslint-disable-next-line no-empty
          } catch (evt) {}

          const $markers = $this.querySelectorAll('.ghostkit-google-maps-marker');
          if ($markers.length) {
            markers = [];

            $markers.forEach(($marker) => {
              const markerConf = {};

              markerConf.lat = $marker.getAttribute('data-lat');
              markerConf.lng = $marker.getAttribute('data-lng');

              markers.push(markerConf);
            });

            // old way.
          } else if ($this.getAttribute('data-markers')) {
            try {
              markers = JSON.parse($this.getAttribute('data-markers'));
              // eslint-disable-next-line no-empty
            } catch (evt) {}
          }

          const options = {
            div: $this,
            lat: parseFloat($this.getAttribute('data-lat')),
            lng: parseFloat($this.getAttribute('data-lng')),
            zoom: parseInt($this.getAttribute('data-zoom'), 10),
            zoomControl: $this.getAttribute('data-show-zoom-buttons') === 'true',
            zoomControlOpt: {
              style: 'DEFAULT',
              position: 'RIGHT_BOTTOM',
            },
            mapTypeControl: $this.getAttribute('data-show-map-type-buttons') === 'true',
            streetViewControl: $this.getAttribute('data-show-street-view-button') === 'true',
            fullscreenControl: $this.getAttribute('data-show-fullscreen-button') === 'true',
            scrollwheel: $this.getAttribute('data-option-scroll-wheel') === 'true',
            draggable: $this.getAttribute('data-option-draggable') === 'true',
            styles,
          };

          events.trigger($this, 'prepare.googleMaps.gkt', { options });

          const instance = new window.GMaps(options);

          // add gestureHandling
          const gestureHandling = $this.getAttribute('data-gesture-handling');
          if (instance && gestureHandling === 'cooperative') {
            instance.setOptions({
              gestureHandling,
              scrollwheel: options.scrollwheel ? null : options.scrollwheel,
            });
          }

          if (markers && markers.length) {
            instance.addMarkers(markers);
          }

          events.trigger($this, 'prepared.googleMaps.gkt', { options, instance });
        });
      });
    });
});
