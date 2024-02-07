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
		// eslint-disable-next-line jsx-a11y/label-has-associated-control
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
