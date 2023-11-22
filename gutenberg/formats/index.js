/**
 * Internal dependencies
 */
import * as uppercase from './uppercase';
import * as badge from './badge';
import * as loremIpsum from './lorem-ipsum';
// Deprecated
import * as deprecatedMark from './deprecated-mark';

/**
 * WordPress dependencies
 */
import { registerFormatType } from '@wordpress/rich-text';

/**
 * Register formats
 */
[uppercase, badge, loremIpsum, deprecatedMark].forEach(({ name, settings }) => {
  registerFormatType(name, settings);
});
