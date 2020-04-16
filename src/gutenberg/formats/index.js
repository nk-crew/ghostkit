/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import * as uppercase from './uppercase';
import * as mark from './mark';
import * as badge from './badge';

const {
    registerFormatType,
} = wp.richText;

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
