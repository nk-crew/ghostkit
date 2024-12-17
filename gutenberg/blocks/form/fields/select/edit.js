import classnames from 'classnames/dedupe';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
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

	const { multiple } = attributes;

	let { options } = attributes;

	let { className = '' } = props;

	className = classnames(
		'ghostkit-form-field ghostkit-form-field-select',
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

	let selectVal = multiple ? [] : '';

	options.forEach((data) => {
		if (multiple && data.selected) {
			selectVal.push(data.value);
		} else if (!multiple && !selectVal && data.selected) {
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
						label={__('Multiple', 'ghostkit')}
						checked={multiple}
						onChange={() => {
							if (multiple) {
								const newOptions = [...options];
								let singleSelected = false;

								newOptions.forEach((data, i) => {
									if (data.selected) {
										if (singleSelected) {
											newOptions[i].selected = false;
										}

										singleSelected = true;
									}
								});

								setAttributes({
									multiple: !multiple,
									options: newOptions,
								});
							} else {
								setAttributes({ multiple: !multiple });
							}
						}}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<FieldLabel {...props} />

				{isSelected ? (
					<FieldOptions
						options={options}
						multiple={multiple}
						onChange={(val) => setAttributes({ options: val })}
					/>
				) : (
					<SelectControl
						{...getFieldAttributes(attributes)}
						value={selectVal}
						options={(() => {
							if (!multiple) {
								let addNullOption = true;

								Object.keys(options).forEach((data) => {
									if (data.selected) {
										addNullOption = false;
									}
								});

								if (addNullOption) {
									return [
										{
											label: __(
												'--- Select ---',
												'ghostkit'
											),
											value: '',
											selected: true,
										},
										...options,
									];
								}
							}

							return options;
						})()}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				)}

				<FieldDescription {...props} />
			</div>
		</>
	);
}
