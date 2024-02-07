import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Field Description Class.
 *
 * @param props
 */
export default function FieldDescription(props) {
	const { attributes, setAttributes, isSelected } = props;

	const { description, hideDescription } = attributes;

	if (!description && !isSelected) {
		return null;
	}

	if (hideDescription && !isSelected) {
		return null;
	}

	return (
		<RichText
			inlineToolbar
			tagName="small"
			className="ghostkit-form-field-description"
			value={description}
			placeholder={__('Write description…', 'ghostkit')}
			onChange={(val) => setAttributes({ description: val })}
		/>
	);
}
