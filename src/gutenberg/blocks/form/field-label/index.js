/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { __ } = wp.i18n;

const { RichText } = wp.blockEditor;

/**
 * Field Label Class.
 */
class FieldLabel extends Component {
  render() {
    const { attributes, setAttributes, isSelected } = this.props;

    const { label, hideLabel } = attributes;

    if (!label && !isSelected) {
      return null;
    }

    if (hideLabel && !isSelected) {
      return null;
    }

    return (
      // eslint-disable-next-line jsx-a11y/label-has-associated-control
      <label className="ghostkit-form-field-label">
        <RichText
          inlineToolbar
          tagName="span"
          value={label}
          placeholder={__('Write label…', '@@text_domain')}
          onChange={(val) => setAttributes({ label: val })}
        />
        {attributes.required ? <span className="required">*</span> : ''}
      </label>
    );
  }
}

export default FieldLabel;
