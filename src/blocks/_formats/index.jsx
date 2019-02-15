import * as badge from './badge';
import * as uppercase from './uppercase';

const {
    registerFormatType,
} = wp.richText;

/**
 * Register formats
 */
[
    badge,
    uppercase,
].forEach( ( { name, settings } ) => {
    registerFormatType( name, settings );
} );
