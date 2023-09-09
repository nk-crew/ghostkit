/**
 * Internal dependencies
 */
import parseAnimationData from './parseAnimationData';
import DEFAULTS from './reveal/defaults';

const {
  GHOSTKIT: { events },
  Motion: { animate, spring, inView },
} = window;

/**
 * Animation Reveal.
 */
events.on(document, 'init.blocks.gkt', () => {
  document.querySelectorAll('[data-ghostkit-animation-reveal]').forEach(function ($element) {
    const data = $element.getAttribute('data-ghostkit-animation-reveal');

    // Hide block first and then remove attribute to prevent block visibility blinking.
    $element.style.pointerEvents = 'none';
    $element.style.visibility = 'hidden';
    $element.removeAttribute('data-ghostkit-animation-reveal');

    const config = parseAnimationData(data, DEFAULTS);

    events.trigger($element, 'prepare.animation.reveal.gkt', { config });

    const stopInView = inView($element, () => {
      stopInView();

      $element.style.pointerEvents = '';

      events.trigger($element, 'show.animation.reveal.gkt', { config });

      const options = {};

      // Easing with Cubic Bezier.
      if (config?.transition?.type === 'easing') {
        options.duration = config.transition.duration;
        options.delay = config.transition.delay;
        options.easing = config.transition.easing;

        // Easing with Spring.
      } else if (config?.transition?.type === 'spring') {
        options.delay = config.transition.delay;
        options.easing = spring({
          stiffness: config.transition.stiffness,
          damping: config.transition.damping,
          mass: config.transition.mass,
        });
      }

      animate(
        $element,
        {
          visibility: 'visible',
          opacity: [config.opacity, 1],
          x: [config.x, 0],
          y: [config.y, 0],
          scale: [config.scale, 1],
          rotate: [config.rotate, 0],
        },
        options
      ).finished.then(() => {
        events.trigger($element, 'showed.animation.reveal.gkt', { config });
      });
    });

    events.trigger($element, 'prepared.animation.reveal.gkt', { config });
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
        duration: 0.8,
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
                    duration: config.duration,
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
              duration: config.duration,
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
