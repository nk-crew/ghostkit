import { __ } from '@wordpress/i18n';

export default {
	'inset(0 round 20px)': __('Round', 'ghostkit'),
	'circle(50% at 50% 50%)': __('Circle', 'ghostkit'),
	'polygon(50% 0%, 0% 100%, 100% 100%)': __('Triangle', 'ghostkit'),
	'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)': __('Rhombus', 'ghostkit'),
	'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)': __(
		'Pentagon',
		'ghostkit'
	),
	'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)': __(
		'Hexagon',
		'ghostkit'
	),
	'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)':
		__('Heptagon', 'ghostkit'),
	'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)':
		__('Octagon', 'ghostkit'),
	'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)':
		__('Bevel', 'ghostkit'),
	'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)':
		__('Star', 'ghostkit'),
	'polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)':
		__('Frame', 'ghostkit'),
};
