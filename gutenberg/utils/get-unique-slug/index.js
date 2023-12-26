import slugify from 'slugify';
import striptags from 'striptags';

import { select } from '@wordpress/data';
const { getBlocks } = select('core/block-editor');

/**
 * Get all block IDs.
 *
 * @param {Array} excludeId exclude block client id.
 * @param {Array} blocks    blocks list to check.
 *
 * @return {Array} block anchors and slugs array.
 */
function getAllSlugs(excludeId, blocks = 'none') {
	let slugs = [];

	if (blocks === 'none') {
		blocks = getBlocks();
	}

	blocks.forEach((block) => {
		if (block.clientId !== excludeId && block.attributes) {
			if (block.attributes.anchor) {
				slugs.push(block.attributes.anchor);
			}
			if (
				(block.name === 'ghostkit/tabs-tab-v2' ||
					block.name === 'ghostkit/accordion-item') &&
				block.attributes.slug
			) {
				slugs.push(block.attributes.slug);
			}
		}

		if (block.innerBlocks && block.innerBlocks.length) {
			slugs = [...slugs, ...getAllSlugs(excludeId, block.innerBlocks)];
		}
	});

	return slugs;
}

/**
 * Check if slug is unique.
 *
 * @param {string} slug  new slug.
 * @param {Array}  slugs slugs list to check.
 *
 * @return {boolean} is unique.
 */
function isUniqueSlug(slug, slugs) {
	let isUnique = true;

	slugs.forEach((thisSlug) => {
		if (thisSlug === slug) {
			isUnique = false;
		}
	});

	return isUnique;
}

/**
 * Get slug from title.
 *
 * @param {string} title title string.
 *
 * @return {string} slug.
 */
export function getSlug(title) {
	return slugify(striptags(title), {
		replacement: '-',
		remove: /[*_+~()'"!?/\-—–−:@^|&#.,;%<>{}]/g,
		lower: true,
	});
}

/**
 * Get unique slug from title.
 *
 * @param {string} title          title string.
 * @param {string} excludeBlockId exclude block id to not check.
 *
 * @return {string} slug.
 */
export default function getUniqueSlug(title, excludeBlockId) {
	let newSlug = '';
	let i = 0;
	const allSlugs = getAllSlugs(excludeBlockId);

	while (!newSlug || !isUniqueSlug(newSlug, allSlugs)) {
		if (newSlug) {
			i += 1;
		}
		newSlug = `${getSlug(title)}${i ? `-${i}` : ''}`;
	}

	return newSlug;
}
