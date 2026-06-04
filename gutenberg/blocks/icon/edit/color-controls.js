import {
	__experimentalColorGradientSettingsDropdown as ExperimentalColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as experimentalUseMultipleOriginColorsAndGradients,
	ColorGradientSettingsDropdown as StableColorGradientSettingsDropdown,
	InspectorControls,
	useMultipleOriginColorsAndGradients as stableUseMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ColorGradientSettingsDropdown =
	StableColorGradientSettingsDropdown ||
	ExperimentalColorGradientSettingsDropdown;
const useMultipleOriginColorsAndGradients =
	stableUseMultipleOriginColorsAndGradients ||
	experimentalUseMultipleOriginColorsAndGradients ||
	(() => ({ hasColorsOrGradients: false }));

export default function ColorControls(props) {
	const { attributes, setAttributes, clientId } = props;
	const { color, backgroundColor, backgroundGradient } = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	if (!ColorGradientSettingsDropdown) {
		return (
			<InspectorControls group="color">
				<Notice status="error" isDismissible={false}>
					{__(
						'Color settings are unavailable because the required Gutenberg color control component is not available in this WordPress installation.',
						'ghostkit'
					)}
				</Notice>
			</InspectorControls>
		);
	}

	return colorGradientSettings.hasColorsOrGradients ? (
		<InspectorControls group="color">
			<ColorGradientSettingsDropdown
				__experimentalIsRenderedInSidebar
				settings={[
					{
						colorValue: color,
						label: __('Icon', 'ghostkit'),
						onColorChange: (val) => {
							setAttributes({ color: val });
						},
						isShownByDefault: true,
						resetAllFilter: () => ({
							color: undefined,
						}),
					},
					{
						colorValue: backgroundColor,
						gradientValue: backgroundGradient,
						label: __('Background', 'ghostkit'),
						onColorChange: (val) => {
							setAttributes({ backgroundColor: val });
						},
						onGradientChange: (val) => {
							setAttributes({ backgroundGradient: val });
						},
						isShownByDefault: true,
						resetAllFilter: () => ({
							backgroundColor: undefined,
							backgroundGradient: undefined,
						}),
					},
				]}
				panelId={clientId}
				{...colorGradientSettings}
			/>
		</InspectorControls>
	) : null;
}
