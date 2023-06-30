/**
 * Block Google Maps
 */
import scriptjs from 'scriptjs';

const { GHOSTKIT, jQuery: $ } = window;
const $doc = $(document);

/**
 * Prepare Google Maps.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  if (GHOSTKIT.googleMapsLibrary && GHOSTKIT.googleMapsAPIKey) {
    GHOSTKIT.triggerEvent('beforePrepareGoogleMaps', self);

    document
      .querySelectorAll('.ghostkit-google-maps:not(.ghostkit-google-maps-ready)')
      .forEach(($this) => {
        $this.classList.add('ghostkit-google-maps-ready');

        scriptjs(`${GHOSTKIT.googleMapsAPIUrl}&key=${GHOSTKIT.googleMapsAPIKey}`, () => {
          scriptjs(GHOSTKIT.googleMapsLibrary.url, () => {
            GHOSTKIT.triggerEvent('beforePrepareGoogleMapsStart', self, $this);

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

            const opts = {
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

            const mapObject = new window.GMaps(opts);

            // add gestureHandling
            const gestureHandling = $this.getAttribute('data-gesture-handling');
            if (mapObject && gestureHandling === 'cooperative') {
              mapObject.setOptions({
                gestureHandling,
                scrollwheel: opts.scrollwheel ? null : opts.scrollwheel,
              });
            }

            if (markers && markers.length) {
              mapObject.addMarkers(markers);
            }

            GHOSTKIT.triggerEvent('beforePrepareGoogleMapsEnd', self, $this, mapObject);
          });
        });
      });

    GHOSTKIT.triggerEvent('afterPrepareGoogleMaps', self);
  }
});
