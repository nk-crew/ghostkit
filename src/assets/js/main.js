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
  Motion: { animate, inView },
  GHOSTKIT,
} = window;

const { events } = GHOSTKIT;

class GhostKitClass {
  constructor() {
    const self = this;

    self.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/g.test(
      window.navigator.userAgent || window.navigator.vendor || window.opera
    );

    // Methods bind class.
    self.initBlocks = self.initBlocks.bind(self);
    self.initBlocksThrottled = throttle(
      200,
      rafSchd(() => {
        self.initBlocks();
      })
    );
    self.prepareCounters = self.prepareCounters.bind(self);
    self.prepareSR = self.prepareSR.bind(self);

    events.trigger(document, 'init.gkt');

    // Init blocks.
    new window.MutationObserver(self.initBlocksThrottled).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // Init blocks.
  initBlocks() {
    const self = this;

    events.trigger(document, 'init.blocks.gkt');

    self.prepareNumberedLists();
    self.prepareCounters();
    self.prepareSR();
  }

  /**
   * Prepare Numbered Lists with `start` attribute.
   */
  // eslint-disable-next-line class-methods-use-this
  prepareNumberedLists() {
    document.querySelectorAll('.is-style-styled:not(.is-style-styled-ready)').forEach(($list) => {
      const start = parseInt($list.getAttribute('start'), 10);
      const isReversed = $list.getAttribute('reversed') !== null;
      const itemsCount = $list.children.length;

      $list.classList.add('is-style-styled-ready');

      if (isReversed) {
        $list.style.counterReset = `li ${(start || itemsCount) + 1}`;
      } else if (start) {
        $list.style.counterReset = `li ${start - 1}`;
      }

      events.trigger($list, 'prepare.numberedList.gkt');
    });
  }

  /**
   * Prepare Counters (Number Box, Progress Bar)
   */
  // eslint-disable-next-line class-methods-use-this
  prepareCounters() {
    document
      .querySelectorAll('.ghostkit-count-up:not(.ghostkit-count-up-ready)')
      .forEach(($counter) => {
        $counter.classList.add('ghostkit-count-up-ready');

        const isProgress = $counter.classList.contains('ghostkit-progress-bar');
        const from = parseFloat($counter.getAttribute('data-count-from')) || 0;
        const to =
          parseFloat(isProgress ? $counter.getAttribute('aria-valuenow') : $counter.textContent) ||
          0;
        let $progressCountBadgeWrap;
        let $progressCountBadge;

        // prepare mask.
        let mask = '';
        if (!isProgress) {
          // eslint-disable-next-line no-template-curly-in-string
          mask = $counter.textContent.replace(to, '${val}');
        }
        if (!/\${val}/.test(mask)) {
          // eslint-disable-next-line no-template-curly-in-string
          mask = '${val}';
        }

        if (isProgress) {
          $progressCountBadgeWrap = $counter
            .closest('.ghostkit-progress')
            .querySelector('.ghostkit-progress-bar-count');

          if ($progressCountBadgeWrap) {
            $progressCountBadge = $progressCountBadgeWrap.querySelector(
              ':scope > div > span:eq(1)'
            );

            $progressCountBadgeWrap.style.width = '0%';
            $progressCountBadge.textContent = '0';
          }

          $counter.style.width = '0%';
        } else {
          // eslint-disable-next-line no-template-curly-in-string
          $counter.textContent = mask.replace('${val}', from);
        }

        const config = {
          from,
          to,
          duration: 800,
          easing: [0.6, 0, 0.3, 1],
          cb(progress) {
            const position = (to - from) * progress + from;

            if (isProgress) {
              if ($progressCountBadge) {
                $progressCountBadge.textContent = Math.ceil(position);
              }
            } else {
              // eslint-disable-next-line no-template-curly-in-string
              $counter.textContent = mask.replace('${val}', Math.ceil(position));
            }
          },
        };

        events.trigger($counter, 'prepare.counter.gkt', { config });

        // Animate counter.
        const stopInView = inView(
          $counter,
          () => {
            stopInView();

            events.trigger($counter, 'count.counter.gkt', { config });

            if (isProgress) {
              [$counter, $progressCountBadgeWrap].forEach((el) => {
                if (el) {
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
                }
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
              events.trigger($counter, 'counted.counter.gkt', { config });
            });
          },
          { margin: '-50px' }
        );
      });
  }

  /**
   * Prepare ScrollReveal
   */
  // eslint-disable-next-line class-methods-use-this
  prepareSR() {
    document
      .querySelectorAll('[data-ghostkit-sr]:not(.data-ghostkit-sr-ready)')
      .forEach(function ($element) {
        $element.classList.add('data-ghostkit-sr-ready');

        const data = $element.getAttribute('data-ghostkit-sr');
        const config = parseSRConfig(data);

        events.trigger($element, 'prepare.scrollReveal.gkt', { config });

        const stopInView = inView($element, () => {
          stopInView();

          events.trigger($element, 'show.scrollReveal.gkt', { config });

          animate($element, config.keyframes, config.options).finished.then(() => {
            config.cleanup($element);
            events.trigger($element, 'showed.scrollReveal.gkt', { config });
          });
        });

        events.trigger($element, 'prepared.scrollReveal.gkt', { config });
      });
  }
}

GHOSTKIT.class = new GhostKitClass();

// Fallback.
GHOSTKIT.classObject = GHOSTKIT.class;
