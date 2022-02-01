/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { name } = metadata;

export { metadata, name };

export const settings = {
  ...metadata,
  title: __('Pricing Table', '@@text_domain'),
  description: __('Sell your products or services and show all features.', '@@text_domain'),
  icon: getIcon('block-pricing-table', true),
  keywords: [__('pricing', '@@text_domain'), __('table', '@@text_domain')],
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/pricing-tables/',
    customStylesCallback(attributes) {
      const { gap, gapCustom } = attributes;

      const result = {};

      // Custom Gap.
      if (gap === 'custom' && typeof gapCustom !== 'undefined') {
        // we need to use `%` unit because of conflict with complex calc() and 0 value.
        const unit = gapCustom ? 'px' : '%';

        result['--gkt-pricing-table__gap'] = `${gapCustom}${unit}`;
      }

      return result;
    },
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
    attributes: {
      count: 2,
    },
    innerBlocks: [
      {
        name: 'ghostkit/pricing-table-item',
        attributes: {
          title: 'Standard',
          price: '$49',
          features: '<li>Feature 1</li><li>Feature 2</li>',
          showPopular: true,
        },
        innerBlocks: [
          {
            name: 'ghostkit/button',
            attributes: {
              align: 'center',
            },
            innerBlocks: [
              {
                name: 'ghostkit/button-single',
                attributes: {
                  text: 'Purchase',
                },
              },
            ],
          },
        ],
      },
      {
        name: 'ghostkit/pricing-table-item',
        attributes: {
          title: 'Developers',
          price: '$99',
          features: '<li>Feature 1</li><li>Feature 2</li>',
        },
        innerBlocks: [
          {
            name: 'ghostkit/button',
            attributes: {
              align: 'center',
            },
            innerBlocks: [
              {
                name: 'ghostkit/button-single',
                attributes: {
                  text: 'Purchase',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  edit,
  save,
};
