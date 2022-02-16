/**
 * External dependencies
 */
import { debounce } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import { getSlug } from '../../utils/get-unique-slug';

/**
 * WordPress dependencies
 */
const { subscribe, select } = wp.data;

/**
 * Get available TOC block.
 *
 * @param {Array} blocks blocks array.
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
      if ('ghostkit/table-of-contents' === block.name) {
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
    if ('core/heading' === block.name) {
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
      if ('undefined' !== typeof collisionCollector[anchor]) {
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
  // eslint-disable-next-line no-underscore-dangle
  !wp.blockEditor.__experimentalBlockPatternSetup &&
  !wp.blockEditor.BlockPatternSetup &&
  !wp.blockEditor.blockPatternSetup
) {
  subscribe(() => {
    updateHeadingIDsDebounce();
  });
}
