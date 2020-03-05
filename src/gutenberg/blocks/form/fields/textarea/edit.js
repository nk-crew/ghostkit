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
    TextareaControl,
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
            default: defaultVal,
        } = attributes;

        let { className = '' } = this.props;

        className = classnames(
            'ghostkit-form-field ghostkit-form-field-textarea',
            className,
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        const defaultCustom = (
            <TextareaControl
                label={ __( 'Default', '@@text_domain' ) }
                value={ defaultVal }
                onChange={ ( val ) => setAttributes( { default: val } ) }
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
                </InspectorControls>
                <div className={ className }>
                    <FieldLabel { ...this.props } />
                    <TextareaControl { ...getFieldAttributes( attributes ) } />
                    <FieldDescription { ...this.props } />
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
