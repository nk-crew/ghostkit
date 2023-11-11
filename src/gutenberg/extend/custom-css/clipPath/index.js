/**
 * Internal dependencies
 */
import ResponsiveToggle from '../../../components/responsive-toggle';
import useStyles from '../../../hooks/use-styles';
import useResponsive from '../../../hooks/use-responsive';

import PRESETS from './presets';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const {
  SelectControl,
  TextareaControl,
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

const optionPresets = [
  {
    value: '',
    label: __('Custom', '@@text_domain'),
  },
  ...Object.keys(PRESETS).map((value) => {
    return {
      value,
      label: PRESETS[value],
    };
  }),
];

function CustomCSSClipPathTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasClipPath = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasClipPath = hasClipPath || hasStyle('clip-path', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Clip Path', '@@text_domain')}
      hasValue={() => !!hasClipPath}
      onSelect={() => {
        if (!hasStyle('clip-path')) {
          setStyles({ 'clip-path': optionPresets[1].value });
        }
      }}
      onDeselect={() => {
        resetStyles(['clip-path'], true);
      }}
      isShownByDefault={false}
    >
      <SelectControl
        label={
          <>
            {__('Clip Path', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('clip-path', checkMedia);
              }}
            />
          </>
        }
        value={getStyle('clip-path', device)}
        onChange={(val) => {
          setStyles({ 'clip-path': val }, device);
        }}
        options={optionPresets}
      />
      <br />
      <TextareaControl
        value={getStyle('clip-path', device)}
        onChange={(val) => {
          setStyles({ 'clip-path': val }, device);
        }}
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.customCSS.tools',
  'ghostkit/extension/customCSS/tools/clipPath',
  (children, { props }) => {
    const hasClipPathSupport = hasBlockSupport(props.name, ['ghostkit', 'customCSS', 'clipPath']);

    if (!hasClipPathSupport) {
      return children;
    }

    return (
      <>
        {children}
        <CustomCSSClipPathTools {...props} />
      </>
    );
  }
);
