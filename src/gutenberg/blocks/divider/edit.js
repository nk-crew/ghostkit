/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import ColorIndicator from '../../components/color-indicator';
import RangeControl from '../../components/range-control';
import ApplyFilters from '../../components/apply-filters';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { PanelBody, SelectControl, ToolbarGroup, ToolbarDropdownMenu, TabPanel } = wp.components;

const { InspectorControls, BlockControls } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  render() {
    const { attributes, setAttributes } = this.props;

    let { className = '' } = this.props;

    const { type, size, icon, iconSize, color, iconColor, hoverColor, hoverIconColor } = attributes;

    className = classnames('ghostkit-divider', `ghostkit-divider-type-${type}`, className);

    if (icon) {
      className = classnames(className, 'ghostkit-divider-with-icon');
    }

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <BlockControls>
          <ToolbarGroup>
            <ToolbarDropdownMenu
              icon="minus"
              label={__('Type', '@@text_domain')}
              controls={[
                {
                  title: __('Line', '@@text_domain'),
                  onClick: () => setAttributes({ type: 'solid' }),
                },
                {
                  title: __('Dashed', '@@text_domain'),
                  onClick: () => setAttributes({ type: 'dashed' }),
                },
                {
                  title: __('Dotted', '@@text_domain'),
                  onClick: () => setAttributes({ type: 'dotted' }),
                },
                {
                  title: __('Double', '@@text_domain'),
                  onClick: () => setAttributes({ type: 'double' }),
                },
              ]}
            />
          </ToolbarGroup>
        </BlockControls>
        <InspectorControls>
          <PanelBody>
            <SelectControl
              label={__('Type', '@@text_domain')}
              value={type}
              options={[
                {
                  value: 'solid',
                  label: __('Line', '@@text_domain'),
                },
                {
                  value: 'dashed',
                  label: __('Dashed', '@@text_domain'),
                },
                {
                  value: 'dotted',
                  label: __('Dotted', '@@text_domain'),
                },
                {
                  value: 'double',
                  label: __('Double', '@@text_domain'),
                },
              ]}
              onChange={(value) => setAttributes({ type: value })}
            />
            <RangeControl
              label={__('Size', '@@text_domain')}
              value={size}
              onChange={(value) => setAttributes({ size: value })}
              min={1}
              max={7}
              beforeIcon="editor-textcolor"
              afterIcon="editor-textcolor"
              allowCustomMax
            />
          </PanelBody>
          <PanelBody>
            <IconPicker
              label={__('Icon', '@@text_domain')}
              value={icon}
              onChange={(value) => setAttributes({ icon: value })}
            />
            {icon ? (
              <RangeControl
                label={__('Icon Size', '@@text_domain')}
                value={iconSize}
                onChange={(value) => setAttributes({ iconSize: value })}
                min={10}
                beforeIcon="editor-textcolor"
                afterIcon="editor-textcolor"
                allowCustomMin
                allowCustomMax
              />
            ) : (
              ''
            )}
          </PanelBody>
          <PanelBody
            title={
              <Fragment>
                {__('Colors', '@@text_domain')}
                <ColorIndicator colorValue={color} />
                {icon ? <ColorIndicator colorValue={iconColor} /> : ''}
              </Fragment>
            }
            initialOpen={false}
          >
            <TabPanel
              className="ghostkit-control-tabs ghostkit-control-tabs-wide"
              tabs={[
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
              ]}
            >
              {(tabData) => {
                const isHover = 'hover' === tabData.name;
                return (
                  <Fragment>
                    <ApplyFilters
                      name="ghostkit.editor.controls"
                      attribute={isHover ? 'hoverColor' : 'color'}
                      props={this.props}
                    >
                      <ColorPicker
                        label={__('Divider', '@@text_domain')}
                        value={isHover ? hoverColor : color}
                        onChange={(val) =>
                          setAttributes(isHover ? { hoverColor: val } : { color: val })
                        }
                        alpha
                      />
                    </ApplyFilters>
                    {icon ? (
                      <ApplyFilters
                        name="ghostkit.editor.controls"
                        attribute={isHover ? 'hoverIconColor' : 'iconColor'}
                        props={this.props}
                      >
                        <ColorPicker
                          label={__('Icon', '@@text_domain')}
                          value={isHover ? hoverIconColor : iconColor}
                          onChange={(val) =>
                            setAttributes(isHover ? { hoverIconColor: val } : { iconColor: val })
                          }
                          alpha
                        />
                      </ApplyFilters>
                    ) : (
                      ''
                    )}
                  </Fragment>
                );
              }}
            </TabPanel>
          </PanelBody>
        </InspectorControls>
        <div className={className}>
          {icon ? (
            <div className="ghostkit-divider-icon">
              <IconPicker.Dropdown
                onChange={(value) => setAttributes({ icon: value })}
                value={icon}
                renderToggle={({ onToggle }) => (
                  <IconPicker.Preview onClick={onToggle} name={icon} />
                )}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </Fragment>
    );
  }
}

export default BlockEdit;
