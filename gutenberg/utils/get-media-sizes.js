import { applyFilters } from '@wordpress/hooks';

export const MOBILE_PREVIEW_MAX_WIDTH = 375;

/**
 * Get responsive device sizes used in the editor.
 *
 * @return {Object}
 */
export function getMediaSizes() {
	const sizes = { ...(window.ghostkitVariables?.media_sizes || {}) };

	return applyFilters('ghostkit.editor.mediaSizes', sizes);
}

/**
 * Get editor preview iframe width for a responsive device.
 *
 * @param {string} device - responsive device key (sm, md, lg, xl).
 *
 * @return {number|null}
 */
export function getPreviewWidth(device) {
	if (!device) {
		return null;
	}

	const sizes = getMediaSizes();
	let width = sizes[device];

	if (!width) {
		return null;
	}

	if (device === 'sm' && width > MOBILE_PREVIEW_MAX_WIDTH) {
		width = MOBILE_PREVIEW_MAX_WIDTH;
	}

	return applyFilters('ghostkit.editor.previewWidth', width, device, sizes);
}
