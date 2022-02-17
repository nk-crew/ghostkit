/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import edit from './edit';
import save from './save';
import metadata from './block.json';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
  ...metadata,
  icon: getIcon('block-accordion', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/accordion/',
    supports: {
      styles: true,
      frame: true,
      spacings: true,
      display: true,
      scrollReveal: true,
      customCSS: true,
    },
  },
  example: {
    innerBlocks: [
      {
        name: 'ghostkit/accordion-item',
        attributes: {
          active: true,
          heading: 'Accordion Item 1',
          itemNumber: 1,
        },
        innerBlocks: [
          {
            name: 'core/paragraph',
            attributes: {
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis.',
            },
          },
        ],
      },
      {
        name: 'ghostkit/accordion-item',
        attributes: {
          active: false,
          heading: 'Accordion Item 2',
          itemNumber: 2,
        },
      },
    ],
  },
  edit,
  save,
  transforms,
};
