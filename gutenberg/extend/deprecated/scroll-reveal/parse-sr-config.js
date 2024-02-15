// parse data from Scroll Reveal string.
// fade-right;duration:500;delay:1000
export default function parseSRConfig(data) {
	data = data.split(';');

	let effect = data[0];
	let distance = 50;
	let scale = 1;
	let origin = effect.split('-');

	if (origin.length === 2) {
		effect = origin[0];
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
		x: 0,
		y: 0,
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
				config[itemData[0]] = itemData[1];
			}
		});
	}

	if (config.distance && origin) {
		switch (origin) {
			case 'bottom':
				config.y = parseFloat(config.distance);
				break;
			case 'top':
				config.y = -parseFloat(config.distance);
				break;
			case 'right':
				config.x = parseFloat(config.distance);
				break;
			case 'left':
				config.x = -parseFloat(config.distance);
				break;
			// no default
		}
	}

	delete config.distance;

	config.scale = parseFloat(config.scale);
	config.duration = parseFloat(config.duration) / 1000;
	config.delay = parseFloat(config.delay) / 1000;

	return config;
}
