/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

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
            'ghostkit-form-field ghostkit-form-field-checkbox',
            inline ? 'ghostkit-form-field-checkbox-inline' : '',
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
                            multiple
                        />
                    ) : (
                        <div className="ghostkit-form-field-checkbox-items">
                            { options.map( ( data, i ) => {
                                return (
                                    <label
                                        key={ i }
                                        htmlFor={ `${ slug }-item-${ i }` }
                                        className="ghostkit-form-field-checkbox-item"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={ data.selected }
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
