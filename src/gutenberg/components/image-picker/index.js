/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { BaseControl } = wp.components;

/**
 * Component Class
 */
export default class ImagePicker extends Component {
  render() {
    const { value, options, onChange, label } = this.props;

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
            {option.image && 'string' === typeof option.image ? (
              <img src={option.image} alt={option.label || option.value} />
            ) : (
              ''
            )}
            {option.image && 'string' !== typeof option.image ? option.image : ''}
            {option.label ? <span>{option.label}</span> : ''}
          </button>
        ))}
      </BaseControl>
    );
  }
}
