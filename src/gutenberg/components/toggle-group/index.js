/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const {
  __experimentalToggleGroupControl: ToggleGroupControl,
  __experimentalToggleGroupControlOption: ToggleGroupControlOption,
  BaseControl,
  ButtonGroup,
  Button,
} = wp.components;

/**
 * Component Class
 */
class ToggleGroup extends Component {
  render() {
    const { label, value, options, onChange, isBlock, isAdaptiveWidth, allowReset } = this.props;

    if (ToggleGroupControl && ToggleGroupControlOption) {
      return (
        <BaseControl
          label={label}
          className={classnames('ghostkit-control-toggle-group', this.props.className)}
        >
          <ToggleGroupControl
            value={value}
            onChange={onChange}
            isBlock={isBlock}
            isAdaptiveWidth={isAdaptiveWidth}
            hideLabelFromVision
          >
            {options.map((option) => (
              <ToggleGroupControlOption
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
                onClick={() => {
                  // Reset value.
                  if (allowReset && value === option.value) {
                    onChange('');
                  }
                }}
              />
            ))}
          </ToggleGroupControl>
        </BaseControl>
      );
    }

    // Fallback.
    return (
      <BaseControl label={label}>
        <ButtonGroup className="ghostkit-control-toggle-group">
          {options.map((option) => (
            <Button
              key={option.value}
              isSmall
              isPrimary={value === option.value}
              isPressed={value === option.value}
              disabled={option.disabled}
              onClick={() => {
                if (allowReset && value === option.value) {
                  onChange('');
                } else {
                  onChange(option.value);
                }
              }}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
      </BaseControl>
    );
  }
}

export default ToggleGroup;
