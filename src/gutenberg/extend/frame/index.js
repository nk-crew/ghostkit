/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import InputDrag from '../../components/input-drag';
import ColorPicker from '../../components/color-picker';
import ResponsiveTabPanel from '../../components/responsive-tab-panel';
import ActiveIndicator from '../../components/active-indicator';
import ToggleGroup from '../../components/toggle-group';
import { hasClass, removeClass, addClass } from '../../utils/classes-replacer';

/**
 * WordPress dependencies
 */
const { merge, cloneDeep } = window.lodash;

const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { Fragment } = wp.element;

const { createHigherOrderComponent } = wp.compose;

const { InspectorControls } = wp.blockEditor;

const { BaseControl, PanelBody, TabPanel, Tooltip } = wp.components;

const { GHOSTKIT, ghostkitVariables } = window;

let initialOpenPanel = false;

// Check supported blocks.
function checkSupportedBlock(name) {
  if (GHOSTKIT.hasBlockSupport(name, 'frame', false)) {
    return true;
  }

  return name && /^core\/group/.test(name.name || name);
}

/**
 * Frame Component.
 */
function FrameComponent(props) {
  const { attributes, setAttributes } = props;
  const { className = '' } = attributes;

  let { ghostkitFrame = {} } = attributes;

  /**
   * Get current frame setting for selected device type.
   *
   * @param {String} name - name of frame setting.
   * @param {String} device - frame setting for device.
   *
   * @returns {String} frame setting value.
   */
  function getCurrentFrame(name, device) {
    let result = '';

    if (!device) {
      if (ghostkitFrame[name]) {
        result = ghostkitFrame[name];
      }
    } else if (ghostkitFrame[device] && ghostkitFrame[device][name]) {
      result = ghostkitFrame[device][name];
    }

    return result;
  }

  /**
   * Update frame settings object.
   *
   * @param {Object} data - new attributes object.
   * @param {String} device - frame setting for device.
   */
  function updateFrame(data, device) {
    const result = {};
    const newFrame = {};

    Object.keys(data).forEach((name) => {
      if (device) {
        if (!newFrame[device]) {
          newFrame[device] = {};
        }
        newFrame[device][name] = data[name];
      } else {
        newFrame[name] = data[name];
      }
    });

    // add default properties to keep sorting.
    ghostkitFrame = merge(
      {
        media_xl: {},
        media_lg: {},
        media_md: {},
        media_sm: {},
      },
      ghostkitFrame,
      newFrame
    );

    // validate values.
    Object.keys(ghostkitFrame).forEach((key) => {
      if (ghostkitFrame[key]) {
        // check if device object.
        if (typeof ghostkitFrame[key] === 'object') {
          Object.keys(ghostkitFrame[key]).forEach((keyDevice) => {
            if (ghostkitFrame[key][keyDevice]) {
              if (!result[key]) {
                result[key] = {};
              }
              result[key][keyDevice] = ghostkitFrame[key][keyDevice];
            }
          });
        } else {
          result[key] = ghostkitFrame[key];
        }
      }
    });

    const hasFrameAttrs = Object.keys(result).length;
    const resultAttrs = {
      ghostkitFrame: hasFrameAttrs ? result : '',
    };

    // additional classname for blocks with frame styles.
    if (hasFrameAttrs && !hasClass(className, 'ghostkit-has-frame')) {
      resultAttrs.className = addClass(className, 'ghostkit-has-frame');
    } else if (!hasFrameAttrs && hasClass(className, 'ghostkit-has-frame')) {
      resultAttrs.className = removeClass(className, 'ghostkit-has-frame');
    }

    setAttributes(resultAttrs);
  }

  const allow = checkSupportedBlock(props.name);

  if (!allow) {
    return null;
  }

  const activeDevices = {};
  const allFrame = [
    'borderStyle',
    'borderWidth',
    'borderColor',
    'boxShadowColor',
    'boxShadowX',
    'boxShadowY',
    'boxShadowBlur',
    'boxShadowSpread',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
    'hoverBorderStyle',
    'hoverBorderWidth',
    'hoverBorderColor',
    'hoverBoxShadowColor',
    'hoverBoxShadowX',
    'hoverBoxShadowY',
    'hoverBoxShadowBlur',
    'hoverBoxShadowSpread',
    'hoverBorderTopLeftRadius',
    'hoverBorderTopRightRadius',
    'hoverBorderBottomRightRadius',
    'hoverBorderBottomLeftRadius',
  ];
  if (
    ghostkitVariables &&
    ghostkitVariables.media_sizes &&
    Object.keys(ghostkitVariables.media_sizes).length
  ) {
    ['', ...Object.keys(ghostkitVariables.media_sizes)].forEach((media) => {
      activeDevices[media] = false;
      allFrame.forEach((spacing) => {
        if (getCurrentFrame(spacing, media ? `media_${media}` : '')) {
          activeDevices[media] = true;
        }
      });
    });
  }

  const stateTabs = [
    {
      name: 'normal',
      title: __('Normal', '@@text_domain'),
      className: 'ghostkit-control-tabs-tab',
    },
    {
      name: 'hover',
      title: __('Hover', '@@text_domain'),
      className: 'ghostkit-control-tabs-tab',
    },
  ];

  const borderStyles = [
    {
      value: 'solid',
      label: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 11.25H19V12.75H5V11.25Z" fill="currentColor" />
        </svg>
      ),
    },
    {
      value: 'dashed',
      label: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 11.25H8V12.75H5V11.25ZM10.5 11.25H13.5V12.75H10.5V11.25ZM19 11.25H16V12.75H19V11.25Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      value: 'dotted',
      label: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.25 11.25H6.75V12.75H5.25V11.25ZM8.25 11.25H9.75V12.75H8.25V11.25ZM12.75 11.25H11.25V12.75H12.75V11.25ZM14.25 11.25H15.75V12.75H14.25V11.25ZM18.75 11.25H17.25V12.75H18.75V11.25Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      value: 'double',
      label: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 9.25H19V10.75H5V9.25Z" fill="currentColor" />
          <path d="M5 13H19V14.5H5V13Z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  // add new frame controls.
  return (
    <InspectorControls group="styles">
      <PanelBody
        title={
          <Fragment>
            <span className="ghostkit-ext-icon">{getIcon('extension-frame')}</span>
            <span>{__('Frame', '@@text_domain')}</span>
            {ghostkitFrame && Object.keys(ghostkitFrame).length ? <ActiveIndicator /> : ''}
          </Fragment>
        }
        initialOpen={initialOpenPanel}
        onToggle={() => {
          initialOpenPanel = !initialOpenPanel;
        }}
      >
        <ResponsiveTabPanel active={activeDevices}>
          {(tabData) => {
            let device = '';

            if (tabData.name) {
              device = `media_${tabData.name}`;
            }

            return (
              <TabPanel
                className="ghostkit-control-tabs ghostkit-control-tabs-wide ghostkit-extension-frame-tabs"
                tabs={stateTabs}
              >
                {(stateTabData) => {
                  const isHover = stateTabData.name === 'hover';
                  const borderPropName = `${isHover ? 'hoverBorder' : 'border'}`;
                  const shadowPropName = `${isHover ? 'hoverBoxShadow' : 'boxShadow'}`;
                  const borderStyle = getCurrentFrame(`${borderPropName}Style`, device);

                  return (
                    <Fragment>
                      <ToggleGroup
                        label={__('Border', '@@text_domain')}
                        value={borderStyle}
                        options={borderStyles}
                        onChange={(value) => {
                          if (value && value !== borderStyle) {
                            updateFrame(
                              {
                                [`${borderPropName}Style`]: value === 'none' ? '' : value,
                              },
                              device
                            );
                          } else {
                            updateFrame(
                              {
                                [`${borderPropName}Style`]: '',
                                [`${borderPropName}Color`]: '',
                                [`${borderPropName}Width`]: '',
                              },
                              device
                            );
                          }
                        }}
                        className="ghostkit-control-border-style"
                        isDeselectable
                      />
                      {borderStyle ? (
                        <div className="ghostkit-control-border-additional">
                          <Tooltip text={__('Border Color', '@@text_domain')}>
                            <div>
                              <ColorPicker
                                value={getCurrentFrame(`${borderPropName}Color`, device)}
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${borderPropName}Color`]: val,
                                    },
                                    device
                                  )
                                }
                                alpha
                              />
                            </div>
                          </Tooltip>
                          <Tooltip text={__('Border Size', '@@text_domain')}>
                            <div>
                              <InputDrag
                                value={getCurrentFrame(`${borderPropName}Width`, device)}
                                placeholder={__('Border Size', '@@text_domain')}
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${borderPropName}Width`]: val,
                                    },
                                    device
                                  )
                                }
                                startDistance={1}
                                autoComplete="off"
                              />
                            </div>
                          </Tooltip>
                        </div>
                      ) : (
                        ''
                      )}
                      <BaseControl label={__('Border Radius', '@@text_domain')}>
                        <div className="ghostkit-control-radius">
                          <Tooltip text={__('Top Left', '@@text_domain')}>
                            <div>
                              <InputDrag
                                value={getCurrentFrame(`${borderPropName}TopLeftRadius`, device)}
                                placeholder="-"
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${borderPropName}TopLeftRadius`]: val,
                                    },
                                    device
                                  )
                                }
                                autoComplete="off"
                                className="ghostkit-control-radius-tl"
                              />
                            </div>
                          </Tooltip>
                          <Tooltip text={__('Top Right', '@@text_domain')}>
                            <div>
                              <InputDrag
                                value={getCurrentFrame(`${borderPropName}TopRightRadius`, device)}
                                placeholder="-"
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${borderPropName}TopRightRadius`]: val,
                                    },
                                    device
                                  )
                                }
                                autoComplete="off"
                                className="ghostkit-control-radius-tr"
                              />
                            </div>
                          </Tooltip>
                          <Tooltip text={__('Bottom Right', '@@text_domain')}>
                            <div>
                              <InputDrag
                                value={getCurrentFrame(
                                  `${borderPropName}BottomRightRadius`,
                                  device
                                )}
                                placeholder="-"
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${borderPropName}BottomRightRadius`]: val,
                                    },
                                    device
                                  )
                                }
                                autoComplete="off"
                                className="ghostkit-control-radius-br"
                              />
                            </div>
                          </Tooltip>
                          <Tooltip text={__('Bottom Left', '@@text_domain')}>
                            <div>
                              <InputDrag
                                value={getCurrentFrame(`${borderPropName}BottomLeftRadius`, device)}
                                placeholder="-"
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${borderPropName}BottomLeftRadius`]: val,
                                    },
                                    device
                                  )
                                }
                                autoComplete="off"
                                className="ghostkit-control-radius-bl"
                              />
                            </div>
                          </Tooltip>
                        </div>
                      </BaseControl>
                      <BaseControl label={__('Shadow', '@@text_domain')}>
                        <div className="ghostkit-control-box-shadow">
                          <Tooltip text={__('Color', '@@text_domain')}>
                            <div>
                              <ColorPicker
                                value={getCurrentFrame(`${shadowPropName}Color`, device)}
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${shadowPropName}Color`]: val,
                                    },
                                    device
                                  )
                                }
                                alpha
                              />
                            </div>
                          </Tooltip>
                          <Tooltip text={__('X', '@@text_domain')}>
                            <div>
                              <InputDrag
                                value={getCurrentFrame(`${shadowPropName}X`, device)}
                                placeholder={__('X', '@@text_domain')}
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${shadowPropName}X`]: val,
                                    },
                                    device
                                  )
                                }
                                startDistance={1}
                                autoComplete="off"
                                className="ghostkit-control-box-shadow-x"
                              />
                            </div>
                          </Tooltip>
                          <Tooltip text={__('Y', '@@text_domain')}>
                            <div>
                              <InputDrag
                                value={getCurrentFrame(`${shadowPropName}Y`, device)}
                                placeholder={__('Y', '@@text_domain')}
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${shadowPropName}Y`]: val,
                                    },
                                    device
                                  )
                                }
                                startDistance={1}
                                autoComplete="off"
                                className="ghostkit-control-box-shadow-y"
                              />
                            </div>
                          </Tooltip>
                          <Tooltip text={__('Blur', '@@text_domain')}>
                            <div>
                              <InputDrag
                                value={getCurrentFrame(`${shadowPropName}Blur`, device)}
                                placeholder={__('Blur', '@@text_domain')}
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${shadowPropName}Blur`]: val,
                                    },
                                    device
                                  )
                                }
                                startDistance={1}
                                autoComplete="off"
                                className="ghostkit-control-box-shadow-blur"
                              />
                            </div>
                          </Tooltip>
                          <Tooltip text={__('Spread', '@@text_domain')}>
                            <div>
                              <InputDrag
                                value={getCurrentFrame(`${shadowPropName}Spread`, device)}
                                placeholder={__('Spread', '@@text_domain')}
                                onChange={(val) =>
                                  updateFrame(
                                    {
                                      [`${shadowPropName}Spread`]: val,
                                    },
                                    device
                                  )
                                }
                                startDistance={1}
                                autoComplete="off"
                                className="ghostkit-control-box-shadow-spread"
                              />
                            </div>
                          </Tooltip>
                        </div>
                      </BaseControl>
                    </Fragment>
                  );
                }}
              </TabPanel>
            );
          }}
        </ResponsiveTabPanel>
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
  if (!allow) {
    allow = checkSupportedBlock(settings);
  }
  return allow;
}

/**
 * Extend ghostkit block attributes with frame settings.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute(settings) {
  const allow = checkSupportedBlock(settings);

  if (allow) {
    if (!settings.attributes.ghostkitFrame) {
      settings.attributes.ghostkitFrame = {
        type: 'object',
        default: '',
      };

      // add to deprecated items.
      if (settings.deprecated && settings.deprecated.length) {
        settings.deprecated.forEach((item, i) => {
          if (settings.deprecated[i].attributes) {
            settings.deprecated[i].attributes.ghostkitFrame = settings.attributes.ghostkitFrame;
          }
        });
      }
    }
  }
  return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom frame settings if needed.
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
          <FrameComponent {...props} />
        </Fragment>
      );
    },
  'withInspectorControl'
);

/**
 * Add `px` suffix to number string.
 *
 * @param {String} str string.
 *
 * @return {String} string with pixels.
 */
function addPixelsToString(str) {
  // add pixels.
  if (typeof str === 'string' && str !== '0' && /^[0-9.-]*$/.test(str)) {
    str += 'px';
  }

  return str;
}

/**
 * Prepare attributes for shadow.
 *
 * @param {Object} attrs frame attributes.
 *
 * @return {Object} updated attributes.
 */
function prepareShadow(attrs) {
  // check if device object.
  Object.keys(attrs).forEach((key) => {
    if (attrs[key] && typeof attrs[key] === 'object') {
      attrs[key] = prepareShadow(attrs[key]);
    }
  });

  // prepare new style.
  if (attrs.boxShadowColor) {
    attrs.boxShadow = `${attrs.boxShadowColor} ${addPixelsToString(
      attrs.boxShadowX || '0'
    )} ${addPixelsToString(attrs.boxShadowY || '0')} ${addPixelsToString(
      attrs.boxShadowBlur || '0'
    )} ${addPixelsToString(attrs.boxShadowSpread || '0')}`;
  }
  if (attrs.hoverBoxShadowColor) {
    attrs.hoverBoxShadow = `${attrs.hoverBoxShadowColor} ${addPixelsToString(
      attrs.hoverBoxShadowX || '0'
    )} ${addPixelsToString(attrs.hoverBoxShadowY || '0')} ${addPixelsToString(
      attrs.hoverBoxShadowBlur || '0'
    )} ${addPixelsToString(attrs.hoverBoxShadowSpread || '0')}`;
  }

  // remove unused attributes.
  const shadowAttrs = [
    'boxShadowColor',
    'boxShadowX',
    'boxShadowY',
    'boxShadowBlur',
    'boxShadowSpread',
    'hoverBoxShadowColor',
    'hoverBoxShadowX',
    'hoverBoxShadowY',
    'hoverBoxShadowBlur',
    'hoverBoxShadowSpread',
  ];
  shadowAttrs.forEach((shadowAttr) => {
    if (typeof attrs[shadowAttr] !== 'undefined') {
      delete attrs[shadowAttr];
    }
  });

  return attrs;
}

/**
 * Prepare styles for frame.
 *
 * @param {String} key prop name.
 * @param {String} val prop val.
 *
 * @return {Object|String} result styles.
 */
function prepareStyle(key, val) {
  // Hover styles
  if (/^hover/g.test(key)) {
    key = key.replace(/^hover/g, '');
    key = key.charAt(0).toLowerCase() + key.slice(1);

    return {
      '&:hover': {
        [key]: val,
      },
    };
  }

  return {
    [key]: val,
  };
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
  let customFrame =
    props.attributes.ghostkitFrame && Object.keys(props.attributes.ghostkitFrame).length !== 0
      ? cloneDeep(props.attributes.ghostkitFrame)
      : false;

  // prepare shadow.
  customFrame = prepareShadow(customFrame);

  // validate values.
  let result = {};
  Object.keys(customFrame).forEach((key) => {
    if (customFrame[key]) {
      // check if device object.
      if (typeof customFrame[key] === 'object') {
        Object.keys(customFrame[key]).forEach((keyDevice) => {
          if (customFrame[key][keyDevice]) {
            result = merge(result, {
              [key]: prepareStyle(keyDevice, customFrame[key][keyDevice]),
            });
          }
        });
      } else {
        result = merge(result, prepareStyle(key, customFrame[key]));
      }
    }
  });

  customFrame = Object.keys(result).length !== 0 ? result : false;

  if (customStyles && customFrame) {
    customStyles = merge(customStyles, customFrame);
  }

  return customStyles;
}

// Init filters.
addFilter(
  'ghostkit.blocks.allowCustomStyles',
  'ghostkit/frame/allow-custom-styles',
  allowCustomStyles
);
addFilter('ghostkit.blocks.withCustomStyles', 'ghostkit/frame/additional-attributes', addAttribute);
addFilter(
  'ghostkit.blocks.customStyles',
  'ghostkit/frame/editor-custom-styles',
  addEditorCustomStyles
);
addFilter('editor.BlockEdit', 'ghostkit/frame/additional-attributes', withInspectorControl);
