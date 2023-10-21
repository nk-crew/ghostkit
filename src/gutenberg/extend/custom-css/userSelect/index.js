/**
 * WordPress dependencies
 */
const { cloneDeep } = window.lodash;

const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const {
  SelectControl,
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

function CustomCSSUserSelectTools(props) {
  const { attributes, setAttributes } = props;

  const hasUserSelect = attributes?.ghostkit?.styles?.['user-select'];

  function updateValue(val) {
    const ghostkitData = cloneDeep(attributes?.ghostkit || {});

    if (typeof ghostkitData?.styles === 'undefined') {
      ghostkitData.styles = {};
    }

    if (typeof val === 'undefined') {
      if (typeof ghostkitData?.styles?.['user-select'] !== 'undefined') {
        delete ghostkitData.styles['user-select'];
      }
    } else {
      ghostkitData.styles['user-select'] = val;
    }

    setAttributes({ ghostkit: ghostkitData });
  }

  return (
    <ToolsPanelItem
      label={__('User Select', '@@text_domain')}
      hasValue={() => !!hasUserSelect}
      onSelect={() => {
        if (typeof attributes?.ghostkit?.styles?.['user-select'] === 'undefined') {
          updateValue('none');
        }
      }}
      onDeselect={() => {
        if (typeof attributes?.ghostkit?.styles?.['user-select'] !== 'undefined') {
          updateValue(undefined);
        }
      }}
      isShownByDefault={false}
    >
      <SelectControl
        label={__('User Select', '@@text_domain')}
        value={attributes?.ghostkit?.styles?.['user-select']}
        onChange={(val) => {
          updateValue(val);
        }}
        options={[
          {
            value: 'none',
            label: __('None', '@@text_domain'),
          },
          {
            value: 'auto',
            label: __('Auto', '@@text_domain'),
          },
        ]}
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.customCSS.tools',
  'ghostkit/extension/customCSS/tools/userSelect',
  (children, { props }) => {
    const hasUserSelectSupport = hasBlockSupport(props.name, [
      'ghostkit',
      'customCSS',
      'userSelect',
    ]);

    if (!hasUserSelectSupport) {
      return children;
    }

    return (
      <>
        {children}
        <CustomCSSUserSelectTools {...props} />
      </>
    );
  }
);
