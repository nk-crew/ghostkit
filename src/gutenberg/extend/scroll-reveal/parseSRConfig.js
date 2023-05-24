// parse data from Scroll Reveal string.
// fade-right;duration:500;delay:1000
export default function parseSRConfig(data) {
  data = data.split(';');

  let effect = data[0];
  let distance = '50px';
  let scale = 1;
  let origin = effect.split('-');

  if (origin.length === 2) {
    // eslint-disable-next-line prefer-destructuring
    effect = origin[0];
    // eslint-disable-next-line prefer-destructuring
    origin = origin[1];

    switch (origin) {
      case 'up':
        origin = 'bottom';
        break;
      case 'down':
        origin = 'top';
        break;
      case 'right':
        origin = 'right';
        break;
      case 'left':
        origin = 'left';
        break;
      // no default
    }
  } else {
    origin = 'center';
    distance = 0;
  }

  if (effect === 'zoom') {
    scale = 0.9;
  }

  const config = {
    distance,
    x: '0px',
    y: '0px',
    opacity: 0,
    scale,
    duration: 900,
    delay: 0,
    easing: [0.5, 0, 0, 1],
  };

  // replace other data config.
  if (data.length > 1) {
    data.forEach((item) => {
      const itemData = item.split(':');
      if (itemData.length === 2) {
        // eslint-disable-next-line prefer-destructuring
        config[itemData[0]] = itemData[1];
      }
    });
  }

  if (config.distance && origin) {
    switch (origin) {
      case 'bottom':
        config.y = config.distance;
        break;
      case 'top':
        config.y = `-${config.distance}`;
        break;
      case 'right':
        config.x = config.distance;
        break;
      case 'left':
        config.x = `-${config.distance}`;
        break;
      // no default
    }
  }

  config.scale = parseFloat(config.scale);
  config.duration = parseFloat(config.duration) / 1000;
  config.delay = parseFloat(config.delay) / 1000;

  return {
    keyframes: {
      visibility: 'visible',
      opacity: [config.opacity, 1],
      transform: [
        `translateY(${config.y}) translateX(${config.x}) scale(${config.scale})`,
        `translateY(0px) translateX(0px) scale(1)`,
      ],
    },
    options: {
      duration: config.duration,
      delay: config.delay,
      easing: config.easing,
    },
    cleanup(el) {
      el.removeAttribute('data-ghostkit-sr');
      el.classList.remove('data-ghostkit-sr-ready');

      el.style.visibility = '';
      el.style.opacity = '';
      el.style.transform = '';

      if (!el.getAttribute('style')) {
        el.removeAttribute('style');
      }
      if (!el.getAttribute('class')) {
        el.removeAttribute('class');
      }
    },
  };
}
