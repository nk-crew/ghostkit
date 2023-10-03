/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
  __experimentalToggleGroupControl: ToggleGroupControl,
  __experimentalToggleGroupControlOption: ToggleGroupControlOption,
  __experimentalToggleGroupControlOptionIcon: ToggleGroupControlOptionIcon,
  BaseControl,
  ButtonGroup,
  Button,
} = wp.components;

/**
 * Component Class
 */
export default function ToggleGroup(props) {
  const { label, value, options, onChange, isBlock, isAdaptiveWidth, isDeselectable } = props;

  if (ToggleGroupControl && ToggleGroupControlOption) {
    return (
      <BaseControl
        label={label}
        className={classnames('ghostkit-control-toggle-group', props.className)}
      >
        <ToggleGroupControl
          value={value}
          onChange={onChange}
          isBlock={isBlock}
          isAdaptiveWidth={isAdaptiveWidth}
          isDeselectable={isDeselectable}
          hideLabelFromVision
        >
          {options.map((option) =>
            option.icon ? (
              <ToggleGroupControlOptionIcon
                key={option.value}
                value={option.value}
                icon={option.icon}
                label={option.label}
                disabled={option.disabled}
              />
            ) : (
              <ToggleGroupControlOption
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
              />
            )
          )}
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
              onChange(option.value);
            }}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </BaseControl>
  );
}
