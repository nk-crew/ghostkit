/**
 * Compact object - remove empty nested objects and undefined values.
 *
 * @link https://gist.github.com/Mazuh/8209a608a655f91b9de319872d7a660a
 *
 * @param {Object} obj - object to work with.
 *
 * @return {Object}
 */
export default function compactObject(obj) {
	if (typeof obj !== 'object') {
		return obj;
	}

	return Object.keys(obj).reduce(function (accumulator, key) {
		const isObject = typeof obj[key] === 'object';
		const value = isObject ? compactObject(obj[key]) : obj[key];
		const isEmptyObject = isObject && !Object.keys(value).length;

		if (value === undefined || isEmptyObject) {
			return accumulator;
		}

		return Object.assign(accumulator, { [key]: value });
	}, {});
}
