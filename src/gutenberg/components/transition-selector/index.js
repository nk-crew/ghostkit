/**
 * Internal dependencies
 */
import ToggleGroup from '../toggle-group';
import DropdownPicker from '../dropdown-picker';
import { EasingControls, EasingBezierEditor } from '../transition-easing-controls';
import EASING_DEFAULT from '../transition-easing-controls/default';
import { SpringControls, SpringEditor } from '../transition-spring-controls';
import SPRING_DEFAULT from '../transition-spring-controls/default';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { BaseControl } = wp.components;

export default function TransitionSelector(props) {
  const {
    label,
    value,
    onChange,
    enableEasing = true,
    enableSpring = true,
    enableDelayControl = true,
  } = props;

  let easingValue = value?.easing;
  if (!easingValue || easingValue.length !== 4) {
    easingValue = EASING_DEFAULT.easing;
  }

  const buttonLabel =
    value?.type !== 'spring' ? (
      <>
        <EasingBezierEditor variant="preview" value={easingValue} />
        {__('Easing', '@@text_domain')}
      </>
    ) : (
      <>
        <SpringEditor variant="preview" value={value} />
        {__('Spring', '@@text_domain')}
      </>
    );

  if (!enableEasing && !enableSpring) {
    return false;
  }

  return (
    <BaseControl label={label}>
      <DropdownPicker
        label={buttonLabel}
        className="ghostkit-component-transition-selector"
        contentClassName="ghostkit-component-transition-selector-content"
      >
        {enableEasing && enableSpring && (
          <ToggleGroup
            value={value?.type || 'spring'}
            options={[
              {
                label: __('Easing', '@@text_domain'),
                value: 'easing',
              },
              {
                label: __('Spring', '@@text_domain'),
                value: 'spring',
              },
            ]}
            onChange={(val) => {
              const defaultTransition =
                val === 'spring'
                  ? { type: 'spring', ...SPRING_DEFAULT }
                  : { type: 'easing', ...EASING_DEFAULT };

              delete defaultTransition.label;

              onChange(defaultTransition);
            }}
            isBlock
          />
        )}
        {enableSpring && value?.type !== 'easing' && (
          <SpringControls
            value={value}
            onChange={(val) => {
              onChange(val);
            }}
            enableDelayControl={enableDelayControl}
          />
        )}
        {enableEasing && value?.type === 'easing' && (
          <EasingControls
            value={value}
            onChange={(val) => {
              onChange(val);
            }}
            enableDelayControl={enableDelayControl}
          />
        )}
      </DropdownPicker>
    </BaseControl>
  );
}
