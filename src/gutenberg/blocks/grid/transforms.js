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
            blocks: [ 'core/columns' ],
            transform: function( attrs, InnerBlocks ) {
                return createBlock(
                    'ghostkit/grid',
                    {
                        columns: attrs.columns,
                    },
                    InnerBlocks.map( ( col ) => {
                        return createBlock(
                            'ghostkit/grid-column',
                            {},
                            col.innerBlocks,
                        );
                    } ),
                );
            },
        },
    ],
};
