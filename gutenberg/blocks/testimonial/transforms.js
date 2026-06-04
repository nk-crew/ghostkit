import { createBlock } from '@wordpress/blocks';

function isCitationBlock(block = {}) {
	const { attributes = {}, name = '' } = block;
	const className = attributes.className || '';

	return (
		name === 'core/cite' ||
		className.includes('wp-block-quote__citation') ||
		className.includes('wp-block-pullquote__citation')
	);
}

function cloneInnerBlock(block = {}) {
	const { name = '', attributes = {}, innerBlocks = [] } = block;

	return createBlock(
		name,
		attributes,
		Array.isArray(innerBlocks) ? innerBlocks.map(cloneInnerBlock) : []
	);
}

function getBlockContent(block = {}) {
	const { attributes = {}, innerBlocks = [], originalContent = '' } = block;
	const { content, value } = attributes;
	const candidates = [content, value];

	for (const candidate of candidates) {
		if (typeof candidate === 'string' && candidate.trim()) {
			return candidate;
		}

		if (
			candidate &&
			typeof candidate === 'object' &&
			typeof candidate.toHTMLString === 'function'
		) {
			const html = candidate.toHTMLString();

			if (typeof html === 'string' && html.trim()) {
				return html;
			}
		}

		if (
			candidate &&
			typeof candidate === 'object' &&
			typeof candidate.text === 'string' &&
			candidate.text.trim()
		) {
			return candidate.text;
		}

		if (candidate !== undefined && candidate !== null) {
			const text = String(candidate);

			if (text.trim() && text !== '[object Object]') {
				return text;
			}
		}
	}

	if (typeof originalContent === 'string' && originalContent.trim()) {
		const template = document.createElement('template');
		template.innerHTML = originalContent;

		const text = template.content.textContent || '';

		if (text.trim()) {
			return text.trim();
		}
	}

	if (Array.isArray(innerBlocks) && innerBlocks.length) {
		return innerBlocks
			.map((innerBlock) => getBlockContent(innerBlock))
			.join('');
	}

	return '';
}

function getParagraphContentsFromHTML(html = '') {
	if (!html) {
		return [];
	}

	const template = document.createElement('template');
	template.innerHTML = html;

	const paragraphs = Array.from(template.content.querySelectorAll('p'))
		.map((paragraph) => paragraph.innerHTML)
		.filter((paragraph) => paragraph.trim());

	if (paragraphs.length) {
		return paragraphs;
	}

	const text = template.content.textContent || '';

	return text.trim() ? [text.trim()] : [];
}

function getTransformData(attrs = {}, innerBlocks = []) {
	const citation = attrs.citation || attrs.source || '';
	const result = {
		innerBlocks: [],
		name: citation,
		source: '',
	};

	if (Array.isArray(innerBlocks) && innerBlocks.length) {
		innerBlocks.forEach((block) => {
			if (isCitationBlock(block)) {
				const content = getBlockContent(block);

				if (!result.name) {
					result.name = content;
				}

				return;
			}

			result.innerBlocks.push(cloneInnerBlock(block));
		});

		if (result.innerBlocks.length) {
			return result;
		}
	}

	const fallbackHTML = attrs.value || attrs.content || attrs.quote || '';
	result.innerBlocks = getParagraphContentsFromHTML(fallbackHTML).map(
		(piece) =>
			createBlock('core/paragraph', {
				content: piece,
			})
	);

	return result;
}

export default {
	from: [
		{
			type: 'block',
			blocks: ['core/quote', 'core/pullquote'],
			transform(attrs, innerBlocks) {
				const {
					name,
					source,
					innerBlocks: testimonialInnerBlocks,
				} = getTransformData(attrs, innerBlocks);

				return createBlock(
					'ghostkit/testimonial',
					{
						name,
						source,
					},
					testimonialInnerBlocks
				);
			},
		},
	],
};
