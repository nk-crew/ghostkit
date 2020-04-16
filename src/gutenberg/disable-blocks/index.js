/**
 * Internal dependencies
 */
const {
    GHOSTKIT,
    _wpLoadBlockEditor: wpLoadBlockEditor,
    _wpLoadGutenbergEditor: wpLoadGutenbergEditor,
} = window;

let loadBlocksEditor = null;

if ( 'undefined' !== typeof wpLoadBlockEditor ) {
    // Using Gutenberg plugin
    loadBlocksEditor = wpLoadBlockEditor;
} else if ( 'undefined' !== typeof wpLoadGutenbergEditor ) {
    // Using WP core Gutenberg
    loadBlocksEditor = wpLoadGutenbergEditor;
}

if ( loadBlocksEditor && GHOSTKIT ) {
    loadBlocksEditor.then( () => {
        if ( GHOSTKIT.disabledBlocks ) {
            Object.keys( GHOSTKIT.disabledBlocks ).forEach( ( name ) => {
                if ( GHOSTKIT.disabledBlocks[ name ] ) {
                    wp.blocks.unregisterBlockType( name );
                }
            } );
        }
    } );
}
