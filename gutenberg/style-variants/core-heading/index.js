/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { registerBlockStyle } from '@wordpress/blocks';

registerBlockStyle('core/heading', {
  name: 'numbered',
  label: __('Numbered', '@@text_domain'),
});
