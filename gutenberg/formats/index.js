import { registerFormatType } from '@wordpress/rich-text';

import * as badge from './badge';
// Deprecated
import * as deprecatedMark from './deprecated-mark';
import * as loremIpsum from './lorem-ipsum';
import * as uppercase from './uppercase';

/**
 * Register formats
 */
[uppercase, badge, loremIpsum, deprecatedMark].forEach(({ name, settings }) => {
	registerFormatType(name, settings);
});
