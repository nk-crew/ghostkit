import {
	RichTextShortcut,
	RichTextToolbarButton,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { toggleFormat } from '@wordpress/rich-text';

import getIcon from '../../utils/get-icon';

export const name = 'ghostkit/uppercase';

export const settings = {
	title: __('Uppercase', 'ghostkit'),
	tagName: 'span',
	className: 'ghostkit-text-uppercase',
	edit: function BadgeFormat(props) {
		const { value, onChange, isActive } = props;

		function toggleUppercase() {
			onChange(
				toggleFormat(value, {
					type: name,
				})
			);
		}

		return (
			<>
				<RichTextShortcut
					type="access"
					character="u"
					onUse={() => toggleUppercase()}
				/>
				<RichTextToolbarButton
					shortcutCharacter="u"
					shortcutType="access"
					title={__('Uppercase', 'ghostkit')}
					icon={getIcon('icon-text-uppercase')}
					onClick={() => toggleUppercase()}
					isActive={isActive}
				/>
			</>
		);
	},
};
