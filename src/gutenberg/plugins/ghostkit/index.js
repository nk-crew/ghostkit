/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import { TemplatesModal } from '../templates';
import { TypographyModal } from '../typography';
import { CustomCodeModal } from '../custom-code';
import { ColorPaletteModal } from '../color-palette';
import { CustomizerModal } from '../customizer';

/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

const { __ } = wp.i18n;
const { Component } = wp.element;

const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost || {};

const { Button, PanelBody } = wp.components;

const { GHOSTKIT } = window;

export const name = 'ghostkit';

export const icon = <div className="ghostkit-plugin-icon">{getIcon('plugin-ghostkit')}</div>;

export class Plugin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };
  }

  render() {
    const { isModalOpen } = this.state;

    return (
      <Fragment>
        {PluginSidebarMoreMenuItem ? (
          <PluginSidebarMoreMenuItem target="ghostkit">
            {__('Ghost Kit', '@@text_domain')}
          </PluginSidebarMoreMenuItem>
        ) : null}
        {PluginSidebar ? (
          <PluginSidebar name="ghostkit" title={__('Ghost Kit', '@@text_domain')}>
            <PanelBody className="plugin-ghostkit-panel">
              <Button
                className="plugin-ghostkit-panel-button"
                isSecondary
                isLarge
                onClick={() => {
                  this.setState({ isModalOpen: 'templates' });
                }}
              >
                {getIcon('plugin-templates')}
                {__('Templates', '@@text_domain')}
              </Button>
              <Button
                className="plugin-ghostkit-panel-button"
                isSecondary
                isLarge
                onClick={() => {
                  this.setState({ isModalOpen: 'typography' });
                }}
              >
                {getIcon('plugin-typography')}
                {__('Typography', '@@text_domain')}
              </Button>
              <Button
                className="plugin-ghostkit-panel-button"
                isSecondary
                isLarge
                onClick={() => {
                  this.setState({ isModalOpen: 'custom-code' });
                }}
              >
                {getIcon('plugin-custom-code')}
                {__('CSS & JavaScript', '@@text_domain')}
              </Button>
              {GHOSTKIT.allowPluginColorPalette ? (
                <Button
                  className="plugin-ghostkit-panel-button"
                  isSecondary
                  isLarge
                  onClick={() => {
                    this.setState({ isModalOpen: 'color-palette' });
                  }}
                >
                  {getIcon('plugin-color-palette')}
                  {__('Color Palette', '@@text_domain')}
                </Button>
              ) : null}
              {GHOSTKIT.allowPluginCustomizer ? (
                <Button
                  className="plugin-ghostkit-panel-button"
                  isSecondary
                  isLarge
                  onClick={() => {
                    this.setState({ isModalOpen: 'customizer' });
                  }}
                >
                  {getIcon('plugin-customizer')}
                  {__('Customizer', '@@text_domain')}
                </Button>
              ) : null}
            </PanelBody>
          </PluginSidebar>
        ) : null}
        {isModalOpen === 'templates' ? (
          <TemplatesModal onRequestClose={() => this.setState({ isModalOpen: false })} />
        ) : (
          ''
        )}
        {isModalOpen === 'typography' ? (
          <TypographyModal onRequestClose={() => this.setState({ isModalOpen: false })} />
        ) : (
          ''
        )}
        {isModalOpen === 'custom-code' ? (
          <CustomCodeModal onRequestClose={() => this.setState({ isModalOpen: false })} />
        ) : (
          ''
        )}
        {isModalOpen === 'color-palette' ? (
          <ColorPaletteModal onRequestClose={() => this.setState({ isModalOpen: false })} />
        ) : (
          ''
        )}
        {isModalOpen === 'customizer' ? (
          <CustomizerModal onRequestClose={() => this.setState({ isModalOpen: false })} />
        ) : (
          ''
        )}
      </Fragment>
    );
  }
}
