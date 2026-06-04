import {
	__experimentalColorGradientSettingsDropdown as ExperimentalColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as experimentalUseMultipleOriginColorsAndGradients,
	ColorGradientSettingsDropdown as StableColorGradientSettingsDropdown,
	InspectorControls,
	useMultipleOriginColorsAndGradients as stableUseMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { hasClass } from '../../../utils/classes-replacer';

const ColorGradientSettingsDropdown =
	StableColorGradientSettingsDropdown ||
	ExperimentalColorGradientSettingsDropdown;
const useMultipleOriginColorsAndGradients =
	stableUseMultipleOriginColorsAndGradients ||
	experimentalUseMultipleOriginColorsAndGradients ||
	(() => ({ hasColorsOrGradients: false }));

export default function BackgroundColor(props) {
	const { attributes, setAttributes, clientId } = props;
	const {
		type,
		clickAction,

		videoBackgroundColor,
		videoBackgroundGradient,

		fullscreenVideoBackgroundColor,
		fullscreenVideoBackgroundGradient,

		fullscreenBackgroundColor,
		fullscreenBackgroundGradient,

		className,
	} = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const hasColor = colorGradientSettings.hasColorsOrGradients;
	const hasIconOnly = hasClass(className, 'is-style-icon-only');

	const hasVideoPlain =
		type === 'video' && clickAction === 'plain' && !hasIconOnly;
	const hasVideoFullscreen = type === 'video' && clickAction === 'fullscreen';
	const hasFullscreen = clickAction === 'fullscreen';
	const shouldRenderControls =
		(hasColor && hasVideoPlain) ||
		(hasColor && hasVideoFullscreen) ||
		(hasColor && type === 'yt_vm_video' && hasFullscreen);

	if (!ColorGradientSettingsDropdown && shouldRenderControls) {
		return (
			<InspectorControls group="color">
				<Notice status="error" isDismissible={false}>
					{__(
						'Background color settings are unavailable because the required Gutenberg color control component is not available in this WordPress installation.',
						'ghostkit'
					)}
				</Notice>
			</InspectorControls>
		);
	}

	return shouldRenderControls ? (
		<InspectorControls group="color">
			{/* Video plain background. */}
			{hasVideoPlain && (
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={[
						{
							colorValue: videoBackgroundColor,
							gradientValue: videoBackgroundGradient,
							label: __('Video Background', 'ghostkit'),
							onColorChange: (val) => {
								setAttributes({ videoBackgroundColor: val });
							},
							onGradientChange: (val) => {
								setAttributes({ videoBackgroundGradient: val });
							},
							isShownByDefault: true,
							resetAllFilter: () => ({
								videoBackgroundColor: undefined,
								videoBackgroundGradient: undefined,
							}),
						},
					]}
					panelId={clientId}
					{...colorGradientSettings}
				/>
			)}

			{/* Video fullscreen background. */}
			{hasVideoFullscreen && (
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={[
						{
							colorValue: fullscreenVideoBackgroundColor,
							gradientValue: fullscreenVideoBackgroundGradient,
							label: __(
								'Video Fullscreen Background',
								'ghostkit'
							),
							onColorChange: (val) => {
								setAttributes({
									fullscreenVideoBackgroundColor: val,
								});
							},
							onGradientChange: (val) => {
								setAttributes({
									fullscreenVideoBackgroundGradient: val,
								});
							},
							isShownByDefault: true,
							resetAllFilter: () => ({
								fullscreenVideoBackgroundColor: undefined,
								fullscreenVideoBackgroundGradient: undefined,
							}),
						},
					]}
					panelId={clientId}
					{...colorGradientSettings}
				/>
			)}

			{/* Fullscreen background. */}
			{hasFullscreen && (
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={[
						{
							colorValue: fullscreenBackgroundColor,
							gradientValue: fullscreenBackgroundGradient,
							label: __('Fullscreen Background', 'ghostkit'),
							onColorChange: (val) => {
								setAttributes({
									fullscreenBackgroundColor: val,
								});
							},
							onGradientChange: (val) => {
								setAttributes({
									fullscreenBackgroundGradient: val,
								});
							},
							isShownByDefault: true,
							resetAllFilter: () => ({
								fullscreenBackgroundColor: undefined,
							}),
						},
					]}
					panelId={clientId}
					{...colorGradientSettings}
				/>
			)}
		</InspectorControls>
	) : null;
}
