import { TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Get field attributes to render Gutenberg component.
 *
 * @param {Object} attributes - block attributes.
 *
 * @return {Object} attributes list.
 */
export function getFieldAttributes(attributes) {
	const allowedAttributes = [
		'id',
		'placeholder',
		'default',
		'min',
		'max',
		'step',
		'multiple',
		'required',
		'for',
	];
	const result = {
		// prevent input focus.
		tabIndex: -1,
		onFocus(e) {
			e.target.blur();
		},
	};

	Object.keys(attributes).forEach((k) => {
		let val = attributes[k];

		if (typeof val !== 'undefined') {
			if (k === 'slug') {
				k = 'id';
			}

			if (allowedAttributes.indexOf(k) !== -1) {
				// boolean value.
				if (typeof val === 'boolean') {
					if (val) {
						val = k;
					} else {
						val = false;
					}
				}

				// default attribute.
				if (k === 'default') {
					k = 'value';
				}

				if (val !== false) {
					result[k] = val;
				}
			}
		}
	});

	return result;
}

/**
 * Field Default Settings Class.
 *
 * @param props
 */
export function FieldDefaultSettings(props) {
	const {
		attributes,
		setAttributes,

		hideLabelCustom,
		hideDescriptionCustom,
		requiredCustom,
		placeholderCustom,
		defaultCustom,
		slugCustom,
	} = props;

	const {
		slug,
		label,
		description,
		hideLabel,
		hideDescription,
		required,
		placeholder,
		default: defaultVal,
	} = attributes;

	const hideLabelControl = hideLabelCustom || (
		<ToggleControl
			label={__('Hide Label', 'ghostkit')}
			checked={hideLabel}
			onChange={() => setAttributes({ hideLabel: !hideLabel })}
			__nextHasNoMarginBottom
		/>
	);

	const hideDescriptionControl = hideDescriptionCustom || (
		<ToggleControl
			label={__('Hide Description', 'ghostkit')}
			checked={hideDescription}
			onChange={() =>
				setAttributes({ hideDescription: !hideDescription })
			}
			__nextHasNoMarginBottom
		/>
	);

	return (
		<>
			{slugCustom || (
				<TextControl
					label={__('Slug', 'ghostkit')}
					help={__(
						'Slug is used in form field [name] attribute.',
						'ghostkit'
					)}
					value={slug}
					onChange={() => {}}
					readOnly
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}
			{placeholderCustom || (
				<TextControl
					label={__('Placeholder', 'ghostkit')}
					value={placeholder}
					onChange={(val) => setAttributes({ placeholder: val })}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}
			{defaultCustom || (
				<TextControl
					label={__('Default', 'ghostkit')}
					value={defaultVal}
					onChange={(val) => setAttributes({ default: val })}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			)}
			{requiredCustom || (
				<ToggleControl
					label={__('Required', 'ghostkit')}
					checked={required}
					onChange={() => setAttributes({ required: !required })}
					__nextHasNoMarginBottom
				/>
			)}
			{label ? hideLabelControl : ''}
			{description ? hideDescriptionControl : ''}
		</>
	);
}
