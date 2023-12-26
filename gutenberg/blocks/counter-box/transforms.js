import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			blocks: ['ghostkit/icon-box'],
			transform(attrs, innerBlocks) {
				return createBlock(
					'ghostkit/counter-box',
					{
						numberPosition: attrs.iconPosition,
						numberSize: attrs.iconSize,
						showContent: attrs.showContent,
						numberColor: attrs.iconColor,
						hoverNumberColor: attrs.hoverIconColoe,
					},
					innerBlocks
				);
			},
		},
		{
			type: 'block',
			blocks: ['ghostkit/alert'],
			transform(attrs, innerBlocks) {
				return createBlock(
					'ghostkit/counter-box',
					{
						numberSize: attrs.iconSize,
						numberColor: attrs.color,
						hoverNumberColor: attrs.hoverColor,
					},
					innerBlocks
				);
			},
		},
	],
};
