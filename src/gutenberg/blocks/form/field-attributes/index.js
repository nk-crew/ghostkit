/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;

const { __ } = wp.i18n;

const {
    TextControl,
    ToggleControl,
} = wp.components;

/**
 * Get field attributes to render Gutenberg component.
 *
 * @param {Object} attributes - block attributes.
 *
 * @return {Object} attributes list.
 */
export function getFieldAttributes( attributes ) {
    const allowedAttributes = [
        'id',
        'placeholder',
        'default',
        'min',
        'max',
        'step',
        'multiple',
        'required',
        'for',
    ];
    const result = {
        // prevent input focus.
        tabIndex: -1,
    };

    Object.keys( attributes ).forEach( ( k ) => {
        let val = attributes[ k ];

        if ( typeof val !== 'undefined' ) {
            if ( 'slug' === k ) {
                k = 'id';
            }

            if ( allowedAttributes.indexOf( k ) !== -1 ) {
                // boolean value.
                if ( typeof val === 'boolean' ) {
                    if ( val ) {
                        val = k;
                    } else {
                        val = false;
                    }
                }

                // default attribute.
                if ( 'default' === k ) {
                    k = 'value';
                }

                if ( false !== val ) {
                    result[ k ] = val;
                }
            }
        }
    } );

    return result;
}

/**
 * Field Default Settings Class.
 */
export class FieldDefaultSettings extends Component {
    render() {
        const {
            attributes,
            setAttributes,

            hideLabelCustom,
            hideDescriptionCustom,
            requiredCustom,
            placeholderCustom,
            defaultCustom,
            slugCustom,
        } = this.props;

        const {
            slug,
            label,
            description,
            hideLabel,
            hideDescription,
            required,
            placeholder,
            default: defaultVal,
        } = attributes;

        const hideLabelControl = (
            hideLabelCustom ? hideLabelCustom : (
                <ToggleControl
                    label={ __( 'Hide Label', '@@text_domain' ) }
                    checked={ hideLabel }
                    onChange={ () => setAttributes( { hideLabel: ! hideLabel } ) }
                />
            )
        );

        const hideDescriptionControl = (
            hideDescriptionCustom ? hideDescriptionCustom : (
                <ToggleControl
                    label={ __( 'Hide Description', '@@text_domain' ) }
                    checked={ hideDescription }
                    onChange={ () => setAttributes( { hideDescription: ! hideDescription } ) }
                />
            )
        );

        return (
            <Fragment>
                { slugCustom ? slugCustom : (
                    <TextControl
                        label={ __( 'Slug', '@@text_domain' ) }
                        help={ __( 'Slug is used in form field [name] attribute.', '@@text_domain' ) }
                        value={ slug }
                        onChange={ () => {} }
                        readOnly
                    />
                ) }
                { placeholderCustom ? placeholderCustom : (
                    <TextControl
                        label={ __( 'Placeholder', '@@text_domain' ) }
                        value={ placeholder }
                        onChange={ ( val ) => setAttributes( { placeholder: val } ) }
                    />
                ) }
                { defaultCustom ? defaultCustom : (
                    <TextControl
                        label={ __( 'Default', '@@text_domain' ) }
                        value={ defaultVal }
                        onChange={ ( val ) => setAttributes( { default: val } ) }
                    />
                ) }
                { requiredCustom ? requiredCustom : (
                    <ToggleControl
                        label={ __( 'Required', '@@text_domain' ) }
                        checked={ required }
                        onChange={ () => setAttributes( { required: ! required } ) }
                    />
                ) }
                { label ? hideLabelControl : '' }
                { description ? hideDescriptionControl : '' }
            </Fragment>
        );
    }
}
