import * as uppercase from './uppercase';
import * as badge from './badge';

const {
    registerFormatType,
} = wp.richText;

/**
 * Register formats
 */
[
    uppercase,
    badge,
].forEach( ( { name, settings } ) => {
    registerFormatType( name, settings );
} );
