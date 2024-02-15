import { debounce } from 'throttle-debounce';

import { select, subscribe } from '@wordpress/data';

import { getSlug } from '../../utils/get-unique-slug';

/**
 * Get available TOC block.
 *
 * @param {Array | boolean} blocks blocks array.
 *
 * @return {Array} toc block data.
 */
function getTOC(blocks = false) {
	let result = false;

	if (!blocks) {
		const { getBlocks } = select('core/block-editor');

		blocks = getBlocks();
	}

	blocks.forEach((block) => {
		if (!result) {
			if (block.name === 'ghostkit/table-of-contents') {
				result = block;
			} else if (block.innerBlocks && block.innerBlocks.length) {
				result = getTOC(block.innerBlocks);
			}
		}
	});

	return result;
}

/**
 * Get available heading blocks.
 *
 * @param {Array} blocks blocks array.
 *
 * @return {Array} toc block data.
 */
function getHeadings(blocks = false) {
	let result = [];

	if (!blocks) {
		const { getBlocks } = select('core/block-editor');

		blocks = getBlocks();
	}

	blocks.forEach((block) => {
		if (block.name === 'core/heading') {
			result.push(block);
		} else if (block.innerBlocks && block.innerBlocks.length) {
			result = [...result, ...getHeadings(block.innerBlocks)];
		}
	});

	return result;
}

let prevHeadings = '';

/**
 * Update heading ID.
 */
function updateHeadingIDs() {
	const tocBlock = getTOC();

	if (!tocBlock) {
		return;
	}

	const headings = getHeadings();

	if (prevHeadings && prevHeadings === JSON.stringify(headings)) {
		return;
	}

	const collisionCollector = {};

	headings.forEach((block) => {
		let { anchor } = block.attributes;

		const { content } = block.attributes;

		// create new
		if (content && !anchor) {
			anchor = getSlug(content);
			block.attributes.anchor = anchor;
		}

		// check collisions.
		if (anchor) {
			if (typeof collisionCollector[anchor] !== 'undefined') {
				collisionCollector[anchor] += 1;
				anchor += `-${collisionCollector[anchor]}`;
				block.attributes.anchor = anchor;
			} else {
				collisionCollector[anchor] = 1;
			}
		}
	});

	prevHeadings = JSON.stringify(headings);
}

const updateHeadingIDsDebounce = debounce(300, updateHeadingIDs);

/**
 * Subscribe to all editor changes.
 * We don't need to run this code in WordPress >= 5.9, as anchors already adds automatically.
 */
if (
	!wp.blockEditor.__experimentalBlockPatternSetup &&
	!wp.blockEditor.BlockPatternSetup &&
	!wp.blockEditor.blockPatternSetup
) {
	subscribe(() => {
		updateHeadingIDsDebounce();
	});
}
