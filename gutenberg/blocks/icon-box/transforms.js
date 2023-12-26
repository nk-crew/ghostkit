import { createBlock } from '@wordpress/blocks';

export default {
	from: [
		{
			type: 'block',
			blocks: ['ghostkit/counter-box'],
			transform(attrs, innerBlocks) {
				return createBlock(
					'ghostkit/icon-box',
					{
						iconPosition: attrs.numberPosition,
						iconSize: attrs.numberSize,
						showContent: attrs.showContent,
						iconColor: attrs.numberColor,
						hoverIconColor: attrs.hoverNumberColor,
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
					'ghostkit/icon-box',
					{
						icon: attrs.icon,
						iconSize: attrs.iconSize,
						iconColor: attrs.color,
						hoverIconColor: attrs.hoverColor,
					},
					innerBlocks
				);
			},
		},
	],
};
