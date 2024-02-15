import {
	RichTextShortcut,
	RichTextToolbarButton,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { toggleFormat } from '@wordpress/rich-text';

import getIcon from '../../utils/get-icon';

export const name = 'ghostkit/mark';

export const settings = {
	title: __('Highlight', 'ghostkit'),
	tagName: 'mark',
	className: 'ghostkit-highlight',
	edit: function HighlightFormat(props) {
		const { value, onChange, isActive } = props;

		function toggleMark() {
			onChange(
				toggleFormat(value, {
					type: name,
				})
			);
		}

		// Since this format is deprecated, we don't need to display it in UI.
		if (!isActive) {
			return null;
		}

		return (
			<>
				<RichTextShortcut
					type="access"
					character="m"
					onUse={() => toggleMark()}
				/>
				<RichTextToolbarButton
					shortcutCharacter="m"
					shortcutType="access"
					title={__('Highlight', 'ghostkit')}
					icon={getIcon('icon-felt-pen')}
					onClick={() => toggleMark()}
					isActive={isActive}
				/>
			</>
		);
	},
};
