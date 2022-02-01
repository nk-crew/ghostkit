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
import ApplyFilters from '../../components/apply-filters';
import URLPicker from '../../components/url-picker';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
  SelectControl,
  PanelBody,
  RangeControl,
  Button,
  ButtonGroup,
  TabPanel,
  ColorIndicator,
  ToggleControl,
} = wp.components;

const { InspectorControls, RichText } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedColorState: 'normal',
    };
  }

  componentDidUpdate(prevProps) {
    const { isSelected } = this.props;

    // Reset selected color state when block is not selected.
    if (prevProps.isSelected && !isSelected) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        selectedColorState: 'normal',
      });
    }
  }

  render() {
    const { attributes, setAttributes, isSelected } = this.props;

    let { className = '' } = this.props;

    const {
      tagName,
      text,
      icon,
      iconPosition,
      hideText,
      url,
      target,
      rel,
      size,
      color,
      textColor,
      borderRadius,
      borderWeight,
      borderColor,
      focusOutlineWeight,
      focusOutlineColor,
      hoverColor,
      hoverTextColor,
      hoverBorderColor,
    } = attributes;

    const sizes = {
      XS: 'xs',
      S: 'sm',
      M: 'md',
      L: 'lg',
      XL: 'xl',
    };
    let isNormalState = false;
    let isHoveredState = false;
    let isFocusedState = false;

    if (isSelected) {
      isNormalState = true;

      if (this.state.selectedColorState === 'hover') {
        isNormalState = false;
        isHoveredState = true;
      } else if (this.state.selectedColorState === 'focus') {
        isNormalState = false;
        isFocusedState = true;
      }
    }

    className = classnames(
      'ghostkit-button',
      size ? `ghostkit-button-${size}` : '',
      hideText ? 'ghostkit-button-icon-only' : '',
      isNormalState ? 'ghostkit-button-is-normal-state' : '',
      isHoveredState ? 'ghostkit-button-is-hover-state' : '',
      isFocusedState ? 'ghostkit-button-is-focus-state' : '',
      className
    );

    // focus outline
    if (focusOutlineWeight && focusOutlineColor) {
      className = classnames(className, 'ghostkit-button-with-outline');
    }

    className = applyFilters('ghostkit.editor.className', className, this.props);

    const colorsTabs = [
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

    if (focusOutlineWeight && focusOutlineColor) {
      colorsTabs.push({
        name: 'focus',
        title: __('Focus', '@@text_domain'),
        className: 'ghostkit-control-tabs-tab',
      });
    }

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody>
            <div className="blocks-size__main">
              <ButtonGroup aria-label={__('Size', '@@text_domain')}>
                {Object.keys(sizes).map((key) => (
                  <Button
                    key={key}
                    isSmall
                    isPrimary={size === sizes[key]}
                    isPressed={size === sizes[key]}
                    onClick={() => setAttributes({ size: sizes[key] })}
                  >
                    {key}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </PanelBody>
          <PanelBody>
            <RangeControl
              label={__('Corner Radius', '@@text_domain')}
              value={borderRadius}
              min="0"
              max="50"
              onChange={(value) => setAttributes({ borderRadius: value })}
            />
            <RangeControl
              label={__('Border Size', '@@text_domain')}
              value={borderWeight}
              min="0"
              max="6"
              onChange={(value) => setAttributes({ borderWeight: value })}
            />
            <RangeControl
              label={__('Focus Outline Size', '@@text_domain')}
              value={focusOutlineWeight}
              min="0"
              max="6"
              onChange={(value) => setAttributes({ focusOutlineWeight: value })}
            />
          </PanelBody>
          <PanelBody>
            <IconPicker
              label={__('Icon', '@@text_domain')}
              value={icon}
              onChange={(value) => setAttributes({ icon: value })}
            />
            {icon ? (
              <ToggleControl
                label={__('Show Icon Only', '@@text_domain')}
                checked={!!hideText}
                onChange={(val) => setAttributes({ hideText: val })}
              />
            ) : (
              ''
            )}
            {icon && !hideText ? (
              <SelectControl
                label={__('Icon Position', '@@text_domain')}
                value={iconPosition}
                options={[
                  {
                    value: 'left',
                    label: __('Left', '@@text_domain'),
                  },
                  {
                    value: 'right',
                    label: __('Right', '@@text_domain'),
                  },
                ]}
                onChange={(value) => setAttributes({ iconPosition: value })}
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
                <ColorIndicator colorValue={color} />
                <ColorIndicator colorValue={textColor} />
                {borderWeight ? <ColorIndicator colorValue={borderColor} /> : ''}
                {focusOutlineWeight && focusOutlineColor ? (
                  <ColorIndicator colorValue={focusOutlineColor} />
                ) : (
                  ''
                )}
              </Fragment>
            }
            initialOpen={false}
          >
            <TabPanel
              className="ghostkit-control-tabs ghostkit-control-tabs-wide"
              tabs={colorsTabs}
              onSelect={(state) => {
                this.setState({
                  selectedColorState: state,
                });
              }}
            >
              {(tabData) => {
                const isHover = tabData.name === 'hover';

                // focus tab
                if (tabData.name === 'focus') {
                  return (
                    <ApplyFilters
                      name="ghostkit.editor.controls"
                      attribute="focusOutlineColor"
                      props={this.props}
                    >
                      <ColorPicker
                        label={__('Outline', '@@text_domain')}
                        value={focusOutlineColor}
                        onChange={(val) => setAttributes({ focusOutlineColor: val })}
                        alpha
                      />
                    </ApplyFilters>
                  );
                }

                return (
                  <Fragment>
                    <ApplyFilters
                      name="ghostkit.editor.controls"
                      attribute={isHover ? 'hoverColor' : 'color'}
                      props={this.props}
                    >
                      <ColorPicker
                        label={__('Background', '@@text_domain')}
                        value={isHover ? hoverColor : color}
                        onChange={(val) =>
                          setAttributes(isHover ? { hoverColor: val } : { color: val })
                        }
                        alpha
                      />
                    </ApplyFilters>
                    <ApplyFilters
                      name="ghostkit.editor.controls"
                      attribute={isHover ? 'hoverTextColor' : 'textColor'}
                      props={this.props}
                    >
                      <ColorPicker
                        label={__('Text', '@@text_domain')}
                        value={isHover ? hoverTextColor : textColor}
                        onChange={(val) =>
                          setAttributes(isHover ? { hoverTextColor: val } : { textColor: val })
                        }
                        alpha
                      />
                    </ApplyFilters>
                    {borderWeight ? (
                      <ApplyFilters
                        name="ghostkit.editor.controls"
                        attribute={isHover ? 'hoverBorderColor' : 'borderColor'}
                        props={this.props}
                      >
                        <ColorPicker
                          label={__('Border', '@@text_domain')}
                          value={isHover ? hoverBorderColor : borderColor}
                          onChange={(val) =>
                            setAttributes(
                              isHover ? { hoverBorderColor: val } : { borderColor: val }
                            )
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
            <div
              className={`ghostkit-button-icon ghostkit-button-icon-${
                iconPosition === 'right' ? 'right' : 'left'
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
          {!hideText ? (
            <RichText
              placeholder={__('Write text…', '@@text_domain')}
              value={text}
              onChange={(value) => setAttributes({ text: value })}
              isSelected={isSelected}
              withoutInteractiveFormatting
              keepPlaceholderOnFocus
            />
          ) : (
            ''
          )}
        </div>
        {!tagName || tagName === 'a' ? (
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
        ) : (
          ''
        )}
      </Fragment>
    );
  }
}

export default BlockEdit;
