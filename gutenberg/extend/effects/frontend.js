/**
 * Internal dependencies
 */
import DEFAULTS from './reveal/defaults';

const {
  GHOSTKIT: { events, instance },
  Motion: { animate, spring, inView },
} = window;

const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Effects Reveal.
 */
events.on(document, 'init.blocks.gkt', () => {
  document.querySelectorAll('[data-gkt-effects]').forEach(function ($element) {
    if (isReducedMotion) {
      $element.removeAttribute('data-gkt-effects');
      return;
    }

    const dataString = $element.getAttribute('data-gkt-effects');
    let data;

    try {
      data = JSON.parse(dataString);
    } catch (e) {
      data = false;
    }

    $element.removeAttribute('data-gkt-effects');

    if (!data) {
      return;
    }

    events.trigger($element, 'prepare.effects.gkt', { data });

    instance.set($element, 'effects', data);

    if (!data?.reveal) {
      return;
    }

    const config = {
      ...DEFAULTS,
      ...data.reveal,
    };

    events.trigger($element, 'prepare.effects.reveal.gkt', { config });

    const stopInView = inView($element, () => {
      $element.classList.remove('ghostkit-effects-reveal');

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

        // Fix for Scale and Rotate.
        // https://github.com/motiondivision/motionone/issues/221
        if (config.scale !== 1) {
          options.scale = {
            easing: spring({
              stiffness: config.transition.stiffness,
              damping: config.transition.damping,
              mass: config.transition.mass,
              restSpeed: 0.01,
              restDistance: 0.001,
            }),
          };
        }
        if (config.rotate !== 0) {
          options.rotate = {
            easing: spring({
              stiffness: config.transition.stiffness,
              damping: config.transition.damping,
              mass: config.transition.mass,
              restSpeed: 1,
              restDistance: 0.1,
            }),
          };
        }
      }

      const keyframes = {};

      if (config.opacity !== 1) {
        keyframes.opacity = [config.opacity, 1];
      }
      if (config.x !== 0) {
        keyframes.x = [config.x, 0];
      }
      if (config.y !== 0) {
        keyframes.y = [config.y, 0];
      }
      if (config.scale !== 1) {
        keyframes.scale = [config.scale, 1];
      }
      if (config.rotate !== 0) {
        keyframes.rotate = [config.rotate, 0];
      }

      const eventData = {
        config,
        keyframes,
        options,
        stopInView,
        leaveCallback: () => {},
      };

      events.trigger($element, 'show.effects.reveal.gkt', eventData);

      // Stop inView listener.
      eventData.stopInView();

      animate($element, keyframes, options).finished.then(() => {
        events.trigger($element, 'showed.effects.reveal.gkt', eventData);
      });

      // This will fire when the element leaves the viewport
      return eventData.leaveCallback;
    });

    events.trigger($element, 'prepared.effects.reveal.gkt', { config });
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

      if (isReducedMotion) {
        return;
      }

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
          $progressCountBadge = $progressCountBadgeWrap.querySelector(
            ':scope > div > span:nth-child(2)'
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
