import classnames from 'classnames/dedupe';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
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

	const { min, max, step, default: defaultVal } = attributes;

	let { className = '' } = props;

	className = classnames(
		'ghostkit-form-field ghostkit-form-field-number',
		className
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const defaultCustom = (
		<TextControl
			type="number"
			label={__('Default', 'ghostkit')}
			value={defaultVal}
			onChange={(val) => setAttributes({ default: val })}
			step={step}
			max={max}
			min={min}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>
	);

	const blockProps = useBlockProps({ className });

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<FieldDefaultSettings
						{...props}
						defaultCustom={defaultCustom}
					/>
				</PanelBody>
				<PanelBody title={__('Number Settings', 'ghostkit')}>
					<TextControl
						type="number"
						label={__('Min', 'ghostkit')}
						value={min}
						onChange={(val) => setAttributes({ min: val })}
						step={step}
						max={max}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<TextControl
						type="number"
						label={__('Max', 'ghostkit')}
						value={max}
						onChange={(val) => setAttributes({ max: val })}
						step={step}
						min={min}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<TextControl
						type="number"
						label={__('Step', 'ghostkit')}
						value={step}
						onChange={(val) => setAttributes({ step: val })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<FieldLabel {...props} />
				<TextControl
					type="number"
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					{...getFieldAttributes(attributes)}
				/>
				<FieldDescription {...props} />
			</div>
		</>
	);
}
