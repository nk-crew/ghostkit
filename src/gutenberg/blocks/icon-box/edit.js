/* eslint-disable react/jsx-curly-newline */
/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import URLPicker from '../../components/url-picker';
import ColorIndicator from '../../components/color-indicator';
import ApplyFilters from '../../components/apply-filters';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { withSelect } = wp.data;

const { BaseControl, PanelBody, RangeControl, ToggleControl, TabPanel, Toolbar } = wp.components;

const { InspectorControls, InnerBlocks, BlockControls } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  render() {
    const { attributes, setAttributes, isSelected, hasChildBlocks } = this.props;

    let { className = '' } = this.props;

    const {
      icon,
      iconPosition,
      iconSize,
      showContent,
      iconColor,
      hoverIconColor,
      url,
      target,
      rel,
    } = attributes;

    className = classnames('ghostkit-icon-box', className);

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody>
            <IconPicker
              label={__('Icon', '@@text_domain')}
              value={icon}
              onChange={(value) => setAttributes({ icon: value })}
            />
            {icon ? (
              <Fragment>
                <RangeControl
                  label={__('Icon Size', '@@text_domain')}
                  value={iconSize}
                  onChange={(value) => setAttributes({ iconSize: value })}
                  min={20}
                  max={100}
                  beforeIcon="editor-textcolor"
                  afterIcon="editor-textcolor"
                />
                <BaseControl label={__('Icon Position', '@@text_domain')}>
                  <div>
                    <Toolbar
                      controls={[
                        {
                          icon: 'align-center',
                          title: __('Top', '@@text_domain'),
                          onClick: () => setAttributes({ iconPosition: 'top' }),
                          isActive: iconPosition === 'top',
                        },
                        {
                          icon: 'align-left',
                          title: __('Left', '@@text_domain'),
                          onClick: () => setAttributes({ iconPosition: 'left' }),
                          isActive: iconPosition === 'left',
                        },
                        {
                          icon: 'align-right',
                          title: __('Right', '@@text_domain'),
                          onClick: () => setAttributes({ iconPosition: 'right' }),
                          isActive: iconPosition === 'right',
                        },
                      ]}
                    />
                  </div>
                </BaseControl>
              </Fragment>
            ) : (
              ''
            )}
            {!showContent || icon ? (
              <ToggleControl
                label={__('Show Content', '@@text_domain')}
                checked={!!showContent}
                onChange={(val) => setAttributes({ showContent: val })}
              />
            ) : (
              ''
            )}
          </PanelBody>
          <PanelBody
            title={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Fragment>
                {__('Colors', '@@text_domain')}
                <ColorIndicator colorValue={iconColor} />
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
                const isHover = tabData.name === 'hover';
                return (
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
                );
              }}
            </TabPanel>
          </PanelBody>
        </InspectorControls>
        <URLPicker
          url={url}
          rel={rel}
          target={target}
          onChange={(data) => {
            setAttributes(data);
          }}
          isSelected={isSelected}
          toolbarSettings
          inspectorSettings
        />
        {icon ? (
          <BlockControls>
            <Toolbar
              controls={[
                {
                  icon: 'align-center',
                  title: __('Icon Position Top', '@@text_domain'),
                  onClick: () => setAttributes({ iconPosition: 'top' }),
                  isActive: iconPosition === 'top',
                },
                {
                  icon: 'align-left',
                  title: __('Icon Position Left', '@@text_domain'),
                  onClick: () => setAttributes({ iconPosition: 'left' }),
                  isActive: iconPosition === 'left',
                },
                {
                  icon: 'align-right',
                  title: __('Icon Position Right', '@@text_domain'),
                  onClick: () => setAttributes({ iconPosition: 'right' }),
                  isActive: iconPosition === 'right',
                },
              ]}
            />
          </BlockControls>
        ) : (
          ''
        )}
        <div className={className}>
          {icon ? (
            <div
              className={`ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${
                iconPosition || 'left'
              }`}
            >
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
          {showContent ? (
            <div className="ghostkit-icon-box-content">
              <InnerBlocks
                templateLock={false}
                renderAppender={
                  hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender />
                }
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

export default withSelect((select, props) => {
  const { clientId } = props;
  const blockEditor = select('core/block-editor');

  return {
    hasChildBlocks: blockEditor ? blockEditor.getBlockOrder(clientId).length > 0 : false,
  };
})(BlockEdit);
