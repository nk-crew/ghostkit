/**
 * Import CSS
 */
import './editor.scss';

/**
 * WordPress dependencies
 */
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

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import { TemplatesModal } from '../templates';
import { CustomCodeModal } from '../custom-code';
import { CustomizerModal } from '../customizer';
import { TypographyModal } from '../typography';

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
                                this.setState( { isModalOpen: 'templates' } );
                            } }
                        >
                            { getIcon( 'plugin-templates' ) }
                            { __( 'Templates' ) }
                        </Button>
                        <Button
                            className="plugin-ghostkit-panel-button"
                            isDefault
                            isLarge
                            onClick={ () => {
                                this.setState( { isModalOpen: 'typography' } );
                            } }
                        >
                            { getIcon( 'plugin-typography' ) }
                            { __( 'Typography' ) }
                        </Button>
                        <Button
                            className="plugin-ghostkit-panel-button"
                            isDefault
                            isLarge
                            onClick={ () => {
                                this.setState( { isModalOpen: 'custom-code' } );
                            } }
                        >
                            { getIcon( 'plugin-custom-code' ) }
                            { __( 'CSS & JavaScript' ) }
                        </Button>
                        <Button
                            className="plugin-ghostkit-panel-button"
                            isDefault
                            isLarge
                            onClick={ () => {
                                this.setState( { isModalOpen: 'customizer' } );
                            } }
                        >
                            { getIcon( 'plugin-customizer' ) }
                            { __( 'Customizer' ) }
                        </Button>
                    </PanelBody>
                </PluginSidebar>
                { 'templates' === isModalOpen ? (
                    <TemplatesModal
                        onRequestClose={ () => this.setState( { isModalOpen: false } ) }
                    />
                ) : '' }
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
                { 'typography' === isModalOpen ? (
                    <TypographyModal
                        onRequestClose={ () => this.setState( { isModalOpen: false } ) }
                    />
                ) : '' }
            </Fragment>
        );
    }
}

registerPlugin( 'ghostkit', {
    icon: <div className="ghostkit-plugin-icon">{ getIcon( 'plugin-ghostkit' ) }</div>,
    render: GhostKit,
} );
