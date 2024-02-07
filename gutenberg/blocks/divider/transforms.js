import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			blocks: ['core/separator'],
			transform() {
				return createBlock('ghostkit/divider');
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: ['core/separator'],
			transform() {
				return createBlock('core/separator');
			},
		},
	],
};
