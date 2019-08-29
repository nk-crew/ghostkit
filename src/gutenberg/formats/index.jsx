/**
 * WordPress dependencies
 */
const {
    registerFormatType,
} = wp.richText;

/**
 * Internal dependencies
 */
import * as uppercase from './uppercase';
import * as mark from './mark';
import * as badge from './badge';

/**
 * Register formats
 */
[
    uppercase,
    mark,
    badge,
].forEach( ( { name, settings } ) => {
    registerFormatType( name, settings );
} );
