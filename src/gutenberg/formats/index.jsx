import * as spanFix from './span-fix';
import * as uppercase from './uppercase';
import * as badge from './badge';

const {
    registerFormatType,
} = wp.richText;

/**
 * Register formats
 */
[
    spanFix,
    uppercase,
    badge,
].forEach( ( { name, settings } ) => {
    registerFormatType( name, settings );
} );
