/**
 * Animations
 */
/**
 * Internal dependencies
 */
import parseSRConfig from '../scroll-reveal/parseSRConfig';

const {
  GHOSTKIT: { events },
  Motion: { animate, inView },
} = window;

/**
 * Scroll Reveal.
 */
events.on(document, 'init.blocks.gkt', () => {
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
});

/**
 * Counters (Number Box, Progress Bar).
 */
events.on(document, 'init.blocks.gkt', () => {
  document
    .querySelectorAll('.ghostkit-count-up:not(.ghostkit-count-up-ready)')
    .forEach(($counter) => {
      $counter.classList.add('ghostkit-count-up-ready');

      const isProgress = $counter.classList.contains('ghostkit-progress-bar');
      const from = parseFloat($counter.getAttribute('data-count-from')) || 0;
      const to =
        parseFloat(isProgress ? $counter.getAttribute('aria-valuenow') : $counter.textContent) || 0;
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
          $progressCountBadge = $progressCountBadgeWrap.querySelector(':scope > div > span:eq(1)');

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
});
