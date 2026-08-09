import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Field Label Class.
 *
 * @param props
 */
export default function FieldLabel(props) {
	const { attributes, setAttributes, isSelected } = props;

	const { label, hideLabel } = attributes;

	if (!label && !isSelected) {
		return null;
	}

	if (hideLabel && !isSelected) {
		return null;
	}

	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: the editor renders the label text only, the field itself is a separate block.
		<label className="ghostkit-form-field-label">
			<RichText
				inlineToolbar
				tagName="span"
				value={label}
				placeholder={__('Write label…', 'ghostkit')}
				onChange={(val) => setAttributes({ label: val })}
			/>
			{attributes.required ? <span className="required">*</span> : ''}
		</label>
	);
}
