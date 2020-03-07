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
    TextControl,
} = wp.components;

const {
    InspectorControls,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import FieldLabel from '../../field-label';
import FieldDescription from '../../field-description';
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
        } = this.props;

        const {
            min,
            max,
            default: defaultVal,
        } = attributes;

        let { className = '' } = this.props;

        className = classnames(
            'ghostkit-form-field ghostkit-form-field-date',
            className,
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        const defaultCustom = (
            <TextControl
                type="date"
                label={ __( 'Default', '@@text_domain' ) }
                value={ defaultVal }
                onChange={ ( val ) => setAttributes( { default: val } ) }
                max={ max }
                min={ min }
            />
        );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <FieldDefaultSettings
                            { ...this.props }
                            defaultCustom={ defaultCustom }
                        />
                    </PanelBody>
                    <PanelBody title={ __( 'Date Settings', '@@text_domain' ) }>
                        <TextControl
                            type="date"
                            label={ __( 'Min', '@@text_domain' ) }
                            value={ min }
                            onChange={ ( val ) => setAttributes( { min: val } ) }
                            max={ max }
                        />
                        <TextControl
                            type="date"
                            label={ __( 'Max', '@@text_domain' ) }
                            value={ max }
                            onChange={ ( val ) => setAttributes( { max: val } ) }
                            min={ min }
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <FieldLabel { ...this.props } />
                    <TextControl
                        type="date"
                        { ...getFieldAttributes( attributes ) }
                    />
                    <FieldDescription { ...this.props } />
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
