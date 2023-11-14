/**
 * WordPress dependencies
 */
const { createBlock } = wp.blocks;

const { split, create, toHTMLString, __UNSTABLE_LINE_SEPARATOR } = wp.richText;

export default {
  from: [
    {
      type: 'block',
      blocks: ['core/quote', 'core/pullquote'],
      transform(attrs) {
        const paragraphs = split(
          create({
            html: attrs.value,
            multilineTag: 'p',
          }),
          __UNSTABLE_LINE_SEPARATOR
        );

        return createBlock(
          'ghostkit/testimonial',
          {
            source: attrs.citation || '',
          },
          paragraphs.map((piece) =>
            createBlock('core/paragraph', {
              content: toHTMLString({ value: piece }),
            })
          )
        );
      },
    },
  ],
};
