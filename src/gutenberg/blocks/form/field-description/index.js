/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { __ } = wp.i18n;

const { RichText } = wp.blockEditor;

/**
 * Field Description Class.
 */
class FieldDescription extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const {
            description,
            hideDescription,
        } = attributes;

        if ( ! description && ! isSelected ) {
            return null;
        }

        if ( hideDescription && ! isSelected ) {
            return null;
        }

        return (
            <RichText
                tagName="small"
                className="ghostkit-form-field-description"
                value={ description }
                placeholder={ __( 'Write description…', '@@text_domain' ) }
                onChange={ ( val ) => setAttributes( { description: val } ) }
                keepPlaceholderOnFocus
            />
        );
    }
}

export default FieldDescription;
