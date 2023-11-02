/**
 * Internal dependencies
 */
import { hasClass } from '../../../utils/classes-replacer';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
  InspectorControls,
  __experimentalColorGradientSettingsDropdown: ColorGradientSettingsDropdown,
  __experimentalUseMultipleOriginColorsAndGradients: useMultipleOriginColorsAndGradients,
} = wp.blockEditor;

export default function BackgroundColor(props) {
  const { attributes, setAttributes, className, clientId } = props;
  const {
    type,
    clickAction,

    videoBackgroundColor,
    videoBackgroundGradient,

    fullscreenVideoBackgroundColor,
    fullscreenVideoBackgroundGradient,

    fullscreenBackgroundColor,
    fullscreenBackgroundGradient,
  } = attributes;

  const colorGradientSettings = useMultipleOriginColorsAndGradients();
  const hasColor = colorGradientSettings.hasColorsOrGradients;
  const hasIconOnly = hasClass(className, 'is-style-icon-only');

  const hasVideoPlain = type === 'video' && clickAction === 'plain' && !hasIconOnly;
  const hasVideoFullscreen = type === 'video' && clickAction === 'fullscreen';
  const hasFullscreen = clickAction === 'fullscreen';

  return (hasColor && hasVideoPlain) ||
    (hasColor && hasVideoFullscreen) ||
    (hasColor && type === 'yt_vm_video' && hasFullscreen) ? (
    <InspectorControls group="color">
      {/* Video plain background. */}
      {hasVideoPlain && (
        <ColorGradientSettingsDropdown
          __experimentalIsRenderedInSidebar
          settings={[
            {
              colorValue: videoBackgroundColor,
              gradientValue: videoBackgroundGradient,
              label: __('Video Background', '@@text_domain'),
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
              label: __('Video Fullscreen Background', '@@text_domain'),
              onColorChange: (val) => {
                setAttributes({ fullscreenVideoBackgroundColor: val });
              },
              onGradientChange: (val) => {
                setAttributes({ fullscreenVideoBackgroundGradient: val });
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
              label: __('Fullscreen Background', '@@text_domain'),
              onColorChange: (val) => {
                setAttributes({ fullscreenBackgroundColor: val });
              },
              onGradientChange: (val) => {
                setAttributes({ fullscreenBackgroundGradient: val });
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
