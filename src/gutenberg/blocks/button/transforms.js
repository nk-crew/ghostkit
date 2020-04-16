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
            blocks: [ 'core/button' ],
            transform( attrs ) {
                return createBlock(
                    'ghostkit/button',
                    {
                        align: attrs.align,
                        count: 1,
                    },
                    [
                        createBlock(
                            'ghostkit/button-single',
                            {
                                url: attrs.url,
                                text: attrs.text,
                            },
                        ),
                    ],
                );
            },
        },
    ],
};
