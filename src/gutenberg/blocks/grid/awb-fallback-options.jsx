// Internal Dependencies.
import ApplyFilters from '../../components/apply-filters';
import ColorPicker from '../../components/color-picker';

const { __ } = wp.i18n;

const { Component } = wp.element;
const {
    PanelBody,
} = wp.components;

export default class AWBFallbackOptions extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        const {
            awb_color, // eslint-disable-line
        } = attributes;

        return (
            <ApplyFilters name="ghostkit.editor.controls" attribute="background" props={ this.props }>
                <PanelBody
                    title={ __( 'Background' ) }
                    initialOpen={ false }
                >
                    <ColorPicker
                        label={ __( 'Background Color' ) }
                        value={ awb_color } // eslint-disable-line
                        onChange={ ( val ) => setAttributes( { awb_color: val } ) }
                        alpha={ true }
                    />
                    <p>
                        { __( 'Install AWB plugin to set image, video backgrounds with parallax support.' ) }
                    </p>
                    <a
                        className="components-button is-button is-default is-small"
                        href="https://wordpress.org/plugins/advanced-backgrounds/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        { __( 'Install' ) }
                    </a>
                </PanelBody>
            </ApplyFilters>
        );
    }
}
