import { registerPlugin } from '@wordpress/plugins';

import * as colorPalette from './plugins/color-palette';
import * as customCode from './plugins/custom-code';
import * as customizer from './plugins/customizer';
import * as editorIframeResize from './plugins/editor-iframe-resize';
import * as ghostkit from './plugins/ghostkit';
import * as typography from './plugins/typography';

import './plugins/patterns';

const { GHOSTKIT } = window;

/**
 * Register plugins
 */
[
	ghostkit,
	typography,
	customCode,
	colorPalette,
	customizer,
	editorIframeResize,
].forEach(({ name, icon, Plugin }) => {
	if (
		(name === 'ghostkit-color-palette' &&
			!GHOSTKIT.allowPluginColorPalette) ||
		(name === 'ghostkit-customizer' && !GHOSTKIT.allowPluginCustomizer)
	) {
		return;
	}

	registerPlugin(name, {
		icon,
		render: Plugin,
	});
});
