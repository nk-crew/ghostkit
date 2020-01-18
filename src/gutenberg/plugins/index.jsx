/**
 * WordPress dependencies
 */
const { registerPlugin } = wp.plugins;

/**
 * Internal dependencies
 */
import * as ghostkit from './ghostkit';
import * as templates from './templates';
import * as typography from './typography';
import * as customCode from './custom-code';
import * as colorPalette from './color-palette';
import * as customizer from './customizer';

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
].forEach( ( { name, icon, Plugin } ) => {
    registerPlugin( name, {
        icon,
        render: Plugin,
    } );
} );
