import { registerBlockStyle } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockStyle('core/heading', {
	name: 'numbered',
	label: __('Numbered', 'ghostkit'),
});
