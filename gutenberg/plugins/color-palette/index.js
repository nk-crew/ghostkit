import apiFetch from '@wordpress/api-fetch';
import {
	BaseControl,
	Button,
	TextControl,
	Tooltip,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { PluginMoreMenuItem } from '@wordpress/editor';
import { Component } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import ColorPicker from '../../components/color-picker';
import Modal from '../../components/modal';
import getIcon from '../../utils/get-icon';
import { getSlug } from '../../utils/get-unique-slug';

class ColorPaletteModal extends Component {
	constructor(props) {
		super(props);

		this.isUniqueSlug = this.isUniqueSlug.bind(this);
		this.getUniqueSlug = this.getUniqueSlug.bind(this);
	}

	getUniqueSlug(name) {
		let newSlug = '';
		let i = 0;

		name = name.replace(/-/g, ' ');

		while (!newSlug || !this.isUniqueSlug(newSlug)) {
			if (newSlug) {
				i += 1;
			}
			newSlug = `${getSlug(name)}${i ? `-${i}` : ''}`;
		}

		return newSlug;
	}

	isUniqueSlug(slug) {
		const { colors } = this.props;

		let isUnique = true;

		colors.forEach((color) => {
			if (color.slug === slug) {
				isUnique = false;
			}
		});

		return isUnique;
	}

	render() {
		const { updateColorPalette, onRequestClose, colors } = this.props;

		return (
			<Modal
				className="ghostkit-plugin-color-palette-modal"
				position="top"
				size="md"
				title={__('Color Palette', 'ghostkit')}
				onRequestClose={() => {
					updateColorPalette(colors, true);
					onRequestClose();
				}}
				icon={getIcon('plugin-color-palette')}
			>
				<h4>{__('Default Colors', 'ghostkit')}</h4>
				<div className="ghostkit-plugin-color-palette-list ghostkit-plugin-color-palette-list-default">
					{colors.map((data) => {
						if (/^ghostkit-color-/g.test(data.slug)) {
							return null;
						}

						return (
							<ColorPicker
								key={data.slug}
								value={data.color}
								hint={data.name}
								colorPalette={false}
								onChange={() => {}}
							/>
						);
					})}
				</div>

				<h4>{__('Custom Colors', 'ghostkit')}</h4>
				<div className="ghostkit-plugin-color-palette-list">
					{colors.map((data, i) => {
						if (!/^ghostkit-color-/g.test(data.slug)) {
							return null;
						}

						const colorName = `palette-item-${i}`;

						return (
							<ColorPicker
								key={colorName}
								value={data.color}
								hint={data.name}
								colorPalette={false}
								onChange={(value) => {
									const newColors = colors.map(
										(thisData) => ({
											...thisData,
											color:
												data.slug === thisData.slug
													? value
													: thisData.color,
										})
									);
									updateColorPalette(newColors);
								}}
								afterDropdownContent={
									<>
										<TextControl
											label={__('Name', 'ghostkit')}
											value={data.name}
											onChange={(value) => {
												const newColors = colors.map(
													(thisData) => ({
														...thisData,
														slug:
															data.slug ===
															thisData.slug
																? this.getUniqueSlug(
																		`ghostkit-color-${value}`
																	)
																: thisData.slug,
														name:
															data.slug ===
															thisData.slug
																? value
																: thisData.name,
													})
												);
												updateColorPalette(newColors);
											}}
											style={{ marginTop: 0 }}
											__next40pxDefaultSize
											__nextHasNoMarginBottom
										/>
										<BaseControl __nextHasNoMarginBottom>
											<Button
												onClick={() => {
													if (
														// eslint-disable-next-line no-alert
														window.confirm(
															sprintf(
																__(
																	'Remove color "%1$s" with name "%2$s"?',
																	'ghostkit'
																),
																data.color,
																data.name
															)
														)
													) {
														const newColors =
															colors.filter(
																(thisData) =>
																	data.slug !==
																	thisData.slug
															);
														updateColorPalette(
															newColors
														);
													}
												}}
												variant="secondary"
											>
												{__('Remove', 'ghostkit')}
											</Button>
										</BaseControl>
									</>
								}
							/>
						);
					})}
					<div className="ghostkit-plugin-color-palette-list-add-new components-base-control ghostkit-component-color-picker-wrapper">
						<div className="components-base-control__field">
							<div className="components-color-palette__item-wrapper components-circular-option-picker__option-wrapper">
								<Tooltip
									text={__('Add Custom Color', 'ghostkit')}
								>
									<button
										type="button"
										className="components-color-palette__item components-circular-option-picker__option"
										onClick={() => {
											updateColorPalette([
												...colors,
												{
													slug: this.getUniqueSlug(
														'ghostkit-color-blue'
													),
													color: '#0366d6',
													name: __(
														'Blue',
														'ghostkit'
													),
												},
											]);
										}}
									>
										<span className="components-color-palette__custom-color-gradient">
											+
										</span>
									</button>
								</Tooltip>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
}

const ColorPaletteModalWithSelect = compose([
	withSelect((select) => {
		const { getSettings } = select('core/block-editor');
		const settings = getSettings();

		return {
			colors: settings.colors || [],
		};
	}),
	withDispatch((dispatch) => ({
		updateColorPalette(newColors, ajaxSave) {
			const { updateSettings } = dispatch('core/block-editor');

			updateSettings({ colors: newColors });

			if (ajaxSave) {
				const customColors = newColors.filter((data) =>
					/^ghostkit-color-/g.test(data.slug)
				);

				apiFetch({
					path: '/ghostkit/v1/update_color_palette',
					method: 'POST',
					data: {
						data: customColors,
					},
				});
			}
		},
	})),
])(ColorPaletteModal);

export { ColorPaletteModalWithSelect as ColorPaletteModal };

export const name = 'ghostkit-color-palette';

export const icon = null;

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
				{PluginMoreMenuItem ? (
					<PluginMoreMenuItem
						icon={null}
						onClick={() => {
							this.setState({ isModalOpen: true });
						}}
					>
						{__('Color Palette', 'ghostkit')}
					</PluginMoreMenuItem>
				) : null}
				{isModalOpen ? (
					<ColorPaletteModalWithSelect
						onRequestClose={() =>
							this.setState({ isModalOpen: false })
						}
					/>
				) : null}
			</>
		);
	}
}
