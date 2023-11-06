/**
 * Internal dependencies
 */
import ResponsiveToggle from '../../../components/responsive-toggle';
import InputGroup from '../../../components/input-group';
import InputDrag from '../../../components/input-drag';
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

const allProps = ['min-height', 'max-height'];

function PositionMinMaxHeightTools(props) {
  const { getStyle, hasStyle, setStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasMinMaxHeight = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasMinMaxHeight =
      hasMinMaxHeight || hasStyle('min-height', thisDevice) || hasStyle('max-height', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Min Max Height', '@@text_domain')}
      hasValue={() => !!hasMinMaxHeight}
      onDeselect={() => {
        const propsToReset = {};

        ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
          if (thisDevice) {
            propsToReset[`media_${thisDevice}`] = {};
          }

          if (thisDevice) {
            propsToReset[`media_${thisDevice}`]['min-height'] = undefined;
            propsToReset[`media_${thisDevice}`]['max-height'] = undefined;
          } else {
            propsToReset['min-height'] = undefined;
            propsToReset['max-height'] = undefined;
          }
        });

        setStyles(propsToReset);
      }}
      isShownByDefault={false}
    >
      <InputGroup
        label={
          <>
            {__('Min Max Height', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                let isActive = false;

                allProps.forEach((thisProp) => {
                  isActive = isActive || hasStyle(thisProp, checkMedia);
                });

                return isActive;
              }}
            />
          </>
        }
      >
        {allProps.map((propName) => {
          let label = __('Min', '@@text_domain');

          if (propName === 'max-height') {
            label = __('Max', '@@text_domain');
          }

          let value = getStyle(propName, device);

          const withImportant = / !important$/.test(value);
          if (withImportant) {
            value = value.replace(/ !important$/, '');
          }

          return (
            <div key={propName}>
              <InputDrag
                help={label}
                value={value}
                placeholder="-"
                onChange={(val) => {
                  const newValue = val ? `${val}${withImportant ? ' !important' : ''}` : undefined;

                  setStyles({ [propName]: newValue }, device);
                }}
                autoComplete="off"
              />
              <ImportantToggle
                onClick={(newWithImportant) => {
                  if (value) {
                    const newValue = `${value}${newWithImportant ? ' !important' : ''}`;

                    setStyles({ [propName]: newValue }, device);
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
  'ghostkit/extension/position/tools/min-max-height',
  (children, { props }) => {
    const hasMinMaxHeightSupport = hasBlockSupport(props.name, [
      'ghostkit',
      'position',
      'minMaxHeight',
    ]);

    if (!hasMinMaxHeightSupport) {
      return children;
    }

    return (
      <>
        {children}
        <PositionMinMaxHeightTools {...props} />
      </>
    );
  }
);
