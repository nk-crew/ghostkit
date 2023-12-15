/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { getFieldAttributes } from '../../field-attributes';
/**
 * Internal dependencies
 */
import FieldLabel from '../../field-label';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit( props ) {
	const { attributes, setAttributes } = props;

	const { default: defaultVal } = props;

	let { className = '' } = props;

	className = classnames( 'ghostkit-form-field ghostkit-form-field-hidden', className );
	className = applyFilters( 'ghostkit.editor.className', className, props );

	const blockProps = useBlockProps( { className } );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<TextControl
						label={ __( 'Value', 'ghostkit' ) }
						value={ defaultVal }
						onChange={ ( val ) => setAttributes( { default: val } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<FieldLabel { ...props } />
				<TextControl type="text" { ...getFieldAttributes( attributes ) } />
			</div>
		</Fragment>
	);
}
