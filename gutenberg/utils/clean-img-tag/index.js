import { maybeDecode } from '../encode-decode';

const cache = {};

/**
 * Escape and fix string containing img tag.
 *
 * @param {string} str - string.
 * @return {string} - escaped string.
 */
export default function cleanImgTag(str) {
	// return cached string.
	if (cache[str]) {
		return cache[str];
	}

	let result = str;

	// inside exported xml file almost all symbols are escaped.
	if (result && /^u003c/g.test(result)) {
		result = result
			.replace(/u003c/g, '<')
			.replace(/u003e/g, '>')
			.replace(/u0022/g, '"')
			.replace(/u0026/g, '&');
	}

	result = maybeDecode(result);

	result = result.replace('url(&quot;', "url('");
	result = result.replace('&quot;);', "');");

	// Remove script tags
	result = result.replace(
		/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		''
	);

	// Clean img tags
	const imgRegex = /<img\s(.*?)\/?>/gi;
	const attributeRegex =
		/(\w+)\s*=\s*["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/gi;

	result = result.replace(imgRegex, (match, attributes) => {
		const safeAttributes = attributes.replace(
			attributeRegex,
			(attr, name, value) => {
				// Convert attribute name to lowercase for consistent checking
				const lowercaseName = name.toLowerCase();

				// Remove any attribute that starts with 'on' (event handlers)
				if (lowercaseName.startsWith('on')) {
					return '';
				}

				// Check src attribute for potential JavaScript
				if (
					lowercaseName === 'src' &&
					/^(javascript|data):/i.test(value)
				) {
					return '';
				}

				return attr;
			}
		);

		return `<img ${safeAttributes}>`;
	});

	// save to cache.
	cache[str] = result;

	return result;
}
