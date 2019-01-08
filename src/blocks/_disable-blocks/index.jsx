const {
    GHOSTKIT,
} = window;

let loadBlocksEditor = null;

if ( typeof window._wpLoadBlockEditor !== 'undefined' ) {
    // Using Gutenberg plugin
    loadBlocksEditor = window._wpLoadBlockEditor;
} else if ( typeof window._wpLoadGutenbergEditor !== 'undefined' ) {
    // Using WP core Gutenberg
    loadBlocksEditor = window._wpLoadGutenbergEditor;
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
