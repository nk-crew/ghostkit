import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Notice, PanelBody } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames/dedupe';

import IconPicker from '../../components/icon-picker';
import EditBlockControls from './edit/block-controls';
import ColorControls from './edit/color-controls';
import EditInspectorControls from './edit/inspector-controls';
import { hasNativeIcon } from './transforms';

export default function BlockEdit(props) {
	const { attributes, setAttributes, isSelected, clientId } = props;
	const { flipV, flipH } = attributes;

	let { className = '' } = props;

	className = classnames(
		'ghostkit-icon',
		{
			'ghostkit-icon-flip-vertical': flipV,
			'ghostkit-icon-flip-horizontal': flipH,
		},
		className
	);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });

	return (
		<>
			{hasNativeIcon() && (
				<InspectorControls>
					<PanelBody>
						<Notice status="info" isDismissible={false}>
							{__(
								'This block is deprecated. Use the WordPress Icon block for new content.',
								'ghostkit'
							)}
						</Notice>
					</PanelBody>
				</InspectorControls>
			)}
			<EditInspectorControls
				attributes={attributes}
				setAttributes={setAttributes}
			/>
			<ColorControls
				attributes={attributes}
				setAttributes={setAttributes}
				clientId={clientId}
			/>
			<EditBlockControls
				attributes={attributes}
				setAttributes={setAttributes}
				isSelected={isSelected}
			/>

			<span {...blockProps}>
				<IconPicker.Preview
					tag="div"
					name={attributes.icon}
					className="ghostkit-icon-inner"
				/>
			</span>
		</>
	);
}
