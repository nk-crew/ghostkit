import { unregisterBlockType } from '@wordpress/blocks';
import $ from 'jquery';

const { GHOSTKIT, _wpLoadBlockEditor: loadBlocksEditor } = window;

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
