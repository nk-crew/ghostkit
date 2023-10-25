/**
 * Internal dependencies
 */
import checkCoreBlock from '../check-core-block';
import getIcon from '../../utils/get-icon';
import useResponsive from '../../hooks/use-responsive';
import InputDrag from '../../components/input-drag';
import ResponsiveToggle from '../../components/responsive-toggle';
import ActiveIndicator from '../../components/active-indicator';

/**
 * WordPress dependencies
 */
const { merge, cloneDeep } = window.lodash;

const { __ } = wp.i18n;

const { applyFilters, addFilter } = wp.hooks;

const { Fragment, useEffect } = wp.element;

const { createHigherOrderComponent } = wp.compose;

const { InspectorControls } = wp.blockEditor;

const { BaseControl, PanelBody, CheckboxControl } = wp.components;

const { GHOSTKIT } = window;

let initialOpenPanel = false;

/**
 * Spacings Component.
 */
function SpacingsComponent(props) {
  const { attributes, setAttributes } = props;

  const { ghostkitIndents = {}, ghostkitSpacings = {} } = attributes;

  const { device } = useResponsive();

  // Mounted.
  useEffect(() => {
    // since Indents renamed to Spacings we need to migrate it.
    if (Object.keys(ghostkitIndents).length > 0 && Object.keys(ghostkitSpacings).length === 0) {
      setAttributes({
        ghostkitIndents: {},
        ghostkitSpacings: ghostkitIndents,
      });
    }
  }, []);

  /**
   * Get current spacing for selected device type.
   *
   * @param {String} name - name of spacing.
   * @param {Boolean} withDevice - get spacing for device.
   *
   * @returns {String} spacing value.
   */
  function getCurrentSpacing(name, withDevice = false) {
    let result = '';

    if (!withDevice || !device) {
      if (ghostkitSpacings[name]) {
        result = ghostkitSpacings[name];
      }
    } else if (ghostkitSpacings[`media_${device}`] && ghostkitSpacings[`media_${device}`][name]) {
      result = ghostkitSpacings[`media_${device}`][name];
    }

    return result;
  }

  /**
   * Update spacings object.
   *
   * @param {String} name - name of new spacing.
   * @param {String} val - value for new spacing.
   * @param {Boolean} withDevice - update spacing for device.
   */
  function updateSpacings(name, val, withDevice = false) {
    const result = {};
    const newSpacings = {};

    if (withDevice && device) {
      newSpacings[`media_${device}`] = {};
      newSpacings[`media_${device}`][name] = val;
    } else {
      newSpacings[name] = val;
    }

    // add default properties to keep sorting.
    const spacings = merge(
      {
        media_xl: {},
        media_lg: {},
        media_md: {},
        media_sm: {},
      },
      ghostkitSpacings,
      newSpacings
    );

    // validate values.
    Object.keys(spacings).forEach((key) => {
      if (spacings[key]) {
        // check if device object.
        if (typeof spacings[key] === 'object') {
          Object.keys(spacings[key]).forEach((keyDevice) => {
            if (spacings[key][keyDevice]) {
              if (!result[key]) {
                result[key] = {};
              }
              result[key][keyDevice] = spacings[key][keyDevice];
            }
          });
        } else {
          result[key] = spacings[key];
        }
      }
    });

    setAttributes({
      ghostkitSpacings: Object.keys(result).length ? result : '',
    });
  }

  let allow = false;

  if (
    GHOSTKIT.hasBlockSupport(props.name, 'spacings', false) ||
    GHOSTKIT.hasBlockSupport(props.name, 'indents', false)
  ) {
    allow = true;
  }

  if (!allow) {
    allow = checkCoreBlock(props.name);
    allow = applyFilters('ghostkit.blocks.allowSpacings', allow, props, props.name);
    allow = applyFilters('ghostkit.blocks.allowIndents', allow, props, props.name);
  }

  if (!allow) {
    return null;
  }

  // add new spacings controls.
  return (
    <InspectorControls group="styles">
      <PanelBody
        title={
          <Fragment>
            <span className="ghostkit-ext-icon">{getIcon('extension-spacings')}</span>
            <span>{__('Spacings', '@@text_domain')}</span>
            {ghostkitSpacings && Object.keys(ghostkitSpacings).length ? <ActiveIndicator /> : ''}
          </Fragment>
        }
        initialOpen={initialOpenPanel}
        onToggle={() => {
          initialOpenPanel = !initialOpenPanel;
        }}
      >
        <BaseControl
          label={
            <>
              {__('Responsive', '@@text_domain')}
              <ResponsiveToggle
                checkActive={(checkMedia) => {
                  return !!Object.keys(ghostkitSpacings?.[`media_${checkMedia}`] || {}).length;
                }}
              />
            </>
          }
          className="ghostkit-control-spacing"
        >
          {getIcon('icon-box')}
          <div className="ghostkit-control-spacing-margin">
            <span>{__('Margin', '@@text_domain')}</span>
            <div className="ghostkit-control-spacing-margin-top">
              <InputDrag
                value={getCurrentSpacing('marginTop', true)}
                placeholder="-"
                onChange={(nextValue) => updateSpacings('marginTop', nextValue, true)}
                autoComplete="off"
              />
            </div>
            <div className="ghostkit-control-spacing-margin-right">
              <InputDrag
                value={getCurrentSpacing('marginRight', true)}
                placeholder="-"
                onChange={(nextValue) => updateSpacings('marginRight', nextValue, true)}
                autoComplete="off"
              />
            </div>
            <div className="ghostkit-control-spacing-margin-bottom">
              <InputDrag
                value={getCurrentSpacing('marginBottom', true)}
                placeholder="-"
                onChange={(nextValue) => updateSpacings('marginBottom', nextValue, true)}
                autoComplete="off"
              />
            </div>
            <div className="ghostkit-control-spacing-margin-left">
              <InputDrag
                value={getCurrentSpacing('marginLeft', true)}
                placeholder="-"
                onChange={(nextValue) => updateSpacings('marginLeft', nextValue, true)}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="ghostkit-control-spacing-padding">
            <span>{__('Padding', '@@text_domain')}</span>
            <div className="ghostkit-control-spacing-padding-top">
              <InputDrag
                value={getCurrentSpacing('paddingTop', true)}
                placeholder="-"
                onChange={(nextValue) => updateSpacings('paddingTop', nextValue, true)}
                autoComplete="off"
              />
            </div>
            <div className="ghostkit-control-spacing-padding-right">
              <InputDrag
                value={getCurrentSpacing('paddingRight', true)}
                placeholder="-"
                onChange={(nextValue) => updateSpacings('paddingRight', nextValue, true)}
                autoComplete="off"
              />
            </div>
            <div className="ghostkit-control-spacing-padding-bottom">
              <InputDrag
                value={getCurrentSpacing('paddingBottom', true)}
                placeholder="-"
                onChange={(nextValue) => updateSpacings('paddingBottom', nextValue, true)}
                autoComplete="off"
              />
            </div>
            <div className="ghostkit-control-spacing-padding-left">
              <InputDrag
                value={getCurrentSpacing('paddingLeft', true)}
                placeholder="-"
                onChange={(nextValue) => updateSpacings('paddingLeft', nextValue, true)}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="ghostkit-control-spacing-important">
            <CheckboxControl
              label="!important"
              checked={!!getCurrentSpacing('!important', true)}
              onChange={(nextValue) => updateSpacings('!important', nextValue, true)}
            />
          </div>
        </BaseControl>
      </PanelBody>
    </InspectorControls>
  );
}

/**
 * Allow custom styles in blocks.
 *
 * @param {Boolean} allow Original block allow custom styles.
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function allowCustomStyles(allow, settings) {
  if (
    GHOSTKIT.hasBlockSupport(settings, 'spacings', false) ||
    GHOSTKIT.hasBlockSupport(settings, 'indents', false)
  ) {
    allow = true;
  }

  if (!allow) {
    allow = checkCoreBlock(settings.name);
    allow = applyFilters('ghostkit.blocks.allowSpacings', allow, settings, settings.name);
    allow = applyFilters('ghostkit.blocks.allowIndents', allow, settings, settings.name);
  }
  return allow;
}

/**
 * Extend ghostkit block attributes with spacings.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute(settings) {
  let allow = false;

  if (
    GHOSTKIT.hasBlockSupport(settings, 'spacings', false) ||
    GHOSTKIT.hasBlockSupport(settings, 'indents', false)
  ) {
    allow = true;
  }

  if (!allow) {
    allow = checkCoreBlock(settings.name);
    allow = applyFilters('ghostkit.blocks.allowSpacings', allow, settings, settings.name);
    allow = applyFilters('ghostkit.blocks.allowIndents', allow, settings, settings.name);
  }

  if (allow) {
    if (!settings.attributes.ghostkitSpacings) {
      settings.attributes.ghostkitSpacings = {
        type: 'object',
        default: '',
      };

      // add to deprecated items.
      if (settings.deprecated && settings.deprecated.length) {
        settings.deprecated.forEach((item, i) => {
          if (settings.deprecated[i].attributes) {
            settings.deprecated[i].attributes.ghostkitSpacings =
              settings.attributes.ghostkitSpacings;
          }
        });
      }
    }
    if (!settings.attributes.ghostkitIndents) {
      settings.attributes.ghostkitIndents = {
        type: 'object',
        default: '',
      };

      // add to deprecated items.
      if (settings.deprecated && settings.deprecated.length) {
        settings.deprecated.forEach((item, i) => {
          if (settings.deprecated[i].attributes) {
            settings.deprecated[i].attributes.ghostkitIndents = settings.attributes.ghostkitIndents;
          }
        });
      }
    }
  }
  return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom spacings if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent(
  (BlockEdit) =>
    function (props) {
      return (
        <Fragment>
          <BlockEdit {...props} />
          <SpacingsComponent {...props} />
        </Fragment>
      );
    },
  'withInspectorControl'
);

/**
 * Add custom styles to element in editor.
 *
 * @param {Object} customStyles Additional element styles object.
 * @param {Object} props Element props.
 *
 * @return {Object} Additional element styles object.
 */
function addEditorCustomStyles(customStyles, props) {
  let customSpacings =
    props.attributes.ghostkitSpacings && Object.keys(props.attributes.ghostkitSpacings).length !== 0
      ? cloneDeep(props.attributes.ghostkitSpacings)
      : false;

  // prepare !important tag.
  // validate values.
  const result = {};
  Object.keys(customSpacings).forEach((key) => {
    if (customSpacings[key] && key !== '!important') {
      // check if device object.
      if (typeof customSpacings[key] === 'object') {
        Object.keys(customSpacings[key]).forEach((keyDevice) => {
          if (customSpacings[key][keyDevice] && keyDevice !== '!important') {
            if (!result[key]) {
              result[key] = {};
            }
            result[key][keyDevice] =
              customSpacings[key][keyDevice] +
              (customSpacings[key]['!important'] ? ' !important' : '');
          }
        });
      } else {
        result[key] = customSpacings[key] + (customSpacings['!important'] ? ' !important' : '');
      }
    }
  });

  customSpacings = Object.keys(result).length !== 0 ? result : false;

  if (customStyles && customSpacings) {
    customStyles = merge(customStyles, customSpacings);
  }

  return customStyles;
}

// Init filters.
addFilter(
  'ghostkit.blocks.allowCustomStyles',
  'ghostkit/spacings/allow-custom-styles',
  allowCustomStyles
);
addFilter(
  'ghostkit.blocks.withCustomStyles',
  'ghostkit/spacings/additional-attributes',
  addAttribute
);
addFilter(
  'ghostkit.blocks.customStyles',
  'ghostkit/spacings/editor-custom-styles',
  addEditorCustomStyles
);
addFilter('editor.BlockEdit', 'ghostkit/spacings/additional-attributes', withInspectorControl);
