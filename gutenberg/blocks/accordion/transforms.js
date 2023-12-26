import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

export default {
	from: [
		{
			type: 'block',
			blocks: ['ghostkit/tabs-v2'],
			transform(attrs, innerBlocks) {
				const { tabsData, tabActive } = attrs;

				return createBlock(
					'ghostkit/accordion',
					{
						itemsCount: innerBlocks.length,
					},
					innerBlocks.map((tab, i) =>
						createBlock(
							'ghostkit/accordion-item',
							{
								heading: tabsData[i]
									? tabsData[i].title
									: __('Accordion Item', 'ghostkit'),
								active: tabsData[i]
									? tabsData[i].slug === tabActive
									: false,
							},
							tab.innerBlocks
						)
					)
				);
			},
		},
	],
};
