import classnames from 'classnames/dedupe';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import {
	FieldDefaultSettings,
	getFieldAttributes,
} from '../../field-attributes';
import FieldDescription from '../../field-description';
import FieldLabel from '../../field-label';
import FieldOptions from '../../field-options';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, isSelected } = props;

	const { slug, inline } = attributes;

	let { options } = attributes;

	let { className = '' } = props;

	className = classnames(
		'ghostkit-form-field ghostkit-form-field-radio',
		inline && 'ghostkit-form-field-radio-inline',
		className
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	if (!options || !options.length) {
		options = [
			{
				label: '',
				value: '',
				selected: false,
			},
		];
	}

	let selectVal = '';

	options.forEach((data) => {
		if (!selectVal && data.selected) {
			selectVal = data.value;
		}
	});

	const blockProps = useBlockProps({ className });

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<FieldDefaultSettings
						{...props}
						defaultCustom={' '}
						placeholderCustom={' '}
					/>
					<ToggleControl
						label={__('Inline', 'ghostkit')}
						checked={inline}
						onChange={() => setAttributes({ inline: !inline })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<FieldLabel {...props} />

				{isSelected ? (
					<FieldOptions
						options={options}
						onChange={(val) => setAttributes({ options: val })}
					/>
				) : (
					<div className="ghostkit-form-field-radio-items">
						{options.map((data, i) => {
							const fieldName = `${slug}-item-${i}`;
							return (
								<label
									key={fieldName}
									htmlFor={fieldName}
									className="ghostkit-form-field-radio-item"
								>
									<input
										type="radio"
										checked={selectVal === data.value}
										onChange={() => {}}
										{...getFieldAttributes(attributes)}
									/>
									{data.label}
								</label>
							);
						})}
					</div>
				)}

				<FieldDescription {...props} />
			</div>
		</>
	);
}
