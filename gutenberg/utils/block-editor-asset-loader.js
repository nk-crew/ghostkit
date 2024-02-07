/**
 * These utils used to load vendor assets inside the editor iframe.
 * Thanks to https://github.com/Automattic/jetpack/blob/trunk/projects/plugins/jetpack/extensions/shared/block-editor-asset-loader.js
 */

/**
 * Returns the current document and window contexts for `elementRef`.
 * Use to retrieve the correct context for elements that may be within an iframe.
 *
 * @param {HTMLElement} elementRef - The element whose context we want to return.
 * @return {Object}                 - The current document (`currentDoc`) and window (`currentWindow`) contexts.
 */
export function getLoadContext(elementRef) {
	const currentDoc = elementRef.ownerDocument;
	const currentWindow = currentDoc.defaultView || currentDoc.parentWindow;

	return { currentDoc, currentWindow };
}

/**
 * This function will check if the given css and js resources are present in the head of the document
 * for current block, and if not will load those resources into the head.
 *
 * It's a temporary work-around to until core gutenberg has an API to allow loading of 3rd party resources
 * into the current editor iframe.
 *
 * @param {string}      type       - Resource type [js, css].
 * @param {string}      resourceId - Resource resource element id.
 * @param {HTMLElement} elementRef - A reference for an element within the current block.
 * @param {Object}      callback   - Callback for js resources to be called when script loaded.
 */
export function loadBlockEditorAssets(
	type,
	resourceId,
	elementRef,
	callback = () => {}
) {
	const { currentDoc } = getLoadContext(elementRef);
	const currentHead = currentDoc.getElementsByTagName('head')[0];

	const parentDocElement = document.getElementById(resourceId);

	if (!parentDocElement) {
		return;
	}

	const currentDocElement = currentDoc.getElementById(resourceId);

	// Already exists.
	if (currentDocElement) {
		callback();

		return;
	}

	if (type === 'js') {
		const scriptEl = currentDoc.createElement('script');
		scriptEl.id = resourceId;
		scriptEl.type = 'text/javascript';
		scriptEl.src = parentDocElement.src;
		scriptEl.onload = callback;
		currentHead.appendChild(scriptEl);
	}

	if (type === 'css') {
		const styleEl = currentDoc.createElement('link');
		styleEl.id = resourceId;
		styleEl.rel = 'stylesheet';
		styleEl.href = parentDocElement.href;
		currentHead.appendChild(styleEl);
	}
}
