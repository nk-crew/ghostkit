/**
 * Internal dependencies
 */
import checkCoreBlock from '../check-core-block';
import getIcon from '../../utils/get-icon';
import InputDrag from '../../components/input-drag';
import ResponsiveTabPanel from '../../components/responsive-tab-panel';
import ActiveIndicator from '../../components/active-indicator';

/**
 * WordPress dependencies
 */
const { merge, cloneDeep } = window.lodash;

const { __ } = wp.i18n;

const { applyFilters, addFilter } = wp.hooks;

const { Component, Fragment } = wp.element;

const { createHigherOrderComponent } = wp.compose;

const { InspectorControls } = wp.blockEditor;

const { BaseControl, PanelBody, CheckboxControl } = wp.components;

const { GHOSTKIT, ghostkitVariables } = window;

let initialOpenPanel = false;

/**
 * Spacings Component.
 */
class SpacingsComponent extends Component {
  constructor(props) {
    super(props);

    this.updateSpacings = this.updateSpacings.bind(this);
    this.getCurrentSpacing = this.getCurrentSpacing.bind(this);
  }

  componentDidMount() {
    const { attributes, setAttributes } = this.props;

    const { ghostkitIndents = {}, ghostkitSpacings = {} } = attributes;

    // since Indents renamed to Spacings we need to migrate it.
    if (Object.keys(ghostkitIndents).length > 0 && Object.keys(ghostkitSpacings).length === 0) {
      setAttributes({
        ghostkitIndents: {},
        ghostkitSpacings: ghostkitIndents,
      });
    }
  }

  /**
   * Get current spacing for selected device type.
   *
   * @param {String} name - name of spacing.
   * @param {String} device - spacing for device.
   *
   * @returns {String} spacing value.
   */
  getCurrentSpacing(name, device) {
    const { ghostkitSpacings = {} } = this.props.attributes;
    let result = '';

    if (!device) {
      if (ghostkitSpacings[name]) {
        result = ghostkitSpacings[name];
      }
    } else if (ghostkitSpacings[device] && ghostkitSpacings[device][name]) {
      result = ghostkitSpacings[device][name];
    }

    return result;
  }

  /**
   * Update spacings object.
   *
   * @param {String} name - name of new spacing.
   * @param {String} val - value for new spacing.
   * @param {String} device - spacing for device.
   */
  updateSpacings(name, val, device) {
    const { setAttributes } = this.props;
    let { ghostkitSpacings = {} } = this.props.attributes;
    const result = {};
    const newSpacings = {};

    if (device) {
      newSpacings[device] = {};
      newSpacings[device][name] = val;
    } else {
      newSpacings[name] = val;
    }

    // add default properties to keep sorting.
    ghostkitSpacings = merge(
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
    Object.keys(ghostkitSpacings).forEach((key) => {
      if (ghostkitSpacings[key]) {
        // check if device object.
        if (typeof ghostkitSpacings[key] === 'object') {
          Object.keys(ghostkitSpacings[key]).forEach((keyDevice) => {
            if (ghostkitSpacings[key][keyDevice]) {
              if (!result[key]) {
                result[key] = {};
              }
              result[key][keyDevice] = ghostkitSpacings[key][keyDevice];
            }
          });
        } else {
          result[key] = ghostkitSpacings[key];
        }
      }
    });

    setAttributes({
      ghostkitSpacings: Object.keys(result).length ? result : '',
    });
  }

  render() {
    const { props } = this;
    let allow = false;

    const { ghostkitSpacings } = props.attributes;

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

    const filledTabs = {};
    const allSpacings = [
      'marginLeft',
      'marginTop',
      'marginRight',
      'marginBottom',
      'paddingLeft',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
    ];
    if (
      ghostkitVariables &&
      ghostkitVariables.media_sizes &&
      Object.keys(ghostkitVariables.media_sizes).length
    ) {
      ['', ...Object.keys(ghostkitVariables.media_sizes)].forEach((media) => {
        filledTabs[media] = false;
        allSpacings.forEach((spacing) => {
          if (this.getCurrentSpacing(spacing, media ? `media_${media}` : '')) {
            filledTabs[media] = true;
          }
        });
      });
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
          <ResponsiveTabPanel filledTabs={filledTabs}>
            {(tabData) => {
              let device = '';

              if (tabData.name) {
                device = `media_${tabData.name}`;
              }

              return (
                <BaseControl className="ghostkit-control-spacing">
                  {getIcon('icon-box')}
                  <div className="ghostkit-control-spacing-margin">
                    <span>{__('Margin', '@@text_domain')}</span>
                    <div className="ghostkit-control-spacing-margin-top">
                      <InputDrag
                        value={this.getCurrentSpacing('marginTop', device)}
                        placeholder="-"
                        onChange={(nextValue) =>
                          this.updateSpacings('marginTop', nextValue, device)
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div className="ghostkit-control-spacing-margin-right">
                      <InputDrag
                        value={this.getCurrentSpacing('marginRight', device)}
                        placeholder="-"
                        onChange={(nextValue) =>
                          this.updateSpacings('marginRight', nextValue, device)
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div className="ghostkit-control-spacing-margin-bottom">
                      <InputDrag
                        value={this.getCurrentSpacing('marginBottom', device)}
                        placeholder="-"
                        onChange={(nextValue) =>
                          this.updateSpacings('marginBottom', nextValue, device)
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div className="ghostkit-control-spacing-margin-left">
                      <InputDrag
                        value={this.getCurrentSpacing('marginLeft', device)}
                        placeholder="-"
                        onChange={(nextValue) =>
                          this.updateSpacings('marginLeft', nextValue, device)
                        }
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="ghostkit-control-spacing-padding">
                    <span>{__('Padding', '@@text_domain')}</span>
                    <div className="ghostkit-control-spacing-padding-top">
                      <InputDrag
                        value={this.getCurrentSpacing('paddingTop', device)}
                        placeholder="-"
                        onChange={(nextValue) =>
                          this.updateSpacings('paddingTop', nextValue, device)
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div className="ghostkit-control-spacing-padding-right">
                      <InputDrag
                        value={this.getCurrentSpacing('paddingRight', device)}
                        placeholder="-"
                        onChange={(nextValue) =>
                          this.updateSpacings('paddingRight', nextValue, device)
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div className="ghostkit-control-spacing-padding-bottom">
                      <InputDrag
                        value={this.getCurrentSpacing('paddingBottom', device)}
                        placeholder="-"
                        onChange={(nextValue) =>
                          this.updateSpacings('paddingBottom', nextValue, device)
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div className="ghostkit-control-spacing-padding-left">
                      <InputDrag
                        value={this.getCurrentSpacing('paddingLeft', device)}
                        placeholder="-"
                        onChange={(nextValue) =>
                          this.updateSpacings('paddingLeft', nextValue, device)
                        }
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="ghostkit-control-spacing-important">
                    <CheckboxControl
                      label="!important"
                      checked={!!this.getCurrentSpacing('!important', device)}
                      onChange={(nextValue) => this.updateSpacings('!important', nextValue, device)}
                    />
                  </div>
                </BaseControl>
              );
            }}
          </ResponsiveTabPanel>
        </PanelBody>
      </InspectorControls>
    );
  }
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
