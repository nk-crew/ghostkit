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

	const { min, max, default: defaultVal } = attributes;

	let { className = '' } = props;

	className = classnames(
		'ghostkit-form-field ghostkit-form-field-date',
		className
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const defaultCustom = (
		<TextControl
			type="date"
			label={__('Default', 'ghostkit')}
			value={defaultVal}
			onChange={(val) => setAttributes({ default: val })}
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
				<PanelBody title={__('Date Settings', 'ghostkit')}>
					<TextControl
						type="date"
						label={__('Min', 'ghostkit')}
						value={min}
						onChange={(val) => setAttributes({ min: val })}
						max={max}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<TextControl
						type="date"
						label={__('Max', 'ghostkit')}
						value={max}
						onChange={(val) => setAttributes({ max: val })}
						min={min}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<FieldLabel {...props} />
				<TextControl
					type="date"
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					{...getFieldAttributes(attributes)}
				/>
				<FieldDescription {...props} />
			</div>
		</>
	);
}
