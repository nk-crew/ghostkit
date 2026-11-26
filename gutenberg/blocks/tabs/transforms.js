import { createBlock, getBlockType, hasBlockSupport } from '@wordpress/blocks';
import { select } from '@wordpress/data';

import getUniqueSlug from '../../utils/get-unique-slug';

const nativeTabsBlocks = [
	'core/tabs',
	'core/tab-list',
	'core/tab-panels',
	'core/tab-panel',
	'core/group',
];

export function hasNativeTabs() {
	return (
		!!getBlockType('core/tabs') &&
		!window.GHOSTKIT?.disabledBlocks?.['core/tabs']
	);
}

function isEditingSharedContent() {
	const editor = select('core/editor');
	const postType = editor?.getCurrentPostType();

	return (
		postType === 'wp_template_part' ||
		(postType === 'wp_block' &&
			editor.getEditedPostAttribute('meta')?.wp_pattern_sync_status !==
				'unsynced' &&
			editor.getEditedPostAttribute('wp_pattern_sync_status') !==
				'unsynced')
	);
}

function hasOnlyAttributes(attributes, supported) {
	return Object.keys(attributes).every(
		(key) => attributes[key] === undefined || supported.includes(key)
	);
}

function hasUniqueTabAnchors(block, editor) {
	const slugs = block.attributes.tabsData.map(({ slug }) => slug);
	const ids = slugs.flatMap((slug) => [slug, `tab__${slug}`]);
	const aliases = new Map(
		block.innerBlocks.map(({ clientId, attributes }) => [
			clientId,
			attributes.anchor,
		])
	);

	for (const anchor of aliases.values()) {
		if (anchor) {
			ids.push(anchor);
		}
	}

	const anchors = new Set(ids);

	return (
		anchors.size === ids.length &&
		!editor.getClientIdsWithDescendants().some((clientId) => {
			const attributes = editor.getBlockAttributes(clientId);
			if (!attributes) {
				return false;
			}
			const { anchor, tabsData } = attributes;
			if (
				anchor &&
				aliases.get(clientId) !== anchor &&
				anchors.has(anchor)
			) {
				return true;
			}
			return (
				clientId !== block.clientId &&
				editor.getBlockName(clientId) === 'ghostkit/tabs-v2' &&
				tabsData.some(
					(tab) =>
						typeof tab?.slug === 'string' &&
						(anchors.has(tab.slug) ||
							anchors.has(`${tab.slug}-button`))
				)
			);
		})
	);
}

export default {
	to: [
		{
			type: 'block',
			blocks: ['core/tabs'],
			isMatch(attributes, block) {
				const {
					tabActive,
					tabsData,
					trigger,
					buttonsVerticalAlign,
					buttonsAlign,
				} = attributes;
				const editor = select('core/block-editor');

				return (
					window.ghostkitVariables?.supportsNativeTabsHashLinks ===
						'1' &&
					nativeTabsBlocks.every(
						(name) =>
							getBlockType(name) &&
							!window.GHOSTKIT?.disabledBlocks?.[name]
					) &&
					hasBlockSupport('core/tab-panel', 'anchor') &&
					hasBlockSupport('core/group', 'anchor') &&
					editor &&
					!editor.getBlockParentsByBlockName(block.clientId, [
						'ghostkit/carousel',
						'core/block',
						'core/template-part',
					]).length &&
					!isEditingSharedContent() &&
					block.isValid &&
					!trigger &&
					!buttonsVerticalAlign &&
					buttonsAlign === 'start' &&
					hasOnlyAttributes(attributes, [
						'tabActive',
						'tabsData',
						'trigger',
						'buttonsVerticalAlign',
						'buttonsAlign',
					]) &&
					tabsData.length === block.innerBlocks.length &&
					tabsData.every((tab, index) => {
						const panel = block.innerBlocks[index];
						return (
							tab &&
							typeof tab.title === 'string' &&
							typeof tab.slug === 'string' &&
							/^[a-zA-Z0-9_-]+$/.test(tab.slug) &&
							!tab.slug.includes('tab__') &&
							panel.name === 'ghostkit/tabs-tab-v2' &&
							panel.isValid &&
							panel.attributes.slug === tab.slug &&
							(!panel.attributes.anchor ||
								panel.attributes.anchor ===
									`${tab.slug}-content`) &&
							hasOnlyAttributes(panel.attributes, [
								'slug',
								'anchor',
								'active',
							])
						);
					}) &&
					tabsData.some(({ slug }) => slug === tabActive) &&
					hasUniqueTabAnchors(block, editor)
				);
			},
			transform({ tabActive, tabsData }, panels) {
				return createBlock(
					'core/tabs',
					{
						activeTabIndex: tabsData.findIndex(
							({ slug }) => slug === tabActive
						),
					},
					[
						createBlock('core/tab-list', {
							tabs: tabsData.map(({ title }) => ({
								label: title,
							})),
						}),
						createBlock(
							'core/tab-panels',
							{},
							panels.map(({ attributes, innerBlocks }, index) =>
								createBlock(
									'core/tab-panel',
									{
										label: tabsData[index].title,
										anchor: attributes.slug,
									},
									attributes.anchor
										? [
												createBlock(
													'core/group',
													{
														anchor: attributes.anchor,
													},
													innerBlocks
												),
											]
										: innerBlocks
								)
							)
						),
					]
				);
			},
		},
	],
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
