import { __ } from '@wordpress/i18n';

export default {
	linear: {
		label: __('Linear', 'ghostkit'),
		easing: [0, 0, 1, 1],
		delay: 0,
		duration: 0.9,
	},
	'ease-in': {
		label: __('Ease In', 'ghostkit'),
		easing: [0.42, 0.0, 1.0, 1.0],
		delay: 0,
		duration: 0.9,
	},
	'ease-out': {
		label: __('Ease Out', 'ghostkit'),
		easing: [0.0, 0.0, 0.58, 1.0],
		delay: 0,
		duration: 0.9,
	},
	'ease-in-out': {
		label: __('Ease In Out', 'ghostkit'),
		easing: [0.42, 0.0, 0.58, 1.0],
		delay: 0,
		duration: 0.9,
	},
	'ease-in-back': {
		label: __('Ease In Back', 'ghostkit'),
		easing: [0.36, 0, 0.66, -0.56],
		delay: 0,
		duration: 0.9,
	},
	'ease-out-back': {
		label: __('Ease Out Back', 'ghostkit'),
		easing: [0.34, 1.56, 0.64, 1],
		delay: 0,
		duration: 0.9,
	},
	'ease-in-out-back': {
		label: __('Ease In Out Back', 'ghostkit'),
		easing: [0.68, -0.6, 0.32, 1.6],
		delay: 0,
		duration: 0.9,
	},
};
