import classnames from 'classnames/dedupe';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextareaControl } from '@wordpress/components';
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

	const { default: defaultVal } = attributes;

	let { className = '' } = props;

	className = classnames(
		'ghostkit-form-field ghostkit-form-field-textarea',
		className
	);
	className = applyFilters('ghostkit.editor.className', className, props);

	const defaultCustom = (
		<TextareaControl
			label={__('Default', 'ghostkit')}
			value={defaultVal}
			onChange={(val) => setAttributes({ default: val })}
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
			</InspectorControls>
			<div {...blockProps}>
				<FieldLabel {...props} />
				<TextareaControl
					__nextHasNoMarginBottom
					{...getFieldAttributes(attributes)}
				/>
				<FieldDescription {...props} />
			</div>
		</>
	);
}
