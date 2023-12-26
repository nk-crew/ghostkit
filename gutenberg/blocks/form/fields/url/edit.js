import classnames from 'classnames/dedupe';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

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
	const { attributes } = props;

	let { className = '' } = props;

	className = classnames(
		'ghostkit-form-field ghostkit-form-field-url',
		className
	);
	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<FieldDefaultSettings {...props} />
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<FieldLabel {...props} />
				<TextControl type="url" {...getFieldAttributes(attributes)} />
				<FieldDescription {...props} />
			</div>
		</Fragment>
	);
}
