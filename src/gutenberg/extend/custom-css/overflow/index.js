/**
 * WordPress dependencies
 */
const { cloneDeep } = window.lodash;

const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const {
  BaseControl,
  SelectControl,
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
  Grid: __stableGrid,
  __experimentalGrid,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;
const Grid = __stableGrid || __experimentalGrid;

const { hasBlockSupport } = wp.blocks;

function CustomCSSOverflowTools(props) {
  const { attributes, setAttributes } = props;

  const hasOverflow =
    attributes?.ghostkit?.styles?.['overflow-x'] || attributes?.ghostkit?.styles?.['overflow-y'];

  function getValue(prop) {
    return attributes?.ghostkit?.styles?.[prop];
  }

  function updateValue(newData) {
    const ghostkitData = cloneDeep(attributes?.ghostkit || {});

    if (typeof ghostkitData?.styles === 'undefined') {
      ghostkitData.styles = {};
    }

    Object.keys(newData).forEach((prop) => {
      if (typeof newData[prop] === 'undefined') {
        if (typeof ghostkitData?.styles?.[prop] !== 'undefined') {
          delete ghostkitData.styles[prop];
        }
      } else {
        ghostkitData.styles[prop] = newData[prop];
      }
    });

    setAttributes({ ghostkit: ghostkitData });
  }

  return (
    <ToolsPanelItem
      label={__('Overflow', '@@text_domain')}
      hasValue={() => !!hasOverflow}
      onSelect={() => {
        if (
          typeof attributes?.ghostkit?.styles?.['overflow-x'] === 'undefined' ||
          typeof attributes?.ghostkit?.styles?.['overflow-y'] === 'undefined'
        ) {
          updateValue({
            'overflow-x': 'hidden',
            'overflow-y': 'hidden',
          });
        }
      }}
      onDeselect={() => {
        if (
          typeof attributes?.ghostkit?.styles?.['overflow-x'] !== 'undefined' ||
          typeof attributes?.ghostkit?.styles?.['overflow-y'] !== 'undefined'
        ) {
          updateValue({
            'overflow-x': undefined,
            'overflow-y': undefined,
          });
        }
      }}
      isShownByDefault={false}
    >
      <BaseControl label={__('Overflow', '@@text_domain')}>
        <Grid columns={2}>
          <SelectControl
            help={__('X', '@@text_domain')}
            value={getValue('overflow-x')}
            onChange={(val) => {
              updateValue({ 'overflow-x': val });
            }}
            options={[
              {
                value: 'hidden',
                label: __('Hidden', '@@text_domain'),
              },
              {
                value: 'visible',
                label: __('Visible', '@@text_domain'),
              },
              {
                value: 'auto',
                label: __('Auto', '@@text_domain'),
              },
            ]}
          />
          <SelectControl
            help={__('Y', '@@text_domain')}
            value={getValue('overflow-y')}
            onChange={(val) => {
              updateValue({ 'overflow-y': val });
            }}
            options={[
              {
                value: 'hidden',
                label: __('Hidden', '@@text_domain'),
              },
              {
                value: 'visible',
                label: __('Visible', '@@text_domain'),
              },
              {
                value: 'auto',
                label: __('Auto', '@@text_domain'),
              },
            ]}
          />
        </Grid>
      </BaseControl>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.customCSS.tools',
  'ghostkit/extension/customCSS/tools/overflow',
  (children, { props }) => {
    const hasOverflowSupport = hasBlockSupport(props.name, ['ghostkit', 'customCSS', 'overflow']);

    if (!hasOverflowSupport) {
      return children;
    }

    return (
      <>
        {children}
        <CustomCSSOverflowTools {...props} />
      </>
    );
  }
);
