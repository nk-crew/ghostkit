import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			blocks: ['ghostkit/counter-box'],
			transform(attrs, innerBlocks) {
				return createBlock(
					'ghostkit/alert',
					{
						iconSize: attrs.numberSize,
						color: attrs.numberColor,
						hoverColor: attrs.hoverNumberColor,
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['ghostkit/icon-box'],
			transform(attrs, innerBlocks) {
				return createBlock(
					'ghostkit/alert',
					{
						iconSize: attrs.iconSize,
						color: attrs.iconColor,
						hoverColor: attrs.hoverIconColor,
					},
					innerBlocks
				);
			},
		},
	],
};
