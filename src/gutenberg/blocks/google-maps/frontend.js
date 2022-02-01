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

    $('.ghostkit-google-maps:not(.ghostkit-google-maps-ready)').each(function () {
      const $this = $(this);
      $this.addClass('ghostkit-google-maps-ready');

      scriptjs(`${GHOSTKIT.googleMapsAPIUrl}&key=${GHOSTKIT.googleMapsAPIKey}`, () => {
        scriptjs(GHOSTKIT.googleMapsLibrary.url, () => {
          GHOSTKIT.triggerEvent('beforePrepareGoogleMapsStart', self, $this);

          let styles = '';
          let markers = '';

          try {
            styles = JSON.parse($this.attr('data-styles'));
            // eslint-disable-next-line no-empty
          } catch (evt) {}

          const $markers = $this.find('.ghostkit-google-maps-marker');
          if ($markers.length) {
            markers = [];

            $markers.each(function () {
              markers.push($(this).data());
            });

            // old way.
          } else if ($this.attr('data-markers')) {
            try {
              markers = JSON.parse($this.attr('data-markers'));
              // eslint-disable-next-line no-empty
            } catch (evt) {}
          }

          const opts = {
            div: $this[0],
            lat: parseFloat($this.attr('data-lat')),
            lng: parseFloat($this.attr('data-lng')),
            zoom: parseInt($this.attr('data-zoom'), 10),
            zoomControl: $this.attr('data-show-zoom-buttons') === 'true',
            zoomControlOpt: {
              style: 'DEFAULT',
              position: 'RIGHT_BOTTOM',
            },
            mapTypeControl: $this.attr('data-show-map-type-buttons') === 'true',
            streetViewControl: $this.attr('data-show-street-view-button') === 'true',
            fullscreenControl: $this.attr('data-show-fullscreen-button') === 'true',
            scrollwheel: $this.attr('data-option-scroll-wheel') === 'true',
            draggable: $this.attr('data-option-draggable') === 'true',
            styles,
          };

          const mapObject = new window.GMaps(opts);

          // add gestureHandling
          const gestureHandling = $this.attr('data-gesture-handling');
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
