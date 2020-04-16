/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import FieldLabel from '../../field-label';
import FieldDescription from '../../field-description';
import FieldOptions from '../../field-options';
import {
    getFieldAttributes,
    FieldDefaultSettings,
} from '../../field-attributes';

/**
 * WordPress dependencies
 */
const {
    __,
} = wp.i18n;

const {
    applyFilters,
} = wp.hooks;

const { Component, Fragment } = wp.element;

const {
    PanelBody,
    ToggleControl,
} = wp.components;

const {
    InspectorControls,
} = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const {
            slug,
            inline,
        } = attributes;

        let {
            options,
        } = attributes;

        let { className = '' } = this.props;

        className = classnames(
            'ghostkit-form-field ghostkit-form-field-radio',
            inline ? 'ghostkit-form-field-radio-inline' : '',
            className,
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        if ( ! options || ! options.length ) {
            options = [
                {
                    label: '',
                    value: '',
                    selected: false,
                },
            ];
        }

        let selectVal = '';

        options.forEach( ( data ) => {
            if ( ! selectVal && data.selected ) {
                selectVal = data.value;
            }
        } );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <FieldDefaultSettings
                            { ...this.props }
                            defaultCustom={ ' ' }
                            placeholderCustom={ ' ' }
                        />
                        <ToggleControl
                            label={ __( 'Inline', '@@text_domain' ) }
                            checked={ inline }
                            onChange={ () => setAttributes( { inline: ! inline } ) }
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <FieldLabel { ...this.props } />

                    { isSelected ? (
                        <FieldOptions
                            options={ options }
                            onChange={ ( val ) => setAttributes( { options: val } ) }
                        />
                    ) : (
                        <div className="ghostkit-form-field-radio-items">
                            { options.map( ( data, i ) => {
                                const fieldName = `${ slug }-item-${ i }`;
                                return (
                                    <label
                                        key={ fieldName }
                                        htmlFor={ fieldName }
                                        className="ghostkit-form-field-radio-item"
                                    >
                                        <input
                                            type="radio"
                                            checked={ selectVal === data.value }
                                            onChange={ () => {} }
                                            { ...getFieldAttributes( attributes ) }
                                        />
                                        { data.label }
                                    </label>
                                );
                            } ) }
                        </div>
                    ) }

                    <FieldDescription { ...this.props } />
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
