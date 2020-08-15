/**
 * WordPress dependencies
 */
const {
    jQuery: $,
} = window;

const {
    __,
} = wp.i18n;

const {
    createBlock,
} = wp.blocks;

/**
 * Add templates button to Gutenberg toolbar
 */
$( document ).on( 'DOMContentLoaded', () => {
    const $toolbar = $( '.edit-post-header-toolbar' );

    if ( $toolbar.length ) {
        $toolbar.append( `
            <div>
                <div class="ghostkit-toolbar-templates">
                    <button class="components-button components-icon-button" aria-label="${ __( 'Add Template', '@@text_domain' ) }">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 8.583a.75.75 0 000 1.5v-1.5zm16 1.5a.75.75 0 100-1.5v1.5zM8.583 20a.75.75 0 001.5 0h-1.5zm1.5-10.667a.75.75 0 10-1.5 0h1.5zM5.778 4.75h12.444v-1.5H5.778v1.5zm12.444 0c.568 0 1.028.46 1.028 1.028h1.5a2.528 2.528 0 00-2.528-2.528v1.5zm1.028 1.028v12.444h1.5V5.778h-1.5zm0 12.444c0 .568-.46 1.028-1.028 1.028v1.5a2.528 2.528 0 002.528-2.528h-1.5zm-1.028 1.028H5.778v1.5h12.444v-1.5zm-12.444 0c-.568 0-1.028-.46-1.028-1.028h-1.5a2.528 2.528 0 002.528 2.528v-1.5zM4.75 18.222V5.778h-1.5v12.444h1.5zm0-12.444c0-.568.46-1.028 1.028-1.028v-1.5A2.528 2.528 0 003.25 5.778h1.5zM4 10.083h16v-1.5H4v1.5zM10.083 20V9.333h-1.5V20h1.5z" fill="currentColor"></path></svg>
                        ${ __( 'Add Template', '@@text_domain' ) }
                    </button>
                </div>
            </div>
        ` );

        // Insert `ghostkit/grid` block with attribute `isTemplatesModalOnly`.
        $( document ).on( 'click', '.ghostkit-toolbar-templates button', ( e ) => {
            e.preventDefault();

            const {
                insertBlocks,
            } = wp.data.dispatch( 'core/block-editor' );

            insertBlocks( createBlock( 'ghostkit/grid', {
                isTemplatesModalOnly: true,
            } ) );
        } );
    }
} );
