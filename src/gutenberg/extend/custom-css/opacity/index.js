/**
 * WordPress dependencies
 */
const { cloneDeep } = window.lodash;

const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const {
  RangeControl,
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

function CustomCSSOpacityTools(props) {
  const { attributes, setAttributes } = props;

  const hasOpacity = attributes?.ghostkit?.styles?.opacity;

  function updateValue(val) {
    const ghostkitData = cloneDeep(attributes?.ghostkit || {});

    if (typeof ghostkitData?.styles === 'undefined') {
      ghostkitData.styles = {};
    }
    if (typeof val === 'undefined') {
      if (typeof ghostkitData?.styles?.opacity !== 'undefined') {
        delete ghostkitData.styles.opacity;
      }
    } else {
      ghostkitData.styles.opacity = val;
    }

    setAttributes({ ghostkit: ghostkitData });
  }

  return (
    <ToolsPanelItem
      label={__('Opacity', '@@text_domain')}
      hasValue={() => !!hasOpacity}
      onSelect={() => {
        if (typeof attributes?.ghostkit?.styles?.opacity === 'undefined') {
          updateValue(1);
        }
      }}
      onDeselect={() => {
        if (typeof attributes?.ghostkit?.styles?.opacity !== 'undefined') {
          updateValue(undefined);
        }
      }}
      isShownByDefault={false}
    >
      <RangeControl
        label={__('Opacity', '@@text_domain')}
        value={attributes?.ghostkit?.styles?.opacity}
        placeholder={1}
        onChange={(val) => updateValue(val === '' ? undefined : parseFloat(val))}
        min={0}
        max={1}
        step={0.01}
        style={{ flex: 1 }}
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.customCSS.tools',
  'ghostkit/extension/customCSS/tools/opacity',
  (children, { props }) => {
    const hasOpacitySupport = hasBlockSupport(props.name, ['ghostkit', 'customCSS', 'opacity']);

    if (!hasOpacitySupport) {
      return children;
    }

    return (
      <>
        {children}
        <CustomCSSOpacityTools {...props} />
      </>
    );
  }
);
