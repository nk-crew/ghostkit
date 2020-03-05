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
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const {
            label,
            hideLabel,
        } = attributes;

        if ( ! label && ! isSelected ) {
            return '';
        }

        if ( hideLabel && ! isSelected ) {
            return '';
        }

        return (
            <label
                className="ghostkit-form-field-label"
                htmlFor={ attributes.slug }
            >
                <RichText
                    tagName="span"
                    value={ label }
                    placeholder={ __( 'Write label…', '@@text_domain' ) }
                    onChange={ ( val ) => setAttributes( { label: val } ) }
                    keepPlaceholderOnFocus
                />
                { attributes.required ? (
                    <span className="required">*</span>
                ) : '' }
            </label>
        );
    }
}

export default FieldLabel;
