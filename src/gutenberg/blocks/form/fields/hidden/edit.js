/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import FieldLabel from '../../field-label';
import {
    getFieldAttributes,
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
    TextControl,
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
        } = this.props;

        const {
            default: defaultVal,
        } = this.props;

        let { className = '' } = this.props;

        className = classnames(
            'ghostkit-form-field ghostkit-form-field-hidden',
            className,
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <TextControl
                            label={ __( 'Value', '@@text_domain' ) }
                            value={ defaultVal }
                            onChange={ ( val ) => setAttributes( { default: val } ) }
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <FieldLabel { ...this.props } />
                    <TextControl
                        type="text"
                        { ...getFieldAttributes( attributes ) }
                    />
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
