import classnames from 'classnames/dedupe';

import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import {
	FieldDefaultSettings,
	getFieldAttributes,
} from '../../field-attributes';
import FieldDescription from '../../field-description';
import FieldLabel from '../../field-label';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes } = props;

	const {
		description,
		nameFields,
		descriptionLast,
		placeholderLast,
		defaultLast,
		descriptionMiddle,
		placeholderMiddle,
		defaultMiddle,
	} = attributes;

	let { className = '' } = props;

	className = classnames(
		'ghostkit-form-field ghostkit-form-field-name',
		nameFields === 'first-middle-last' || nameFields === 'first-last'
			? 'ghostkit-form-field-name-with-last'
			: '',
		nameFields === 'first-middle-last'
			? 'ghostkit-form-field-name-with-middle'
			: '',
		className
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<FieldDefaultSettings {...props} />
				</PanelBody>
				<PanelBody title={__('Name Fields', 'ghostkit')}>
					<SelectControl
						options={[
							{
								label: 'First',
								value: 'first',
							},
							{
								label: 'First Last',
								value: 'first-last',
							},
							{
								label: 'First Middle Last',
								value: 'first-middle-last',
							},
						]}
						value={nameFields}
						onChange={(val) => {
							if (val === 'first-last') {
								setAttributes({
									nameFields: val,
									description:
										description || __('First', 'ghostkit'),
									descriptionLast:
										descriptionLast ||
										__('Last', 'ghostkit'),
								});
							} else if (val === 'first-middle-last') {
								setAttributes({
									nameFields: val,
									description:
										description || __('First', 'ghostkit'),
									descriptionLast:
										descriptionLast ||
										__('Last', 'ghostkit'),
									descriptionMiddle:
										descriptionMiddle ||
										__('Middle', 'ghostkit'),
								});
							} else {
								setAttributes({ nameFields: val });
							}
						}}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					{nameFields === 'first-middle-last' ? (
						<>
							<TextControl
								label={__('Middle Placeholder', 'ghostkit')}
								value={placeholderMiddle}
								onChange={(val) =>
									setAttributes({ placeholderMiddle: val })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={__('Middle Default', 'ghostkit')}
								value={defaultMiddle}
								onChange={(val) =>
									setAttributes({ defaultMiddle: val })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					) : null}
					{nameFields === 'first-middle-last' ||
					nameFields === 'first-last' ? (
						<>
							<TextControl
								label={__('Last Placeholder', 'ghostkit')}
								value={placeholderLast}
								onChange={(val) =>
									setAttributes({ placeholderLast: val })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={__('Last Default', 'ghostkit')}
								value={defaultLast}
								onChange={(val) =>
									setAttributes({ defaultLast: val })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</>
					) : null}
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<FieldLabel {...props} />

				{nameFields === 'first-middle-last' ||
				nameFields === 'first-last' ? (
					<div className="ghostkit-form-field-row">
						<div className="ghostkit-form-field-name-first">
							<TextControl
								type="email"
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								{...getFieldAttributes(attributes)}
							/>
							<FieldDescription {...props} />
						</div>
						{nameFields === 'first-middle-last' ? (
							<div className="ghostkit-form-field-name-middle">
								<TextControl
									type="email"
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									{...getFieldAttributes({
										slug: attributes.slug
											? `${attributes.slug}-middle`
											: null,
										placeholder:
											attributes.placeholderMiddle,
										default: attributes.defaultMiddle,
										required: attributes.required,
									})}
								/>
								<RichText
									inlineToolbar
									tagName="small"
									className="ghostkit-form-field-description"
									value={descriptionMiddle}
									placeholder={__(
										'Write description…',
										'ghostkit'
									)}
									onChange={(val) =>
										setAttributes({
											descriptionMiddle: val,
										})
									}
								/>
							</div>
						) : null}
						{nameFields === 'first-middle-last' ||
						nameFields === 'first-last' ? (
							<div className="ghostkit-form-field-name-last">
								<TextControl
									type="email"
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									{...getFieldAttributes({
										slug: attributes.slug
											? `${attributes.slug}-last`
											: null,
										placeholder: attributes.placeholderLast,
										default: attributes.defaultLast,
										required: attributes.required,
									})}
								/>
								<RichText
									inlineToolbar
									tagName="small"
									className="ghostkit-form-field-description"
									value={descriptionLast}
									placeholder={__(
										'Write description…',
										'ghostkit'
									)}
									onChange={(val) =>
										setAttributes({ descriptionLast: val })
									}
								/>
							</div>
						) : null}
					</div>
				) : (
					<>
						<TextControl
							type="email"
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							{...getFieldAttributes(attributes)}
						/>
						<FieldDescription {...props} />
					</>
				)}
			</div>
		</>
	);
}
