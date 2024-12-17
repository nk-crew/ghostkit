import { InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	PanelBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import IconPicker from '../../../components/icon-picker';

export default function EditInspectorControls({ attributes, setAttributes }) {
	const { icon, width } = attributes;

	return (
		<InspectorControls>
			<PanelBody>
				<IconPicker
					label={__('Icon', 'ghostkit')}
					value={icon}
					onChange={(value) => setAttributes({ icon: value })}
					insideInspector
				/>
				<UnitControl
					label={__('Width', 'ghostkit')}
					placeholder={__('Auto', 'ghostkit')}
					value={width}
					onChange={(val) => setAttributes({ width: val })}
					labelPosition="edge"
					min={0}
					__unstableInputWidth="70px"
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
}
