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
  UnitControl: __stableUnitControl,
  __experimentalUnitControl,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;
const UnitControl = __stableUnitControl || __experimentalUnitControl;

const { hasBlockSupport } = wp.blocks;

function PositionHeightTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasHeight = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasHeight = hasHeight || hasStyle('height', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Height', '@@text_domain')}
      hasValue={() => !!hasHeight}
      onDeselect={() => {
        resetStyles(['height'], true);
      }}
      isShownByDefault={false}
    >
      <UnitControl
        label={
          <>
            {__('Height', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('height', checkMedia);
              }}
            />
          </>
        }
        value={getStyle('height', device)}
        onChange={(val) => {
          setStyles({ height: val }, device);
        }}
        labelPosition="edge"
        __unstableInputWidth="70px"
        units={[
          { value: 'px', label: 'px' },
          { value: '%', label: '%' },
          { value: 'em', label: 'em' },
          { value: 'rem', label: 'rem' },
          { value: 'vw', label: 'vw' },
          { value: 'vh', label: 'vh' },
        ]}
        min={0}
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.position.tools',
  'ghostkit/extension/position/tools/height',
  (children, { props }) => {
    const hasHeightSupport = hasBlockSupport(props.name, ['ghostkit', 'position', 'height']);

    if (!hasHeightSupport) {
      return children;
    }

    return (
      <>
        {children}
        <PositionHeightTools {...props} />
      </>
    );
  }
);
