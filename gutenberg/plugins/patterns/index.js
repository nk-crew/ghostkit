import { dispatch, select, subscribe } from '@wordpress/data';

function addReadablePatterns() {
	const readablePatterns =
		select('core/editor')?.getEditorSettings()?.ghostkitReadablePatterns;

	if (!readablePatterns?.length) {
		return;
	}

	const blockPatterns =
		select('core/block-editor').getSettings().__experimentalBlockPatterns ||
		[];
	const missingPatterns = readablePatterns.filter(
		({ name }) => !blockPatterns.some((pattern) => pattern.name === name)
	);

	if (missingPatterns.length) {
		// Site Editor treats patterns in its global settings as theme patterns.
		dispatch('core/block-editor').updateSettings({
			__experimentalBlockPatterns: [...blockPatterns, ...missingPatterns],
		});
	}
}

subscribe(addReadablePatterns, 'core/editor');
subscribe(addReadablePatterns, 'core/block-editor');
addReadablePatterns();
