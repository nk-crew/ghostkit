/**
 * Internal dependencies
 */
import {
  getActiveClass,
  replaceClass,
  addClass,
  removeClass,
  hasClass,
} from '../../../utils/classes-replacer';
import ResponsiveToggle from '../../../components/responsive-toggle';
import ToggleGroup from '../../../components/toggle-group';
import useResponsive from '../../../hooks/use-responsive';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { ToolsPanelItem: __stableToolsPanelItem, __experimentalToolsPanelItem } = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

/**
 * Get array for Select element.
 *
 * @param {String} screen - screen size
 *
 * @returns {Array} array for Select.
 */
const getDefaultDisplay = function (screen = '') {
  return [
    {
      label: !screen ? __('Default', '@@text_domain') : __('Inherit', '@@text_domain'),
      value: '',
    },
    {
      label: __('Show', '@@text_domain'),
      value: 'block',
    },
    {
      label: __('Hide', '@@text_domain'),
      value: 'none',
    },
  ];
};

/**
 * Get current display for selected screen size.
 *
 * @param {String} className - block className.
 * @param {String} screen - name of screen size.
 *
 * @returns {String} display value.
 */
function getCurrentDisplay(className, screen) {
  if (!screen) {
    if (hasClass(className, 'ghostkit-d-none')) {
      return 'none';
    }
    if (hasClass(className, 'ghostkit-d-block')) {
      return 'block';
    }
  }

  return getActiveClass(className, `ghostkit-d-${screen}`, true);
}

function DisplayScreenSizeTools(props) {
  const { attributes, setAttributes } = props;
  const { className } = attributes;

  const { device, allDevices } = useResponsive();

  let hasDisplayScreenSize = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasDisplayScreenSize = hasDisplayScreenSize || getCurrentDisplay(className, thisDevice);
  });

  /**
   * Update display object.
   *
   * @param {String} screen - name of screen size.
   * @param {String} val - value for new display.
   */
  function updateDisplay(screen, val) {
    let newClassName = className;

    if (screen) {
      newClassName = replaceClass(newClassName, `ghostkit-d-${screen}`, val);
    } else {
      newClassName = removeClass(newClassName, 'ghostkit-d-none');
      newClassName = removeClass(newClassName, 'ghostkit-d-block');

      if (val) {
        newClassName = addClass(newClassName, `ghostkit-d-${val}`);
      }
    }

    setAttributes({
      className: newClassName,
    });
  }

  return (
    <ToolsPanelItem
      label={__('Screen Size', '@@text_domain')}
      hasValue={() => !!hasDisplayScreenSize}
      onDeselect={() => {
        let newClassName = className;

        ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
          if (thisDevice) {
            newClassName = removeClass(newClassName, `ghostkit-d-${thisDevice}-none`);
            newClassName = removeClass(newClassName, `ghostkit-d-${thisDevice}-block`);
          } else {
            newClassName = removeClass(newClassName, 'ghostkit-d-none');
            newClassName = removeClass(newClassName, 'ghostkit-d-block');
          }
        });

        setAttributes({
          className: newClassName,
        });
      }}
      isShownByDefault={false}
    >
      <ToggleGroup
        label={
          <>
            {__('Screen Size', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return (
                  hasClass(className, `ghostkit-d-${checkMedia}-none`) ||
                  hasClass(className, `ghostkit-d-${checkMedia}-block`)
                );
              }}
            />
          </>
        }
        value={getCurrentDisplay(className, device)}
        options={getDefaultDisplay(device).map((val) => ({
          value: val.value,
          label: val.label,
        }))}
        onChange={(value) => {
          updateDisplay(device, value);
        }}
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.display.tools',
  'ghostkit/extension/display/tools/screenSize',
  (children, { props }) => {
    const hasDisplayScreenSizeSupport = hasBlockSupport(props.name, [
      'ghostkit',
      'display',
      'screenSize',
    ]);
    const hasCustomClassNameSupport = hasBlockSupport(props.name, 'customClassName', true);

    if (!hasDisplayScreenSizeSupport || !hasCustomClassNameSupport) {
      return children;
    }

    return (
      <>
        {children}
        <DisplayScreenSizeTools {...props} />
      </>
    );
  }
);
