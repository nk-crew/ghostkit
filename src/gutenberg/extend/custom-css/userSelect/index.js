/**
 * Internal dependencies
 */
import useStyles from '../../../hooks/use-styles';

/**
 * WordPress dependencies
 */
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
  const { getStyle, hasStyle, setStyles } = useStyles(props);

  const hasUserSelect = hasStyle('user-select');

  return (
    <ToolsPanelItem
      label={__('User Select', '@@text_domain')}
      hasValue={() => !!hasUserSelect}
      onSelect={() => {
        if (!hasStyle('user-select')) {
          setStyles({ 'user-select': 'none' });
        }
      }}
      onDeselect={() => {
        if (hasStyle('user-select')) {
          setStyles({ 'user-select': undefined });
        }
      }}
      isShownByDefault={false}
    >
      <SelectControl
        label={__('User Select', '@@text_domain')}
        value={getStyle('user-select')}
        onChange={(val) => {
          setStyles({ 'user-select': val });
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
