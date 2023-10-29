/**
 * Internal dependencies
 */
import ResponsiveToggle from '../../../components/responsive-toggle';
import useStyles from '../../../hooks/use-styles';
import useResponsive from '../../../hooks/use-responsive';

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

  const { device, allDevices } = useResponsive();

  let hasUserSelect = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasUserSelect = hasUserSelect || hasStyle('user-select', thisDevice);
  });

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
        const propsToReset = {};

        ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
          if (thisDevice) {
            propsToReset[`media_${thisDevice}`] = {};
          }

          if (thisDevice) {
            propsToReset[`media_${thisDevice}`]['user-select'] = undefined;
          } else {
            propsToReset['user-select'] = undefined;
          }
        });

        setStyles(propsToReset);
      }}
      isShownByDefault={false}
    >
      <SelectControl
        label={
          <>
            {__('User Select', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('user-select', checkMedia);
              }}
            />
          </>
        }
        value={getStyle('user-select', device)}
        onChange={(val) => {
          setStyles({ 'user-select': val }, device);
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
