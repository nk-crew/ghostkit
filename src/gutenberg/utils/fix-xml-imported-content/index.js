/**
 * Inside exported XML file almost all symbols are escaped.
 * So we need to fix it manually in the plugin.
 *
 * @param {string} str - affected string.
 * @return {string} - fixed string.
 */
export default function fixXmlImportedContent( str ) {
    if ( str && /^u003c/g.test( str ) ) {
        str = str
            .replace( /u003c/g, '<' )
            .replace( /u003e/g, '>' )
            .replace( /u0022/g, '"' )
            .replace( /u0026/g, '&' );
    }

    return str;
}
