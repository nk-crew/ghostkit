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
  const { label, value, onChange } = props;

  let ease = value?.ease;
  if (!ease || ease.length !== 4) {
    ease = EASING_DEFAULT.ease;
  }

  const buttonLabel =
    value?.type !== 'spring' ? (
      <>
        <EasingBezierEditor variant="preview" value={ease} />
        {__('Easing', '@@text_domain')}
      </>
    ) : (
      <>
        <SpringEditor variant="preview" value={value} />
        {__('Spring', '@@text_domain')}
      </>
    );

  return (
    <BaseControl label={label}>
      <DropdownPicker
        label={buttonLabel}
        className="ghostkit-component-transition-selector"
        contentClassName="ghostkit-component-transition-selector-content"
      >
        <ToggleGroup
          value={value?.type || 'easing'}
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
        {value?.type === 'spring' ? (
          <SpringControls
            value={value}
            onChange={(val) => {
              onChange(val);
            }}
          />
        ) : (
          <EasingControls
            value={value}
            onChange={(val) => {
              onChange(val);
            }}
          />
        )}
      </DropdownPicker>
    </BaseControl>
  );
}
