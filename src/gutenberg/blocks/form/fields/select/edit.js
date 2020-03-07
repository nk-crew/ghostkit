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
    SelectControl,
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
            multiple,
        } = attributes;

        let {
            options,
        } = attributes;

        let { className = '' } = this.props;

        className = classnames(
            'ghostkit-form-field ghostkit-form-field-select',
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

        let selectVal = multiple ? [] : '';

        options.forEach( ( data ) => {
            if ( multiple && data.selected ) {
                selectVal.push( data.value );
            } else if ( ! multiple && ! selectVal && data.selected ) {
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
                            label={ __( 'Multiple', '@@text_domain' ) }
                            checked={ multiple }
                            onChange={ () => {
                                if ( multiple ) {
                                    const newOptions = [ ...options ];
                                    let singleSelected = false;

                                    newOptions.forEach( ( data, i ) => {
                                        if ( data.selected ) {
                                            if ( singleSelected ) {
                                                newOptions[ i ].selected = false;
                                            }

                                            singleSelected = true;
                                        }
                                    } );

                                    setAttributes( {
                                        multiple: ! multiple,
                                        options: newOptions,
                                    } );
                                } else {
                                    setAttributes( { multiple: ! multiple } );
                                }
                            } }
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <FieldLabel { ...this.props } />

                    { isSelected ? (
                        <FieldOptions
                            options={ options }
                            multiple={ multiple }
                            onChange={ ( val ) => setAttributes( { options: val } ) }
                        />
                    ) : (
                        <SelectControl
                            { ...getFieldAttributes( attributes ) }
                            value={ selectVal }
                            options={ ( () => {
                                if ( ! multiple ) {
                                    let addNullOption = true;

                                    Object.keys( options ).forEach( ( data ) => {
                                        if ( data.selected ) {
                                            addNullOption = false;
                                        }
                                    } );

                                    if ( addNullOption ) {
                                        return [
                                            {
                                                label: __( '--- Select ---', '@@text_domain' ),
                                                value: '',
                                                selected: true,
                                            },
                                            ...options,
                                        ];
                                    }
                                }

                                return options;
                            } )() }
                        />
                    ) }

                    <FieldDescription { ...this.props } />
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
