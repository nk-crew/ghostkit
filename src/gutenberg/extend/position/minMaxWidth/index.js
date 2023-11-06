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

const allProps = ['min-width', 'max-width'];

function PositionMinMaxWidthTools(props) {
  const { getStyle, hasStyle, setStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasMinMaxWidth = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasMinMaxWidth =
      hasMinMaxWidth || hasStyle('min-width', thisDevice) || hasStyle('max-width', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Min Max Width', '@@text_domain')}
      hasValue={() => !!hasMinMaxWidth}
      onDeselect={() => {
        const propsToReset = {};

        ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
          if (thisDevice) {
            propsToReset[`media_${thisDevice}`] = {};
          }

          if (thisDevice) {
            propsToReset[`media_${thisDevice}`]['min-width'] = undefined;
            propsToReset[`media_${thisDevice}`]['max-width'] = undefined;
          } else {
            propsToReset['min-width'] = undefined;
            propsToReset['max-width'] = undefined;
          }
        });

        setStyles(propsToReset);
      }}
      isShownByDefault={false}
    >
      <InputGroup
        label={
          <>
            {__('Min Max Width', '@@text_domain')}
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

          if (propName === 'max-width') {
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
  'ghostkit/extension/position/tools/min-max-width',
  (children, { props }) => {
    const hasMinMaxWidthSupport = hasBlockSupport(props.name, [
      'ghostkit',
      'position',
      'minMaxWidth',
    ]);

    if (!hasMinMaxWidthSupport) {
      return children;
    }

    return (
      <>
        {children}
        <PositionMinMaxWidthTools {...props} />
      </>
    );
  }
);
