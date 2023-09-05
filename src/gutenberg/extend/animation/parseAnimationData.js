// Parse animation data from string.
// x:10px;scale:2:opacity:0.4
export default function parseAnimationData(data, defaults = {}) {
  const config = {
    ...defaults,
  };

  data = data.split(';') || [];

  // Prepare all data configs.
  if (data.length) {
    data.forEach((item) => {
      const itemData = item.split(':');
      if (itemData.length === 2) {
        // eslint-disable-next-line prefer-destructuring
        config[itemData[0]] = itemData[1];
      }
    });
  }

  if (config.scale) {
    config.scale = parseFloat(config.scale);
  }
  if (config.opacity) {
    config.opacity = parseFloat(config.opacity);
  }

  return config;
}
