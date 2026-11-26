import { InspectorControls } from '@wordpress/block-editor';
import {
	Notice,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { hasNativeTabs } from '../transforms';

export default function EditInspectorControls({ attributes, setAttributes }) {
	const { trigger, buttonsAlign, buttonsVerticalAlign } = attributes;

	return (
		<InspectorControls>
			<PanelBody>
				{hasNativeTabs() && (
					<Notice status="info" isDismissible={false}>
						{__(
							'Use the WordPress Tabs block for new content. You can keep editing your Ghost Kit tabs.',
							'ghostkit'
						)}
					</Notice>
				)}
				<SelectControl
					label={__('Select Tab Trigger', 'ghostkit')}
					value={trigger}
					options={[
						{
							value: '',
							label: __('Click', 'ghostkit'),
						},
						{
							value: 'hover',
							label: __('Hover', 'ghostkit'),
						},
					]}
					onChange={(val) => {
						setAttributes({ trigger: val });
					}}
				/>
				<ToggleControl
					label={__('Vertical Tabs', 'ghostkit')}
					checked={!!buttonsVerticalAlign}
					onChange={(val) => {
						setAttributes({ buttonsVerticalAlign: val });

						if (val && buttonsAlign === 'stretch') {
							setAttributes({ buttonsAlign: 'start' });
						}
					}}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
