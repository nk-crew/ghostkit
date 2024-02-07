/**
 * Helper class to get and set instances from elements.
 * These instances contains many helpful data such as block APIs and extensions data.
 *
 * Example:
 * GHOSTKIT.instance.get(element, 'effects');
 */
const elementsMap = new Map();

export default {
	getAll() {
		return elementsMap;
	},

	get(element, key) {
		if (elementsMap.has(element)) {
			if (key) {
				return elementsMap.get(element).get(key) || null;
			}

			return elementsMap.get(element) || null;
		}

		return null;
	},

	set(element, key, val) {
		if (!elementsMap.has(element)) {
			elementsMap.set(element, new Map());
		}

		const instanceMap = elementsMap.get(element);

		instanceMap.set(key, val);
	},

	remove(element, key) {
		if (!elementsMap.has(element)) {
			return;
		}

		const instanceMap = elementsMap.get(element);

		if (key) {
			instanceMap.delete(key);
		}

		// Free up element references if there are no instances left for an element or key is missing.
		if (!key || instanceMap.size === 0) {
			elementsMap.delete(element);
		}
	},
};
