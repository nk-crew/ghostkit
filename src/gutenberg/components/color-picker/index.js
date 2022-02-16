/**
 * WordPress dependencies
 */
const WPColorPicker = wp.components.ColorPicker;

const { Component } = wp.element;

const { __ } = wp.i18n;

const { Dropdown, Tooltip, BaseControl } = wp.components;

const { ColorPalette } = wp.blockEditor;

/**
 * Component Class
 */
export default class ColorPicker extends Component {
  constructor(...args) {
    super(...args);

    // These states used to fix components re-rendering
    this.state = {
      keyForPalette: this.props.value,
      keyForPicker: this.props.value,
    };
  }

  render() {
    const {
      value,
      onChange,
      label,
      alpha = false,
      colorPalette = true,
      hint = __('Custom Color Picker', '@@text_domain'),
      afterDropdownContent,
    } = this.props;

    return (
      <BaseControl label={label} className="ghostkit-component-color-picker-wrapper">
        <Dropdown
          position="bottom left"
          className="ghostkit-component-color-picker__dropdown"
          contentClassName="ghostkit-component-color-picker__dropdown-content"
          renderToggle={({ isOpen, onToggle }) => (
            <Tooltip text={hint}>
              <button
                type="button"
                aria-expanded={isOpen}
                className="ghostkit-component-color-toggle"
                onClick={onToggle}
                aria-label={hint}
                style={{ color: value || '' }}
              >
                <span />
              </button>
            </Tooltip>
          )}
          renderContent={() => (
            <div className="ghostkit-component-color-picker">
              <WPColorPicker
                color={value}
                onChangeComplete={(color) => {
                  let colorString;

                  if ('undefined' === typeof color.rgb || 1 === color.rgb.a) {
                    colorString = color.hex;
                  } else {
                    const { r, g, b, a } = color.rgb;
                    colorString = `rgba(${r}, ${g}, ${b}, ${a})`;
                  }

                  onChange(colorString || '');

                  this.setState({
                    keyForPalette: colorString,
                  });
                }}
                disableAlpha={!alpha}
                key={this.state.keyForPicker}
              />
              {colorPalette ? (
                <BaseControl
                  label={__('Color Palette', '@@text_domain')}
                  className="ghostkit-component-color-picker-palette"
                >
                  <ColorPalette
                    value={value}
                    onChange={(color) => {
                      onChange(color || '');

                      this.setState({
                        keyForPicker: color,
                      });
                    }}
                    disableCustomColors
                    key={this.state.keyForPalette}
                  />
                </BaseControl>
              ) : (
                ''
              )}
              {afterDropdownContent || ''}
            </div>
          )}
        />
      </BaseControl>
    );
  }
}
