import { __ } from '@wordpress/i18n';

export default {
	default: {
		label: __('Default', 'ghostkit'),
		stiffness: 300,
		damping: 35,
		mass: 2,
		delay: 0,
	},
	gentle: {
		label: __('Gentle', 'ghostkit'),
		stiffness: 100,
		damping: 14,
		mass: 1,
		delay: 0,
	},
	wobbly: {
		label: __('Wobbly', 'ghostkit'),
		stiffness: 200,
		damping: 10,
		mass: 1,
		delay: 0,
	},
	slow: {
		label: __('Slow', 'ghostkit'),
		stiffness: 8,
		damping: 4,
		mass: 1,
		delay: 0,
	},
	molasses: {
		label: __('Molasses', 'ghostkit'),
		stiffness: 10,
		damping: 20,
		mass: 4,
		delay: 0,
	},
};
