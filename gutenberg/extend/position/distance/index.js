/**
 * Internal dependencies
 */
import InputGroup from '../../../components/input-group';
import InputDrag from '../../../components/input-drag';
import ResponsiveToggle from '../../../components/responsive-toggle';
import ImportantToggle from '../../../components/important-toggle';
import useStyles from '../../../hooks/use-styles';
import useResponsive from '../../../hooks/use-responsive';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { ToolsPanelItem: __stableToolsPanelItem, __experimentalToolsPanelItem } = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

const allDistances = ['top', 'right', 'bottom', 'left'];

function PositionDistanceTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasDistance = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    allDistances.forEach((thisDistance) => {
      hasDistance = hasDistance || hasStyle(thisDistance, thisDevice);
    });
  });

  return (
    <ToolsPanelItem
      label={__('Distance', '@@text_domain')}
      hasValue={() => !!hasDistance}
      onDeselect={() => {
        resetStyles(allDistances, true);
      }}
      isShownByDefault={false}
    >
      <InputGroup
        label={
          <>
            {__('Distance', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                let isActive = false;

                allDistances.forEach((thisDistance) => {
                  isActive = isActive || hasStyle(thisDistance, checkMedia);
                });

                return isActive;
              }}
            />
          </>
        }
      >
        {allDistances.map((distanceName) => {
          let label = __('Top', '@@text_domain');

          switch (distanceName) {
            case 'right':
              label = __('Right', '@@text_domain');
              break;
            case 'bottom':
              label = __('Bottom', '@@text_domain');
              break;
            case 'left':
              label = __('Left', '@@text_domain');
              break;
            // no default
          }

          let value = getStyle(distanceName, device);

          const withImportant = / !important$/.test(value);
          if (withImportant) {
            value = value.replace(/ !important$/, '');
          }

          return (
            <div key={distanceName}>
              <InputDrag
                help={label}
                value={value}
                placeholder="-"
                onChange={(val) => {
                  const newValue = val ? `${val}${withImportant ? ' !important' : ''}` : undefined;

                  setStyles({ [distanceName]: newValue }, device);
                }}
                autoComplete="off"
              />
              <ImportantToggle
                onClick={(newWithImportant) => {
                  if (value) {
                    const newValue = `${value}${newWithImportant ? ' !important' : ''}`;

                    setStyles({ [distanceName]: newValue }, device);
                  }
                }}
                isActive={withImportant}
              />
            </div>
          );
        })}
      </InputGroup>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.position.tools',
  'ghostkit/extension/position/tools/distance',
  (children, { props }) => {
    const hasDistanceSupport = hasBlockSupport(props.name, ['ghostkit', 'position', 'distance']);

    if (!hasDistanceSupport) {
      return children;
    }

    return (
      <>
        {children}
        <PositionDistanceTools {...props} />
      </>
    );
  }
);
