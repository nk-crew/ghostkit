/**
 * WordPress dependencies
 */
const {
    createBlock,
} = wp.blocks;

export default {
    from: [
        {
            type: 'block',
            blocks: [ 'core/separator' ],
            transform: function() {
                return createBlock( 'ghostkit/divider' );
            },
        },
    ],
    to: [
        {
            type: 'block',
            blocks: [ 'core/separator' ],
            transform: function() {
                return createBlock( 'core/separator' );
            },
        },
    ],
};
