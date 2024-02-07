import { createBlock } from '@wordpress/blocks';

import getUniqueSlug from '../../utils/get-unique-slug';

export default {
	from: [
		{
			type: 'block',
			blocks: ['ghostkit/accordion'],
			transform(attrs, innerBlocks) {
				const tabsData = [];
				let tabActive = '';

				innerBlocks.forEach((item) => {
					const slug = getUniqueSlug(
						`tab-${item.attributes.heading}`,
						item.clientId
					);

					if (!tabActive && item.attributes.active) {
						tabActive = slug;
					}

					tabsData.push({
						slug,
						title: item.attributes.heading,
					});
				});

				if (!tabActive) {
					tabActive = tabsData[0].slug;
				}

				return createBlock(
					'ghostkit/tabs-v2',
					{
						tabsData,
						tabActive,
					},
					tabsData.map((tab, i) =>
						createBlock(
							'ghostkit/tabs-tab-v2',
							{
								slug: tab.slug,
							},
							innerBlocks[i] ? innerBlocks[i].innerBlocks : ''
						)
					)
				);
			},
		},
	],
};
