/**
 * Get parent elements.
 *
 * @param {Element} $element - an element to search for parent elements
 * @return {Array} - parent elements
 */
export default function getParents($element) {
	const result = [];
	for (let p = $element && $element.parentElement; p; p = p.parentElement) {
		result.push(p);
	}
	return result;
}
