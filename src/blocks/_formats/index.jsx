import * as badge from './badge';

const {
    registerFormatType,
} = wp.richText;

/**
 * Register formats
 */
[
    badge,
].forEach( ( { name, settings } ) => {
    registerFormatType( name, settings );
} );
