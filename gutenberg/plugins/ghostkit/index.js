import { Button, PanelBody } from '@wordpress/components';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';
import { ColorPaletteModal } from '../color-palette';
import { CustomCodeModal } from '../custom-code';
import { CustomizerModal } from '../customizer';
import { TemplatesModal } from '../templates';
import { TypographyModal } from '../typography';

const { GHOSTKIT } = window;

export const name = 'ghostkit';

export const icon = (
	<div className="ghostkit-plugin-icon">{getIcon('ghostkit-logo')}</div>
);

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
			<>
				{PluginSidebarMoreMenuItem ? (
					<PluginSidebarMoreMenuItem target="ghostkit">
						{__('Ghost Kit', 'ghostkit')}
					</PluginSidebarMoreMenuItem>
				) : null}
				{PluginSidebar ? (
					<PluginSidebar
						name="ghostkit"
						title={__('Ghost Kit', 'ghostkit')}
					>
						<PanelBody className="plugin-ghostkit-panel">
							<Button
								className="plugin-ghostkit-panel-button"
								variant="secondary"
								onClick={() => {
									this.setState({
										isModalOpen: 'typography',
									});
								}}
							>
								{getIcon('plugin-typography')}
								{__('Typography', 'ghostkit')}
							</Button>
							<Button
								className="plugin-ghostkit-panel-button"
								variant="secondary"
								onClick={() => {
									this.setState({
										isModalOpen: 'custom-code',
									});
								}}
							>
								{getIcon('plugin-custom-code')}
								{__('CSS & JavaScript', 'ghostkit')}
							</Button>
							{GHOSTKIT.allowTemplates && (
								<Button
									className="plugin-ghostkit-panel-button"
									variant="secondary"
									onClick={() => {
										this.setState({
											isModalOpen: 'templates',
										});
									}}
								>
									{getIcon('plugin-templates')}
									{__('Templates', 'ghostkit')}
								</Button>
							)}
							{GHOSTKIT.allowPluginColorPalette ? (
								<Button
									className="plugin-ghostkit-panel-button"
									variant="secondary"
									onClick={() => {
										this.setState({
											isModalOpen: 'color-palette',
										});
									}}
								>
									{getIcon('plugin-color-palette')}
									{__('Color Palette', 'ghostkit')}
								</Button>
							) : null}
							{GHOSTKIT.allowPluginCustomizer ? (
								<Button
									className="plugin-ghostkit-panel-button"
									variant="secondary"
									onClick={() => {
										this.setState({
											isModalOpen: 'customizer',
										});
									}}
								>
									{getIcon('plugin-customizer')}
									{__('Customizer', 'ghostkit')}
								</Button>
							) : null}
						</PanelBody>
					</PluginSidebar>
				) : null}
				{isModalOpen === 'templates' ? (
					<TemplatesModal
						onRequestClose={() =>
							this.setState({ isModalOpen: false })
						}
					/>
				) : null}
				{isModalOpen === 'typography' ? (
					<TypographyModal
						onRequestClose={() =>
							this.setState({ isModalOpen: false })
						}
					/>
				) : null}
				{isModalOpen === 'custom-code' ? (
					<CustomCodeModal
						onRequestClose={() =>
							this.setState({ isModalOpen: false })
						}
					/>
				) : null}
				{isModalOpen === 'color-palette' ? (
					<ColorPaletteModal
						onRequestClose={() =>
							this.setState({ isModalOpen: false })
						}
					/>
				) : null}
				{isModalOpen === 'customizer' ? (
					<CustomizerModal
						onRequestClose={() =>
							this.setState({ isModalOpen: false })
						}
					/>
				) : null}
			</>
		);
	}
}
