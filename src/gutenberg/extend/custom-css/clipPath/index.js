/**
 * Internal dependencies
 */
import useStyles from '../../../hooks/use-styles';

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
  const { getStyle, hasStyle, setStyles } = useStyles(props);

  const hasClipPath = hasStyle('clip-path');

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
        if (hasStyle('clip-path')) {
          setStyles({ 'clip-path': undefined });
        }
      }}
      isShownByDefault={false}
    >
      <SelectControl
        label={__('Clip Path', '@@text_domain')}
        value={getStyle('clip-path')}
        onChange={(val) => {
          setStyles({ 'clip-path': val });
        }}
        options={optionPresets}
      />
      <br />
      <TextareaControl
        value={getStyle('clip-path')}
        onChange={(val) => {
          setStyles({ 'clip-path': val });
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
