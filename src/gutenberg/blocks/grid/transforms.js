/**
 * WordPress dependencies
 */
const { createBlock } = wp.blocks;

export default {
  from: [
    {
      type: 'block',
      blocks: ['core/columns'],
      transform(attrs, InnerBlocks) {
        return createBlock(
          'ghostkit/grid',
          {
            columns: attrs.columns,
          },
          InnerBlocks.map((col) => createBlock('ghostkit/grid-column', {}, col.innerBlocks))
        );
      },
    },
  ],
};
