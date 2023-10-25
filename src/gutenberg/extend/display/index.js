/**
 * Internal dependencies
 */
import checkCoreBlock from '../check-core-block';
import {
  getActiveClass,
  replaceClass,
  addClass,
  removeClass,
  hasClass,
} from '../../utils/classes-replacer';
import useResponsive from '../../hooks/use-responsive';
import ResponsiveToggle from '../../components/responsive-toggle';
import getIcon from '../../utils/get-icon';
import ActiveIndicator from '../../components/active-indicator';
import ToggleGroup from '../../components/toggle-group';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { applyFilters, addFilter } = wp.hooks;

const { Fragment } = wp.element;

const { hasBlockSupport } = wp.blocks;

const { createHigherOrderComponent } = wp.compose;

const { InspectorControls } = wp.blockEditor;

const { PanelBody } = wp.components;

const { GHOSTKIT } = window;

let initialOpenPanel = false;

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
 * Check if block Display allowed.
 *
 * @param {object} data - block data.
 * @return {boolean} allowed Display.
 */
function allowedDisplay(data) {
  let allow = false;
  const checkSupportVar = data && data.ghostkit && data.ghostkit.supports ? data : data.name;

  if (
    hasBlockSupport(checkSupportVar, 'customClassName', true) &&
    GHOSTKIT.hasBlockSupport(checkSupportVar, 'display', false)
  ) {
    allow = true;
  }

  if (!allow) {
    allow =
      data &&
      data.attributes &&
      applyFilters('ghostkit.blocks.allowDisplay', checkCoreBlock(data.name), data, data.name);
  }

  return allow;
}

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

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom display if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent((OriginalComponent) => {
  function GhostKitDisplayWrapper(props) {
    const { attributes, setAttributes } = props;
    const { className } = attributes;

    const { device } = useResponsive();

    const allow = allowedDisplay(props);

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

    if (!allow) {
      return <OriginalComponent {...props} />;
    }

    // add new display controls.
    return (
      <Fragment>
        <OriginalComponent {...props} />
        <InspectorControls>
          <PanelBody
            title={
              <Fragment>
                <span className="ghostkit-ext-icon">{getIcon('extension-display')}</span>
                <span>{__('Display', '@@text_domain')}</span>
                {className && getActiveClass(className, 'ghostkit-d') ? <ActiveIndicator /> : ''}
              </Fragment>
            }
            initialOpen={initialOpenPanel}
            onToggle={() => {
              initialOpenPanel = !initialOpenPanel;
            }}
          >
            <ToggleGroup
              label={
                <>
                  {__('Responsive', '@@text_domain')}
                  <ResponsiveToggle
                    checkActive={(checkMedia) => {
                      return !!getCurrentDisplay(className, checkMedia);
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
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  }

  return GhostKitDisplayWrapper;
}, 'withInspectorControl');

// Init filters.
addFilter('editor.BlockEdit', 'ghostkit/display/additional-attributes', withInspectorControl);
