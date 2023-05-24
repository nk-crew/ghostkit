/**
 * Internal dependencies
 */
import * as uppercase from './uppercase';
import * as badge from './badge';
// Deprecated
import * as deprecatedMark from './deprecated-mark';

/**
 * WordPress dependencies
 */
const { registerFormatType } = wp.richText;

/**
 * Register formats
 */
[uppercase, badge, deprecatedMark].forEach(({ name, settings }) => {
  registerFormatType(name, settings);
});
