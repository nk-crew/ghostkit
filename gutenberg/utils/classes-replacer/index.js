import TokenList from '@wordpress/token-list';

/**
 * Returns the active style from the given className.
 *
 * @param {string} className  Class name
 * @param {string} namespace  The replacing class namespace.
 * @param {bool}   suffixOnly Return suffix of the class only.
 *
 * @return {string} The active style.
 */
export function getActiveClass(className, namespace, suffixOnly) {
	const list = new TokenList(className);

	for (const activeClass of list.values()) {
		if (activeClass.indexOf(`${namespace}-`) === -1) {
			continue;
		}

		if (suffixOnly) {
			return activeClass.replace(`${namespace}-`, '');
		}

		return activeClass;
	}

	return '';
}

/**
 * Replaces the active class with namespace in the className.
 *
 * @param {string} className Class name.
 * @param {string} namespace The replacing class namespace.
 * @param {string} newClass  The replacing class.
 *
 * @return {string} The updated className.
 */
export function replaceClass(className, namespace, newClass) {
	const list = new TokenList(className);
	const namespaceRegExp = new RegExp(`${namespace}-`);

	// remove classes with the same namespace.
	for (const activeClass of list.values()) {
		if (namespaceRegExp.test(activeClass)) {
			list.remove(activeClass);
		}
	}

	// add new class.
	if (newClass) {
		list.add(`${namespace}-${newClass}`);
	}

	return list.value;
}

/**
 * Add class to the className.
 *
 * @param {string} className Class name.
 * @param {string} newClass  The replacing class.
 *
 * @return {string} The updated newClass.
 */
export function addClass(className, newClass) {
	const list = new TokenList(className);

	if (newClass) {
		list.add(newClass);
	}

	return list.value;
}

/**
 * Remove class from the className.
 *
 * @param {string} className     Class name.
 * @param {string} classToRemove Class to remove.
 *
 * @return {string} The updated className.
 */
export function removeClass(className, classToRemove) {
	const list = new TokenList(className);

	// remove classes with the same namespace.
	for (const activeClass of list.values()) {
		if (classToRemove === activeClass) {
			list.remove(activeClass);
		}
	}

	return list.value;
}

/**
 * Check if classname exist.
 *
 * @param {string} className      Class name.
 * @param {string} checkClassName Class to check.
 *
 * @return {boolean} Is class exists.
 */
export function hasClass(className, checkClassName) {
	const list = new TokenList(className);

	// remove classes with the same namespace.
	for (const activeClass of list.values()) {
		if (checkClassName === activeClass) {
			return true;
		}
	}

	return false;
}
