// Parse animation data from string.
// x:10px;scale:2:opacity:0.4;duration:900
export default function parseAnimationData(data, defaults = {}) {
  const config = {
    ...defaults,
  };

  data = data.split(';') || [];

  let cleanTransition = true;

  // Prepare all data configs.
  if (data.length) {
    data.forEach((item) => {
      const itemData = item.split(':');

      if (itemData.length === 2) {
        let [name, val] = itemData;

        // Prepare Transition value.
        if (name.startsWith('transition-')) {
          // Clean default transition config, since block has custom one.
          if (cleanTransition) {
            cleanTransition = false;
            config.transition = {};
          }

          name = name.replace('transition-', '');

          if (['duration', 'delay', 'damping', 'mass', 'stiffness'].includes(name)) {
            val = parseFloat(val);
          }

          if (name === 'ease') {
            val = val.replace(/[[\]]/g, '');
            val = val.split(',');
            val = val.map((v) => parseFloat(v));
          }

          config.transition[name] = val;

          // Standard value
        } else {
          if (['scale', 'opacity'].includes(name)) {
            val = parseFloat(val);
          }

          config[name] = val;
        }
      }
    });
  }

  return config;
}
