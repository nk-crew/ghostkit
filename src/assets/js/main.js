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
  GHOSTKIT,
} = window;

const { events, replaceVars } = GHOSTKIT;

class GhostKitClass {
  constructor() {
    const self = this;

    self.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/g.test(
      window.navigator.userAgent || window.navigator.vendor || window.opera
    );

    self.customStyles = $('#ghostkit-blocks-custom-css-inline-css').html() || '';

    // Methods bind class.
    self.initBlocks = self.initBlocks.bind(self);
    self.initBlocksThrottled = throttle(
      200,
      rafSchd(() => {
        self.initBlocks();
      })
    );
    self.prepareCounters = self.prepareCounters.bind(self);
    self.prepareFallbackCustomStyles = self.prepareFallbackCustomStyles.bind(self);
    self.prepareSR = self.prepareSR.bind(self);

    events.trigger(document, 'init.gkt');

    // Init blocks.
    new window.MutationObserver(self.initBlocksThrottled).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    events.trigger(document, 'afterInit.gkt');
  }

  // Init blocks.
  initBlocks() {
    const self = this;

    events.trigger(document, 'beforeInit.blocks.gkt');

    events.trigger(document, 'init.blocks.gkt');

    self.prepareFallbackCustomStyles();
    self.prepareNumberedLists();
    self.prepareCounters();
    self.prepareSR();

    events.trigger(document, 'afterInit.blocks.gkt');
  }

  /**
   * Prepare Numbered Lists with `start` attribute.
   */
  // eslint-disable-next-line class-methods-use-this
  prepareNumberedLists() {
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

      events.trigger(this, 'prepare.numberedList.gkt');
    });
  }

  /**
   * Prepare Counters (Number Box, Progress Bar)
   */
  // eslint-disable-next-line class-methods-use-this
  prepareCounters() {
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

      const config = {
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

      events.trigger(this, 'prepare.counter.gkt', { config });

      // Animate counter.
      const stopInView = inView(
        this,
        () => {
          stopInView();

          events.trigger(config.el, 'animate.counter.gkt', { config });

          if (isProgress) {
            [this, $progressCountBadgeWrap[0]].forEach((el) => {
              animate(
                el,
                {
                  width: `${to}%`,
                },
                {
                  duration: config.duration / 1000,
                  easing: config.easing,
                }
              );
            });
          }

          animate(
            (progress) => {
              config.cb(progress);
            },
            {
              duration: config.duration / 1000,
              easing: config.easing,
            }
          ).finished.then(() => {
            events.trigger(config.el, 'animated.counter.gkt', { config });
          });
        },
        { margin: '-50px' }
      );
    });
  }

  /**
   * Prepare custom styles.
   * This method used as Fallback only.
   * Since plugin version 2.6.0 we use PHP styles render.
   */
  prepareFallbackCustomStyles() {
    const self = this;
    let reloadStyles = false;

    $('[data-ghostkit-styles]').each(function () {
      const $this = $(this);
      self.customStyles += replaceVars($this.attr('data-ghostkit-styles'));
      $this.removeAttr('data-ghostkit-styles');
      reloadStyles = true;
    });

    if (reloadStyles) {
      let $style = $('#ghostkit-blocks-custom-css-inline-css');
      if (!$style.length) {
        $style = $('<style id="ghostkit-blocks-custom-css-inline-css">').appendTo('head');
      }
      $style.html(self.customStyles);

      events.trigger($style[0], 'prepare.customStyles.gkt');
    }
  }

  /**
   * Prepare ScrollReveal
   */
  // eslint-disable-next-line class-methods-use-this
  prepareSR() {
    $('[data-ghostkit-sr]:not(.data-ghostkit-sr-ready)').each(function () {
      const $element = $(this);

      $element.addClass('data-ghostkit-sr-ready');

      const data = $element.attr('data-ghostkit-sr');
      const config = parseSRConfig(data);

      events.trigger(this, 'prepare.scrollReveal.gkt', { config });

      const stopInView = inView(this, () => {
        stopInView();

        animate(this, config.keyframes, config.options).finished.then(() => {
          config.cleanup(this);
        });
      });

      events.trigger(this, 'prepared.scrollReveal.gkt', { config });
    });
  }
}

GHOSTKIT.class = new GhostKitClass();

// Fallback.
GHOSTKIT.classObject = GHOSTKIT.class;
