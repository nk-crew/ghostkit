/**
 * Internal dependencies
 */
import checkCoreBlock from '../check-core-block';
import getIcon from '../../utils/get-icon';
import Notice from '../../components/notice';
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

const {
  BaseControl,
  SelectControl,
  PanelBody,
  UnitControl: __stableUnitControl,
  __experimentalUnitControl,
} = wp.components;

const UnitControl = __stableUnitControl || __experimentalUnitControl;

const { GHOSTKIT, ghostkitVariables } = window;

let initialOpenPanel = false;

/**
 * Position Component.
 */
class PositionComponent extends Component {
  constructor(props) {
    super(props);

    this.setPosition = this.setPosition.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
  }

  /**
   * Get current position for selected device type.
   *
   * @param {String} name - name of position.
   * @param {String} device - position for device.
   *
   * @returns {String} position value.
   */
  getCurrentPosition(name, device) {
    const { ghostkitPosition = {} } = this.props.attributes;
    let result = '';

    if (!device) {
      if (ghostkitPosition[name]) {
        result = ghostkitPosition[name];
      }
    } else if (ghostkitPosition[device] && ghostkitPosition[device][name]) {
      result = ghostkitPosition[device][name];
    }

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  getNewPosition(name, val, device) {
    const newPosition = {};

    if (device) {
      newPosition[device] = {};
      newPosition[device][name] = val;
    } else {
      newPosition[name] = val;
    }

    return newPosition;
  }

  /**
   * Set new position value.
   *
   * @param {String} name - name of new position.
   * @param {String} val - value for new position.
   * @param {String} device - position for device.
   */
  setPosition(name, val, device) {
    const newPosition = this.getNewPosition(name, val, device);

    this.updatePosition(newPosition);
  }

  updatePosition(newPosition) {
    const { setAttributes } = this.props;
    let { ghostkitPosition = {} } = this.props.attributes;
    const result = {};

    // add default properties to keep sorting.
    ghostkitPosition = merge(
      {
        media_xl: {},
        media_lg: {},
        media_md: {},
        media_sm: {},
      },
      ghostkitPosition,
      newPosition
    );

    // validate values.
    Object.keys(ghostkitPosition).forEach((key) => {
      // check if device object.
      if (typeof ghostkitPosition[key] === 'object') {
        Object.keys(ghostkitPosition[key]).forEach((keyDevice) => {
          if (!result[key]) {
            result[key] = {};
          }
          result[key][keyDevice] = ghostkitPosition[key][keyDevice];
        });
      } else {
        result[key] = ghostkitPosition[key];
      }
    });

    setAttributes({
      ghostkitPosition: Object.keys(result).length ? result : '',
    });
  }

  render() {
    const { props } = this;
    let allow = false;

    const { ghostkitPosition } = props.attributes;

    if (GHOSTKIT.hasBlockSupport(props.name, 'position', false)) {
      allow = true;
    }

    if (!allow) {
      allow = checkCoreBlock(props.name);
      allow = applyFilters('ghostkit.blocks.allowPosition', allow, props, props.name);
    }

    if (!allow) {
      return null;
    }

    const filledTabs = {};
    const allPositionOptions = ['position', 'location', 'offsetY', 'offsetX', 'width', 'zIndex'];
    if (
      ghostkitVariables &&
      ghostkitVariables.media_sizes &&
      Object.keys(ghostkitVariables.media_sizes).length
    ) {
      ['all', ...Object.keys(ghostkitVariables.media_sizes)].forEach((media) => {
        filledTabs[media] = false;
        allPositionOptions.forEach((option) => {
          if (this.getCurrentPosition(option, media !== 'all' ? `media_${media}` : '')) {
            filledTabs[media] = true;
          }
        });
      });
    }

    // add new position controls.
    return (
      <InspectorControls>
        <PanelBody
          title={
            <Fragment>
              <span className="ghostkit-ext-icon">{getIcon('extension-position')}</span>
              <span>{__('Position', '@@text_domain')}</span>
              {ghostkitPosition && Object.keys(ghostkitPosition).length ? <ActiveIndicator /> : ''}
            </Fragment>
          }
          initialOpen={initialOpenPanel}
          onToggle={() => {
            initialOpenPanel = !initialOpenPanel;
          }}
        >
          {['absolute', 'fixed', 'relative'].includes(this.getCurrentPosition('position')) ? (
            <Notice status="info" isDismissible={false}>
              {__(
                'Please note! Custom positioning is not considered best practice for responsive web design and should not be used too frequently.',
                '@@text_domain'
              )}
            </Notice>
          ) : null}
          <SelectControl
            value={this.getCurrentPosition('position')}
            options={[
              {
                value: '',
                label: __('Default', '@@text_domain'),
              },
              {
                value: 'absolute',
                label: __('Absolute', '@@text_domain'),
              },
              {
                value: 'fixed',
                label: __('Fixed', '@@text_domain'),
              },
              {
                value: 'relative',
                label: __('Relative', '@@text_domain'),
              },
            ]}
            onChange={(val) => {
              let updatedPosition = this.getNewPosition('position', val);

              if (
                ['absolute', 'fixed', 'relative'].includes(val) &&
                !this.getCurrentPosition('zIndex')
              ) {
                updatedPosition = merge(updatedPosition, this.getNewPosition('zIndex', 1));
              }

              this.updatePosition(updatedPosition);
            }}
          />
          {['absolute', 'fixed', 'relative'].includes(this.getCurrentPosition('position')) ? (
            <SelectControl
              label={__('Location', '@@text_domain')}
              value={this.getCurrentPosition('location')}
              options={[
                {
                  value: 'top-left',
                  label: __('Top Left', '@@text_domain'),
                },
                {
                  value: 'top-right',
                  label: __('Top Right', '@@text_domain'),
                },
                {
                  value: 'bottom-left',
                  label: __('Bottom Left', '@@text_domain'),
                },
                {
                  value: 'bottom-right',
                  label: __('Bottom Right', '@@text_domain'),
                },
              ]}
              onChange={(nextValue) => this.setPosition('location', nextValue)}
            />
          ) : null}
          <ResponsiveTabPanel filledTabs={filledTabs}>
            {(tabData) => {
              let device = '';

              if (tabData.name !== 'all') {
                device = `media_${tabData.name}`;
              }

              return (
                <BaseControl className="ghostkit-control-position">
                  {['absolute', 'fixed', 'relative'].includes(
                    this.getCurrentPosition('position')
                  ) ? (
                    <Fragment>
                      <UnitControl
                        label={__('Vertical Offset', '@@text_domain')}
                        value={this.getCurrentPosition('offsetY', device)}
                        onChange={(val) => this.setPosition('offsetY', val, device)}
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
                      />
                      <UnitControl
                        label={__('Horizontal Offset', '@@text_domain')}
                        value={this.getCurrentPosition('offsetX', device)}
                        onChange={(val) => this.setPosition('offsetX', val, device)}
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
                      />
                      <UnitControl
                        label={__('Width', '@@text_domain')}
                        value={this.getCurrentPosition('width', device)}
                        onChange={(val) => this.setPosition('width', val, device)}
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
                    </Fragment>
                  ) : null}
                  <UnitControl
                    label={__('zIndex', '@@text_domain')}
                    value={this.getCurrentPosition('zIndex', device)}
                    onChange={(val) => this.setPosition('zIndex', parseInt(val, 10), device)}
                    labelPosition="edge"
                    __unstableInputWidth="70px"
                    disableUnits
                  />
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
  if (GHOSTKIT.hasBlockSupport(settings, 'position', false)) {
    allow = true;
  }

  if (!allow) {
    allow = checkCoreBlock(settings.name);
    allow = applyFilters('ghostkit.blocks.allowPosition', allow, settings, settings.name);
  }
  return allow;
}

/**
 * Extend ghostkit block attributes with position.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute(settings) {
  let allow = false;

  if (GHOSTKIT.hasBlockSupport(settings, 'position', false)) {
    allow = true;
  }

  if (!allow) {
    allow = checkCoreBlock(settings.name);
    allow = applyFilters('ghostkit.blocks.allowPosition', allow, settings, settings.name);
  }

  if (allow) {
    if (!settings.attributes.ghostkitPosition) {
      settings.attributes.ghostkitPosition = {
        type: 'object',
        default: '',
      };

      // add to deprecated items.
      if (settings.deprecated && settings.deprecated.length) {
        settings.deprecated.forEach((item, i) => {
          if (settings.deprecated[i].attributes) {
            settings.deprecated[i].attributes.ghostkitPosition =
              settings.attributes.ghostkitPosition;
          }
        });
      }
    }
  }
  return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom position if needed.
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
          <PositionComponent {...props} />
        </Fragment>
      );
    },
  'withInspectorControl'
);

function attributeToStyle(key, val, attributes) {
  const result = {};

  const isPositionSet =
    attributes.position && ['absolute', 'fixed', 'relative'].includes(attributes.position);
  const location = attributes.location || 'top-left';

  switch (key) {
    case 'position':
      result[key] = val;
      break;
    case 'zIndex':
      result['z-index'] = val;
      break;
    case 'offsetY':
      if (isPositionSet) {
        result[location.includes('top') ? 'top' : 'bottom'] = val;
      }
      break;
    case 'offsetX':
      if (isPositionSet) {
        result[location.includes('left') ? 'left' : 'right'] = val;
      }
      break;
    case 'width':
      if (isPositionSet) {
        result[key] = val;
      }
      break;
    // no default
  }

  return result;
}

/**
 * Add custom styles to element in editor.
 *
 * @param {Object} customStyles Additional element styles object.
 * @param {Object} props Element props.
 *
 * @return {Object} Additional element styles object.
 */
function addEditorCustomStyles(customStyles, props) {
  const position =
    props.attributes.ghostkitPosition && Object.keys(props.attributes.ghostkitPosition).length !== 0
      ? cloneDeep(props.attributes.ghostkitPosition)
      : false;

  if (!position || !Object.keys(position).length) {
    return customStyles;
  }

  let positionStyles = {};

  // prepare styles from attributes.
  Object.keys(position).forEach((key) => {
    // check if device object.
    if (typeof position[key] === 'object') {
      Object.keys(position[key]).forEach((keyDevice) => {
        if (!positionStyles[key]) {
          positionStyles[key] = {};
        }

        positionStyles[key] = {
          ...positionStyles[key],
          ...attributeToStyle(keyDevice, position[key][keyDevice], position),
        };
      });
    } else {
      positionStyles = {
        ...positionStyles,
        ...attributeToStyle(key, position[key], position),
      };
    }
  });

  positionStyles = Object.keys(positionStyles).length ? positionStyles : false;

  if (positionStyles) {
    customStyles = merge(customStyles, positionStyles);
  }

  return customStyles;
}

// Init filters.
addFilter(
  'ghostkit.blocks.allowCustomStyles',
  'ghostkit/position/allow-custom-styles',
  allowCustomStyles
);
addFilter(
  'ghostkit.blocks.withCustomStyles',
  'ghostkit/position/additional-attributes',
  addAttribute
);
addFilter(
  'ghostkit.blocks.customStyles',
  'ghostkit/position/editor-custom-styles',
  addEditorCustomStyles
);
addFilter('editor.BlockEdit', 'ghostkit/position/additional-attributes', withInspectorControl);
