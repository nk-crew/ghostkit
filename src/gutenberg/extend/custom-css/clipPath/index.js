/**
 * Internal dependencies
 */
import PRESETS from './presets';

/**
 * WordPress dependencies
 */
const { cloneDeep } = window.lodash;

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
  const { attributes, setAttributes } = props;

  const hasClipPath = attributes?.ghostkit?.styles?.['clip-path'];

  function updateValue(val) {
    const ghostkitData = cloneDeep(attributes?.ghostkit || {});

    if (typeof ghostkitData?.styles === 'undefined') {
      ghostkitData.styles = {};
    }

    if (typeof val === 'undefined') {
      if (typeof ghostkitData?.styles?.['clip-path'] !== 'undefined') {
        delete ghostkitData.styles['clip-path'];
      }
    } else {
      ghostkitData.styles['clip-path'] = val;
    }

    setAttributes({ ghostkit: ghostkitData });
  }

  return (
    <ToolsPanelItem
      label={__('Clip Path', '@@text_domain')}
      hasValue={() => !!hasClipPath}
      onSelect={() => {
        if (typeof attributes?.ghostkit?.styles?.['clip-path'] === 'undefined') {
          updateValue(optionPresets[1].value);
        }
      }}
      onDeselect={() => {
        if (typeof attributes?.ghostkit?.styles?.['clip-path'] !== 'undefined') {
          updateValue(undefined);
        }
      }}
      isShownByDefault={false}
    >
      <SelectControl
        label={__('Clip Path', '@@text_domain')}
        value={attributes?.ghostkit?.styles?.['clip-path']}
        onChange={(val) => {
          updateValue(val);
        }}
        options={optionPresets}
      />
      <br />
      <TextareaControl
        value={attributes?.ghostkit?.styles?.['clip-path']}
        onChange={(val) => {
          updateValue(val);
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
