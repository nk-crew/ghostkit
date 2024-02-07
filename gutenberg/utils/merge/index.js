/**
 * Simple object check.
 *
 * @param  item
 * @return {boolean}
 */
function isObject(item) {
	return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 *
 * @link https://stackoverflow.com/a/34749873
 *
 * @param {...any} sources
 * @param          target
 * @param          ...sources
 */
export default function mergeDeep(target, ...sources) {
	if (!sources.length) {
		return target;
	}
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			if (isObject(source[key])) {
				if (!target[key]) {
					Object.assign(target, { [key]: {} });
				}
				mergeDeep(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		});
	}

	return mergeDeep(target, ...sources);
}
