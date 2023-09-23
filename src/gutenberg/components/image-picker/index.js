/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { BaseControl } = wp.components;

/**
 * Component Class
 */
export default function ImagePicker(props) {
  const { value, options, onChange, label } = props;

  return (
    <BaseControl label={label} className="ghostkit-component-image-picker">
      {options.map((option) => (
        // eslint-disable-next-line react/button-has-type
        <button
          key={`image-pircker-${option.value}`}
          onClick={() => {
            onChange(option.value);
          }}
          className={classnames(
            'ghostkit-component-image-picker-item',
            value === option.value ? 'ghostkit-component-image-picker-item-active' : '',
            option.className
          )}
        >
          {option.image && typeof option.image === 'string' ? (
            <img src={option.image} alt={option.label || option.value} />
          ) : null}
          {option.image && typeof option.image !== 'string' ? option.image : ''}
          {option.label ? <span>{option.label}</span> : ''}
        </button>
      ))}
    </BaseControl>
  );
}
