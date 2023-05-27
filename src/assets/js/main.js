/**
 * External dependencies
 */
import { throttle } from 'throttle-debounce';
import rafSchd from 'raf-schd';

/**
 * Internal dependencies
 */
import parseSRConfig from '../../gutenberg/extend/scroll-reveal/parseSRConfig';

const {
  jQuery: $,
  Motion: { animate, inView },
  ghostkitVariables,
  GHOSTKIT,
} = window;

class GhostKitClass {
  constructor() {
    const self = this;

    self.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/g.test(
      window.navigator.userAgent || window.navigator.vendor || window.opera
    );

    // prepare media vars.
    self.screenSizes = [];
    Object.keys(ghostkitVariables.media_sizes).forEach((k) => {
      self.screenSizes.push(ghostkitVariables.media_sizes[k]);
    });

    self.customStyles = $('#ghostkit-blocks-custom-css-inline-css').html() || '';

    // Methods bind class.
    self.initBlocks = self.initBlocks.bind(self);
    self.prepareCounters = self.prepareCounters.bind(self);
    self.prepareFallbackCustomStyles = self.prepareFallbackCustomStyles.bind(self);
    self.prepareSR = self.prepareSR.bind(self);

    GHOSTKIT.triggerEvent('beforeInit', self);

    // Init blocks.
    const throttledInitBlocks = throttle(
      200,
      rafSchd(() => {
        self.initBlocks();
      })
    );
    if (window.MutationObserver) {
      new window.MutationObserver(throttledInitBlocks).observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    } else {
      $(document).on('DOMContentLoaded DOMNodeInserted load', () => {
        throttledInitBlocks();
      });
    }

    GHOSTKIT.triggerEvent('afterInit', self);
  }

  // Init blocks.
  initBlocks() {
    const self = this;

    GHOSTKIT.triggerEvent('beforeInitBlocks', self);

    GHOSTKIT.triggerEvent('initBlocks', self);

    self.prepareFallbackCustomStyles();
    self.prepareNumberedLists();
    self.prepareCounters();
    self.prepareSR();

    GHOSTKIT.triggerEvent('afterInitBlocks', self);
  }

  /**
   * Prepare Numbered Lists with `start` attribute.
   */
  prepareNumberedLists() {
    const self = this;

    GHOSTKIT.triggerEvent('beforePrepareNumberedLists', self);

    $('.is-style-styled:not(.is-style-styled-ready)').each(function () {
      const $this = $(this);
      const start = parseInt($this.attr('start'), 10);
      const isReversed = typeof $this.attr('reversed') !== 'undefined';
      const itemsCount = $this.children().length;

      $this.addClass('is-style-styled-ready');

      if (isReversed) {
        $this.css('counter-reset', `li ${(start || itemsCount) + 1}`);
      } else if (start) {
        $this.css('counter-reset', `li ${start - 1}`);
      }
    });

    GHOSTKIT.triggerEvent('afterPrepareNumberedLists', self);
  }

  /**
   * Prepare Counters (Number Box, Progress Bar)
   */
  prepareCounters() {
    const self = this;

    GHOSTKIT.triggerEvent('beforePrepareCounters', self);

    $('.ghostkit-count-up:not(.ghostkit-count-up-ready)').each(function () {
      const $this = $(this);
      const isProgress = $this.hasClass('ghostkit-progress-bar');
      const from = parseFloat($this.attr('data-count-from')) || 0;
      const to = parseFloat(isProgress ? $this.attr('aria-valuenow') : $this.text()) || 0;
      let $progressCountBadgeWrap;
      let $progressCountBadge;

      // prepare mask.
      let mask = '';
      if (!isProgress) {
        // eslint-disable-next-line no-template-curly-in-string
        mask = $this.text().replace(to, '${val}');
      }
      if (!/\${val}/.test(mask)) {
        // eslint-disable-next-line no-template-curly-in-string
        mask = '${val}';
      }

      $this.addClass('ghostkit-count-up-ready');

      if (isProgress) {
        $progressCountBadgeWrap = $this
          .closest('.ghostkit-progress')
          .find('.ghostkit-progress-bar-count');
        $progressCountBadge = $progressCountBadgeWrap.find('> div > span:eq(1)');

        $progressCountBadgeWrap.css('width', '0%');
        $progressCountBadge.text('0');
        $this.css('width', '0%');
      } else {
        // eslint-disable-next-line no-template-curly-in-string
        $this.text(mask.replace('${val}', from));
      }

      const item = {
        $el: $this,
        el: this,
        from,
        to,
        duration: 800,
        easing: [0.6, 0, 0.3, 1],
        cb(progress) {
          const position = (to - from) * progress + from;

          if (isProgress) {
            $progressCountBadge.text(Math.ceil(position));
          } else {
            // eslint-disable-next-line no-template-curly-in-string
            $this.text(mask.replace('${val}', Math.ceil(position)));
          }
        },
      };

      GHOSTKIT.triggerEvent('prepareCounters', self, item);

      // Animate counter.
      const stopInView = inView(
        this,
        () => {
          stopInView();

          if (isProgress) {
            [this, $progressCountBadgeWrap[0]].forEach((el) => {
              animate(
                el,
                {
                  width: `${to}%`,
                },
                {
                  duration: item.duration / 1000,
                  easing: item.easing,
                }
              );
            });
          }

          animate(
            (progress) => {
              item.cb(progress);
            },
            {
              duration: item.duration / 1000,
              easing: item.easing,
            }
          ).finished.then(() => {
            GHOSTKIT.triggerEvent('animatedCounters', self, item);
          });
        },
        { margin: '-50px' }
      );
    });

    GHOSTKIT.triggerEvent('afterPrepareCounters', self);
  }

  /**
   * Prepare custom styles.
   * This method used as Fallback only.
   * Since plugin version 2.6.0 we use PHP styles render.
   */
  prepareFallbackCustomStyles() {
    const self = this;
    let reloadStyles = false;

    GHOSTKIT.triggerEvent('beforePrepareCustomStyles', self);

    $('[data-ghostkit-styles]').each(function () {
      const $this = $(this);
      self.customStyles += GHOSTKIT.replaceVars($this.attr('data-ghostkit-styles'));
      $this.removeAttr('data-ghostkit-styles');
      reloadStyles = true;
    });

    if (reloadStyles) {
      let $style = $('#ghostkit-blocks-custom-css-inline-css');
      if (!$style.length) {
        $style = $('<style id="ghostkit-blocks-custom-css-inline-css">').appendTo('head');
      }
      $style.html(self.customStyles);
    }

    GHOSTKIT.triggerEvent('afterPrepareCustomStyles', self);
  }

  /**
   * Prepare ScrollReveal
   */
  prepareSR() {
    const self = this;

    GHOSTKIT.triggerEvent('beforePrepareSR', self);

    $('[data-ghostkit-sr]:not(.data-ghostkit-sr-ready)').each(function () {
      const $element = $(this);

      GHOSTKIT.triggerEvent('beforePrepareSRStart', self, $element);

      $element.addClass('data-ghostkit-sr-ready');

      const data = $element.attr('data-ghostkit-sr');
      const config = parseSRConfig(data);

      GHOSTKIT.triggerEvent('beforeInitSR', self, $element, config);

      const stopInView = inView(this, () => {
        stopInView();

        animate(this, config.keyframes, config.options).finished.then(() => {
          config.cleanup(this);
        });
      });

      GHOSTKIT.triggerEvent('beforePrepareSREnd', self, $element);
    });

    GHOSTKIT.triggerEvent('afterPrepareSR', self);
  }
}

GHOSTKIT.classObject = new GhostKitClass();
