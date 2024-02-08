import $ from 'jquery';

import { unregisterBlockType } from '@wordpress/blocks';
const {
	GHOSTKIT,
	_wpLoadBlockEditor: wpLoadBlockEditor,
	_wpLoadGutenbergEditor: wpLoadGutenbergEditor,
} = window;

let loadBlocksEditor = null;

if (typeof wpLoadBlockEditor !== 'undefined') {
	// Using Gutenberg plugin
	loadBlocksEditor = wpLoadBlockEditor;
} else if (typeof wpLoadGutenbergEditor !== 'undefined') {
	// Using WP core Gutenberg
	loadBlocksEditor = wpLoadGutenbergEditor;
}

$(() => {
	if (loadBlocksEditor && GHOSTKIT) {
		loadBlocksEditor.then(() => {
			if (GHOSTKIT.disabledBlocks) {
				Object.keys(GHOSTKIT.disabledBlocks).forEach((name) => {
					if (GHOSTKIT.disabledBlocks[name]) {
						unregisterBlockType(name);
					}
				});
			}
		});
	}
});
