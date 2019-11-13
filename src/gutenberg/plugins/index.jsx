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
import * as customizer from './customizer';

/**
 * Register plugins
 */
[
    ghostkit,
    templates,
    typography,
    customCode,
    customizer,
].forEach( ( { name, icon, Plugin } ) => {
    registerPlugin( name, {
        icon,
        render: Plugin,
    } );
} );
