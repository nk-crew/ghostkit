import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';

export default {
	fade: {
		label: __('Fade In', 'ghostkit'),
		icon: getIcon('sr-fade'),
		data: {
			opacity: 0,
		},
	},
	zoom: {
		label: __('Zoom In', 'ghostkit'),
		icon: getIcon('sr-zoom'),
		data: {
			scale: 0.9,
		},
	},
	'zoom-up': {
		label: __('Zoom In From Bottom', 'ghostkit'),
		icon: getIcon('sr-zoom-from-bottom'),
		data: {
			y: 50,
			scale: 0.9,
		},
	},
	'zoom-left': {
		label: __('Zoom In From Left', 'ghostkit'),
		icon: getIcon('sr-zoom-from-left'),
		data: {
			x: -50,
			scale: 0.9,
		},
	},
	'zoom-right': {
		label: __('Zoom In From Right', 'ghostkit'),
		icon: getIcon('sr-zoom-from-right'),
		data: {
			x: 50,
			scale: 0.9,
		},
	},
};
