import { dispatch, select, subscribe } from '@wordpress/data';

const patternQuery = { per_page: -1 };

function addReadablePatterns() {
	const readablePatterns =
		select('core/editor')?.getEditorSettings()?.ghostkitReadablePatterns;

	if (!readablePatterns?.length) {
		return;
	}

	const core = select('core');
	const nativePatterns = core.getEntityRecords(
		'postType',
		'wp_block',
		patternQuery
	);
	const nativeIds = new Set(nativePatterns?.map(({ id }) => id));
	const blockPatterns =
		select('core/block-editor').getSettings().__experimentalBlockPatterns ||
		[];
	const readableNames = new Set(readablePatterns.map(({ name }) => name));
	const fallbackPatterns = readablePatterns.filter(
		({ id }) => !nativeIds.has(id)
	);
	const currentFallbacks = blockPatterns.filter(({ name }) =>
		readableNames.has(name)
	);

	if (
		currentFallbacks.length !== fallbackPatterns.length ||
		currentFallbacks.some(
			(pattern, index) => pattern !== fallbackPatterns[index]
		)
	) {
		// Site Editor treats patterns in its global settings as theme patterns.
		dispatch('core/block-editor').updateSettings({
			__experimentalBlockPatterns: [
				...blockPatterns.filter(({ name }) => !readableNames.has(name)),
				...fallbackPatterns,
			],
		});
	}
}

subscribe(addReadablePatterns, 'core');
subscribe(addReadablePatterns, 'core/editor');
subscribe(addReadablePatterns, 'core/block-editor');
addReadablePatterns();
