/* eslint-disable max-classes-per-file */
/**
 * Internal dependencies
 */
import checkCoreBlock from '../../check-core-block';
import getIcon from '../../../utils/get-icon';
import ActiveIndicator from '../../../components/active-indicator';
import ToggleGroup from '../../../components/toggle-group';

import parseSRConfig from './parse-sr-config';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { applyFilters, addFilter } = wp.hooks;

const { hasBlockSupport } = wp.blocks;

const { useEffect, useState } = wp.element;

const { createHigherOrderComponent } = wp.compose;

const { InspectorControls } = wp.blockEditor;

const { BaseControl, PanelBody, TextControl, Button } = wp.components;

const { GHOSTKIT } = window;

let initialOpenPanel = false;

/**
 * Check if block SR allowed.
 *
 * @param {object} data - block data.
 * @return {boolean} allowed SR.
 */
function allowedSR(data) {
  let allow = false;
  const checkSupportVar = data && data.ghostkit && data.ghostkit.supports ? data : data.name;

  if (GHOSTKIT.hasBlockSupport(checkSupportVar, 'scrollReveal', false)) {
    allow = true;
  }

  if (!allow) {
    allow =
      data &&
      data.attributes &&
      applyFilters('ghostkit.blocks.allowScrollReveal', checkCoreBlock(data.name), data, data.name);
  }

  return allow;
}

/**
 * Extend ghostkit block attributes with SR.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute(settings) {
  const allow = allowedSR(settings);

  if (allow) {
    if (!settings.attributes.ghostkitSR) {
      settings.attributes.ghostkitSR = {
        type: 'string',
        default: '',
      };

      // add to deprecated items.
      if (settings.deprecated && settings.deprecated.length) {
        settings.deprecated.forEach((item, i) => {
          if (settings.deprecated[i].attributes) {
            settings.deprecated[i].attributes.ghostkitSR = settings.attributes.ghostkitSR;
          }
        });
      }
    }
  }
  return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom attribute if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent((OriginalComponent) => {
  function GhostKitSRWrapper(props) {
    const { attributes, setAttributes, name } = props;
    const { ghostkitSR = '' } = attributes;

    const [srData, setSrData] = useState({
      effect: '',
      direction: '',
      distance: 50,
      scale: 0.9,
      duration: 900,
      delay: 0,
    });

    const hasNewRevealSupport = hasBlockSupport(name, ['ghostkit', 'effects', 'reveal']);

    useEffect(() => {
      const newSrData = { ...srData };

      // parse data from string.
      // fade-right;duration:500;delay:1000;distance:60px;scale:0.8
      const data = ghostkitSR.split(';');

      let effect = data[0];
      if (effect) {
        let direction = effect.split('-');
        if (direction.length === 2) {
          // eslint-disable-next-line prefer-destructuring
          effect = direction[0];
          // eslint-disable-next-line prefer-destructuring
          direction = direction[1];
        } else {
          direction = '';
        }

        newSrData.effect = effect;
        newSrData.direction = direction;

        // replace other data config.
        if (data.length > 1) {
          data.forEach((item) => {
            const itemData = item.split(':');
            if (itemData.length === 2) {
              const revealName = itemData[0];
              const val = itemData[1];
              newSrData[revealName] = val;
            }
          });
        }

        newSrData.distance = parseFloat(newSrData.distance);
        newSrData.scale = parseFloat(newSrData.scale);
        newSrData.duration = parseFloat(newSrData.duration);
        newSrData.delay = parseFloat(newSrData.delay);
      }

      // Migration to new effects attribute.
      if (hasNewRevealSupport && ghostkitSR) {
        const ghostkitData = {
          ...(attributes?.ghostkit || {}),
        };

        if (!ghostkitData?.effects?.reveal) {
          const parsedConfig = parseSRConfig(ghostkitSR);

          const newAnimationData = {
            x: parsedConfig.x,
            y: parsedConfig.y,
            opacity: parsedConfig.opacity,
            scale: parsedConfig.scale,
            transition: {
              type: 'easing',
              duration: parsedConfig.duration,
              delay: parsedConfig.delay,
              easing: parsedConfig.easing,
            },
          };

          if (!ghostkitData?.effects) {
            ghostkitData.effects = {};
          }

          ghostkitData.effects.reveal = newAnimationData;

          setAttributes({
            ghostkit: ghostkitData,
          });
        }

        // Clean old attribute.
        setAttributes({ ghostkitSR: '' });
      } else {
        setSrData(newSrData);
      }
    }, []);

    function updateData(data) {
      const newSrData = { ...srData, ...data };

      let newAttribute = '';
      if (newSrData.effect) {
        newAttribute = newSrData.effect;

        if (newSrData.direction) {
          newAttribute += `-${newSrData.direction}`;

          if (newSrData.distance !== 50) {
            newAttribute += `;distance:${newSrData.distance}px`;
          }
        }
        if (newSrData.duration !== 900) {
          newAttribute += `;duration:${newSrData.duration}`;
        }
        if (newSrData.delay !== 0) {
          newAttribute += `;delay:${newSrData.delay}`;
        }

        if (newSrData.effect === 'zoom' && newSrData.scale !== 0.9) {
          newAttribute += `;scale:${newSrData.scale}`;
        }
      }

      setSrData(newSrData);

      if (ghostkitSR !== newAttribute) {
        setAttributes({ ghostkitSR: newAttribute });
      }
    }

    const allow = !hasNewRevealSupport && allowedSR(props);

    if (!allow) {
      return <OriginalComponent {...props} />;
    }

    // add SR controls.
    return (
      <>
        <OriginalComponent {...props} />
        <InspectorControls>
          <PanelBody
            title={
              <>
                <span className="ghostkit-ext-icon">{getIcon('extension-sr')}</span>
                <span>{__('Animate on Scroll', '@@text_domain')}</span>
                {ghostkitSR ? <ActiveIndicator /> : ''}
              </>
            }
            initialOpen={initialOpenPanel}
            onToggle={() => {
              initialOpenPanel = !initialOpenPanel;
            }}
          >
            <ToggleGroup
              value={srData.effect}
              options={[
                {
                  label: __('Fade', '@@text_domain'),
                  value: 'fade',
                },
                {
                  label: __('Zoom', '@@text_domain'),
                  value: 'zoom',
                },
              ]}
              onChange={(value) => {
                updateData({ effect: value });
              }}
              isDeselectable
            />

            {srData.effect ? (
              <>
                <BaseControl className="ghostkit-control-sr-direction">
                  <div className="ghostkit-control-sr-direction-wrap">
                    <div className="ghostkit-control-sr-direction-left">
                      <Button
                        className={
                          srData.direction === 'left' ? 'ghostkit-control-sr-direction-active' : ''
                        }
                        onClick={() => updateData({ direction: 'left' })}
                      >
                        {getIcon('icon-arrow-right')}
                      </Button>
                    </div>
                    <div className="ghostkit-control-sr-direction-top">
                      <Button
                        className={
                          srData.direction === 'down' ? 'ghostkit-control-sr-direction-active' : ''
                        }
                        onClick={() => updateData({ direction: 'down' })}
                      >
                        {getIcon('icon-arrow-down')}
                      </Button>
                    </div>
                    <div className="ghostkit-control-sr-direction-right">
                      <Button
                        className={
                          srData.direction === 'right' ? 'ghostkit-control-sr-direction-active' : ''
                        }
                        onClick={() => updateData({ direction: 'right' })}
                      >
                        {getIcon('icon-arrow-left')}
                      </Button>
                    </div>
                    <div className="ghostkit-control-sr-direction-bottom">
                      <Button
                        className={
                          srData.direction === 'up' ? 'ghostkit-control-sr-direction-active' : ''
                        }
                        onClick={() => updateData({ direction: 'up' })}
                      >
                        {getIcon('icon-arrow-up')}
                      </Button>
                    </div>
                    <div className="ghostkit-control-sr-direction-center">
                      <Button
                        className={!srData.direction ? 'ghostkit-control-sr-direction-active' : ''}
                        onClick={() => updateData({ direction: '' })}
                      >
                        {getIcon('icon-circle')}
                      </Button>
                    </div>
                  </div>
                </BaseControl>

                {srData.direction || srData.effect === 'zoom' ? (
                  <div className="ghostkit-grid-controls">
                    {srData.direction ? (
                      <TextControl
                        type="number"
                        label={__('Distance', '@@text_domain')}
                        value={srData.distance}
                        onChange={(value) => updateData({ distance: value })}
                        min={10}
                        max={200}
                      />
                    ) : (
                      ''
                    )}
                    {srData.effect === 'zoom' ? (
                      <TextControl
                        type="number"
                        label={__('Scale', '@@text_domain')}
                        value={srData.scale}
                        onChange={(value) => updateData({ scale: value })}
                        min={0}
                        max={1}
                        step={0.05}
                      />
                    ) : (
                      ''
                    )}
                    {!srData.direction || srData.effect !== 'zoom' ? <div /> : ''}
                  </div>
                ) : (
                  ''
                )}

                <div className="ghostkit-grid-controls">
                  <TextControl
                    type="number"
                    label={__('Duration', '@@text_domain')}
                    value={srData.duration}
                    onChange={(value) => updateData({ duration: value })}
                    min={100}
                    max={2000}
                  />
                  <TextControl
                    type="number"
                    label={__('Delay', '@@text_domain')}
                    value={srData.delay}
                    onChange={(value) => updateData({ delay: value })}
                    min={0}
                    max={1000}
                  />
                </div>
              </>
            ) : (
              ''
            )}
          </PanelBody>
        </InspectorControls>
      </>
    );
  }

  return GhostKitSRWrapper;
}, 'withInspectorControl');

/**
 * Override props assigned to save component to inject custom styles.
 * This is only applied if the block's save result is an
 * element and not a markup string.
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 *
 * @return {Object} Filtered props applied to save element.
 */
function addSaveProps(extraProps, blockType, attributes) {
  if (attributes.ghostkitSR) {
    extraProps['data-ghostkit-sr'] = attributes.ghostkitSR;
  }

  return extraProps;
}

// Init filters.
addFilter('blocks.registerBlockType', 'ghostkit/sr/additional-attributes', addAttribute);
addFilter('editor.BlockEdit', 'ghostkit/sr/additional-attributes', withInspectorControl);
addFilter('blocks.getSaveContent.extraProps', 'ghostkit/sr/save-props', addSaveProps);
