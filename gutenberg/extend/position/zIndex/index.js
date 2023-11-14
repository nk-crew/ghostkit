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
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
  NumberControl: __stableNumberControl,
  __experimentalNumberControl,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;
const NumberControl = __stableNumberControl || __experimentalNumberControl;

const { hasBlockSupport } = wp.blocks;

function PositionZIndexTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasZIndex = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasZIndex = hasZIndex || hasStyle('z-index', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('zIndex', '@@text_domain')}
      hasValue={() => !!hasZIndex}
      onDeselect={() => {
        resetStyles(['z-index'], true);
      }}
      isShownByDefault={false}
    >
      <NumberControl
        label={
          <>
            {__('zIndex', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('z-index', checkMedia);
              }}
            />
          </>
        }
        value={getStyle('z-index', device)}
        onChange={(val) => {
          setStyles({ 'z-index': val }, device);
        }}
        labelPosition="edge"
        __unstableInputWidth="70px"
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.position.tools',
  'ghostkit/extension/position/tools/zIndex',
  (children, { props }) => {
    const hasZIndexSupport = hasBlockSupport(props.name, ['ghostkit', 'position', 'zIndex']);

    if (!hasZIndexSupport) {
      return children;
    }

    return (
      <>
        {children}
        <PositionZIndexTools {...props} />
      </>
    );
  }
);
