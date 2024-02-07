import { registerPlugin } from '@wordpress/plugins';

import * as colorPalette from './color-palette';
import * as customCode from './custom-code';
import * as customizer from './customizer';
import * as editorIframeResize from './editor-iframe-resize';
import * as ghostkit from './ghostkit';
import * as templates from './templates';
import * as typography from './typography';

const { GHOSTKIT } = window;

/**
 * Register plugins
 */
[
	ghostkit,
	templates,
	typography,
	customCode,
	colorPalette,
	customizer,
	editorIframeResize,
].forEach(({ name, icon, Plugin }) => {
	if (
		(name === 'ghostkit-color-palette' &&
			!GHOSTKIT.allowPluginColorPalette) ||
		(name === 'ghostkit-customizer' && !GHOSTKIT.allowPluginCustomizer) ||
		(name === 'ghostkit-templates' && !GHOSTKIT.allowTemplates)
	) {
		return;
	}

	registerPlugin(name, {
		icon,
		render: Plugin,
	});
});
