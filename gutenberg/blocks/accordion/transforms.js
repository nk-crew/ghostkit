import { createBlock, getBlockType, hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

const nativeAccordionBlocks = [
	'core/accordion',
	'core/accordion-item',
	'core/accordion-heading',
	'core/accordion-panel',
];

export function hasNativeAccordion() {
	return nativeAccordionBlocks.every(getBlockType);
}

function hasOnlyAttributes(attributes, supported) {
	return Object.keys(attributes).every(
		(key) => attributes[key] === undefined || supported.includes(key)
	);
}

export default {
	to: [
		{
			type: 'block',
			blocks: ['core/accordion'],
			isMatch(attributes, block) {
				const { collapseTitleTag } = attributes;

				return (
					hasNativeAccordion() &&
					hasBlockSupport('core/group', 'anchor') &&
					/^h[1-6]$/.test(collapseTitleTag) &&
					hasOnlyAttributes(attributes, [
						'itemsCount',
						'collapseOne',
						'collapseTitleTag',
						'anchor',
						'align',
					]) &&
					block.isValid &&
					block.innerBlocks.length > 0 &&
					block.innerBlocks.every(
						({ name, isValid, attributes: item }) =>
							name === 'ghostkit/accordion-item' &&
							isValid &&
							item.titleTag === collapseTitleTag &&
							hasOnlyAttributes(item, [
								'heading',
								'titleTag',
								'slug',
								'active',
							])
					)
				);
			},
			transform({ collapseOne, collapseTitleTag, anchor, align }, items) {
				const level = Number(collapseTitleTag.slice(1));

				return createBlock(
					'core/accordion',
					{
						autoclose: collapseOne,
						headingLevel: level,
						anchor,
						align,
					},
					items.map(({ attributes, innerBlocks }) => {
						const { active, heading, slug } = attributes;

						return createBlock(
							'core/accordion-item',
							{ openByDefault: active },
							[
								createBlock('core/accordion-heading', {
									title: heading,
									level,
									openByDefault: active,
								}),
								createBlock(
									'core/accordion-panel',
									{},
									slug
										? [
												createBlock(
													'core/group',
													{ anchor: slug },
													innerBlocks
												),
											]
										: innerBlocks
								),
							]
						);
					})
				);
			},
		},
	],
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
