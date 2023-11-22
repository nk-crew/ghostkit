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
import { __ } from '@wordpress/i18n';

const { name } = metadata;

export { metadata, name };

export const settings = {
  icon: getIcon('block-form', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/contact-form/',
  },
  example: {
    innerBlocks: [
      {
        name: 'ghostkit/form-field-email',
        attributes: {
          required: true,
        },
      },
      {
        name: 'ghostkit/form-field-text',
        attributes: {
          required: true,
          nameFields: 'first-last',
          description: __('First', '@@text_domain'),
          descriptionLast: __('Last', '@@text_domain'),
        },
      },
      {
        name: 'ghostkit/form-field-textarea',
        attributes: {
          label: __('Message', '@@text_domain'),
          placeholder: __('Write your message here...', '@@text_domain'),
        },
      },
      {
        name: 'ghostkit/form-submit-button',
      },
    ],
  },
  edit,
  save,
};
