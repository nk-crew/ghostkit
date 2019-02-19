// Import CSS
import './editor.scss';

// Internal Dependencies.
import getIcon from '../../utils/get-icon';
import { CustomCodeModal } from '../custom-code';
import { CustomizerModal } from '../customizer';

const {
    Fragment,
} = wp.element;

const { __ } = wp.i18n;
const { Component } = wp.element;

const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { registerPlugin } = wp.plugins;

const {
    Button,
    PanelBody,
} = wp.components;

class GhostKit extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            isModalOpen: false,
        };
    }

    render() {
        const {
            isModalOpen,
        } = this.state;

        return (
            <Fragment>
                <PluginSidebarMoreMenuItem
                    target="ghostkit"
                >
                    { __( 'Ghost Kit' ) }
                </PluginSidebarMoreMenuItem>
                <PluginSidebar
                    name="ghostkit"
                    title={ __( 'Ghost Kit' ) }
                >
                    <PanelBody className="plugin-ghostkit-panel">
                        <Button
                            className="plugin-ghostkit-panel-button"
                            isDefault
                            isLarge
                            onClick={ () => {
                                this.setState( { isModalOpen: 'custom-code' } );
                            } }
                        >
                            { getIcon( 'plugin-custom-code', true ) }
                            { __( 'Custom CSS & JS' ) }
                        </Button>
                        <Button
                            className="plugin-ghostkit-panel-button"
                            isDefault
                            isLarge
                            onClick={ () => {
                                this.setState( { isModalOpen: 'customizer' } );
                            } }
                        >
                            { getIcon( 'plugin-customizer', true ) }
                            { __( 'Customizer' ) }
                        </Button>
                    </PanelBody>
                </PluginSidebar>
                { 'custom-code' === isModalOpen ? (
                    <CustomCodeModal
                        onRequestClose={ () => this.setState( { isModalOpen: false } ) }
                    />
                ) : '' }
                { 'customizer' === isModalOpen ? (
                    <CustomizerModal
                        onRequestClose={ () => this.setState( { isModalOpen: false } ) }
                    />
                ) : '' }
            </Fragment>
        );
    }
}

registerPlugin( 'ghostkit', {
    icon: <div className="ghostkit-plugin-icon">{ getIcon( 'plugin-ghostkit', true ) }</div>,
    render: GhostKit,
} );
