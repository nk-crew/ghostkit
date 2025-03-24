/**
 * Get all available headings.
 *
 * @param {Array} blocks         blocks array.
 * @param {Array} allowedHeaders allowed headers list.
 * @return {Array} headings array.
 */
export default function getAllHeadings(blocks, allowedHeaders) {
	let headings = [];

	if (allowedHeaders && allowedHeaders.length) {
		blocks.forEach((block) => {
			if (
				block.name === 'core/heading' &&
				allowedHeaders.indexOf(block.attributes.level) > -1 &&
				block?.attributes?.anchor
			) {
				const content = block.attributes?.content?.toString?.() || '';

				if (content) {
					headings.push({
						level: block.attributes.level,
						content,
						// in preview we don't need to create proper anchors
						// anchor: block.attributes.anchor,
						anchor: '',
					});
				}
			}

			if (block.innerBlocks && block.innerBlocks.length) {
				headings = [
					...headings,
					...getAllHeadings(block.innerBlocks, allowedHeaders),
				];
			}
		});
	}

	return headings;
}
