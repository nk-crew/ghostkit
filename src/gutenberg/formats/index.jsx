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
import * as badge from './badge';

/**
 * Register formats
 */
[
    uppercase,
    badge,
].forEach( ( { name, settings } ) => {
    registerFormatType( name, settings );
} );
