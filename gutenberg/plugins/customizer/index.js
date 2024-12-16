import { ColorPalette } from '@wordpress/block-editor';
import {
	BaseControl,
	RangeControl,
	SelectControl,
	Spinner,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { PluginMoreMenuItem } from '@wordpress/editor';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Modal from '../../components/modal';
import Select from '../../components/select';
import getIcon from '../../utils/get-icon';

class Customizer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			jsonOptions: false,
		};

		this.getOptionCategory = this.getOptionCategory.bind(this);
		this.getSelectedOptions = this.getSelectedOptions.bind(this);
		this.getSelectValues = this.getSelectValues.bind(this);
		this.updateOptions = this.updateOptions.bind(this);
	}

	/**
	 * Get options category label and slug by option data.
	 *
	 * @param {Object} opt - option data.
	 * @return {{slug: string, label: string}} - slug and label.
	 */
	getOptionCategory(opt) {
		let slug = '';
		let label = '';

		if (opt.panel && opt.panel.id) {
			slug = opt.panel.id;
			label = opt.panel.title;
		}
		if (opt.section && opt.section.id) {
			slug += opt.section.id;
			label += (label ? ' > ' : '') + opt.section.title;
		}

		label = label || __('Uncategorized', 'ghostkit');
		slug = slug || 'uncategorized';

		return {
			slug,
			label,
		};
	}

	/**
	 * Get current selected options.
	 *
	 * @return {Array} - options array.
	 */
	getSelectedOptions() {
		const { meta, customizerOptions } = this.props;

		let options = meta.ghostkit_customizer_options;

		if (!this.state.jsonOptions) {
			try {
				options = JSON.parse(decodeURI(options));
			} catch (e) {
				options = [];
			}
		} else {
			options = this.state.jsonOptions;
		}

		if (customizerOptions) {
			Object.keys(customizerOptions).forEach((k) => {
				const opt = customizerOptions[k];
				options.forEach((val, n) => {
					if (options[n] && options[n].id === opt.id) {
						const choices = [];

						if (opt.choices && Object.keys(opt.choices).length) {
							choices.push({
								value: '',
								label: '',
							});
							Object.keys(opt.choices).forEach((name) => {
								choices.push({
									value: name,
									label: `${opt.choices[name]} [${name}]`,
								});
							});
						}

						options[n].label = opt.label || opt.id;
						options[n].default = opt.default;
						options[n].type = opt.type;
						options[n].choices = choices;
						options[n].category = this.getOptionCategory(opt);
						options[n].control_type = opt.control_type;
					}
				});
			});
		}

		return options;
	}

	/**
	 * Get array ready for ReactSelect.
	 *
	 * @return {Array} - array with options.
	 */
	getSelectValues() {
		const { customizerOptions } = this.props;

		let result = false;

		if (customizerOptions) {
			result = [];
			const groupedList = {};

			Object.keys(customizerOptions).forEach((k) => {
				const val = customizerOptions[k];
				let prevent = false;

				// disable some options
				if (
					val.id === 'active_theme' ||
					(val.panel && val.panel.id && val.panel.id === 'widgets') ||
					(val.panel &&
						val.panel.id &&
						val.panel.id === 'nav_menus') ||
					(!val.panel &&
						val.type === 'option' &&
						/^widget_/.test(val.id)) ||
					(!val.panel &&
						val.type === 'option' &&
						/^sidebars_widgets\[/.test(val.id)) ||
					(!val.panel &&
						val.type === 'option' &&
						/^nav_menus_/.test(val.id))
				) {
					prevent = true;
				}

				if (!prevent) {
					const category = this.getOptionCategory(val);

					if (typeof groupedList[category.slug] === 'undefined') {
						groupedList[category.slug] = {
							label: category.label,
							options: [],
						};
					}

					groupedList[category.slug].options.push({
						label: val.label || val.id,
						value: val.id,
					});
				}
			});

			// We can't use groups because of react-virtualized and dynamic height of groups.
			// Instead add options in a plain list with group headings.
			Object.keys(groupedList).forEach((k) => {
				// Group label.
				result.push({
					label: `${groupedList[k].label}:`,
					value: `react-select-group-${k}`,
					isDisabled: true,
				});

				groupedList[k].options.forEach((option) => {
					result.push(option);
				});
			});
		}

		return result;
	}

	/**
	 * Update option when user changed something.
	 *
	 * @param {string} value - new option value
	 * @param {Object} opt   - option data.
	 */
	updateOptions(value, opt) {
		let options = this.getSelectedOptions();

		// remove option.
		if (value === null) {
			options = options.filter((item) => item.id !== opt.id);

			// add/update option
		} else {
			let updated = false;
			options.forEach((val, k) => {
				if (options[k] && options[k].id === opt.id) {
					options[k].value = value;
					updated = true;
				}
			});

			if (!updated) {
				options.unshift({
					id: opt.id,
					value,
				});
			}
		}

		this.setState({
			jsonOptions: options,
		});
	}

	render() {
		const { onRequestClose, updateMeta } = this.props;

		const options = this.getSelectedOptions();
		const customizerOptionsSelect = this.getSelectValues();

		return (
			<Modal
				className="ghostkit-plugin-customizer-modal"
				position="top"
				size="md"
				title={__('Customizer', 'ghostkit')}
				onRequestClose={() => {
					updateMeta({
						ghostkit_customizer_options: encodeURI(
							JSON.stringify(options)
						),
					});
					onRequestClose();
				}}
				icon={getIcon('plugin-customizer')}
			>
				{!customizerOptionsSelect ? (
					<div className="ghostkit-customizer-spinner">
						<Spinner />
					</div>
				) : null}
				{Array.isArray(customizerOptionsSelect) &&
				customizerOptionsSelect.length ? (
					<>
						<p className="ghostkit-help-text">
							{__(
								'Override Customizer options for the current post.',
								'ghostkit'
							)}
						</p>
						<Select
							value=""
							onChange={(opt) => {
								this.updateOptions('', {
									id: opt.value,
								});
							}}
							options={customizerOptionsSelect}
							placeholder={__(
								'--- Select Option ---',
								'ghostkit'
							)}
							menuPosition="fixed"
							grouped
						/>
					</>
				) : null}
				{Array.isArray(customizerOptionsSelect) &&
				!customizerOptionsSelect.length ? (
					<div className="ghostkit-customizer-info">
						{__(
							'No customizer options found. You can manually open ',
							'ghostkit'
						)}
						<strong>
							{__('Appearance > Customize', 'ghostkit')}
						</strong>
						{__(
							', and the list will be available here.',
							'ghostkit'
						)}
					</div>
				) : null}
				{Array.isArray(options) && options.length ? (
					<div className="ghostkit-customizer-list">
						{options.map((opt) => {
							let control = '';

							// Kirki support.
							switch (opt.control_type) {
								case 'kirki-color':
									control = (
										<BaseControl
											label={opt.label || opt.id}
											id={opt.id}
											className="ghostkit-customizer-list-field"
											__nextHasNoMarginBottom
										>
											<ColorPalette
												value={opt.value}
												onChange={(value) => {
													this.updateOptions(
														value,
														opt
													);
												}}
											/>
										</BaseControl>
									);
									break;
								case 'kirki-slider': {
									const sliderAttrs = {
										min: '',
										max: '',
										step: '',
									};
									if (opt.choices && opt.choices) {
										if (opt.choices.min) {
											sliderAttrs.min = opt.choices.min;
										}
										if (opt.choices.max) {
											sliderAttrs.max = opt.choices.max;
										}
										if (opt.choices.step) {
											sliderAttrs.step = opt.choices.step;
										}
									}
									control = (
										<RangeControl
											label={opt.label || opt.id}
											value={opt.value}
											onChange={(value) => {
												this.updateOptions(value, opt);
											}}
											className="ghostkit-customizer-list-field"
											__next40pxDefaultSize
											__nextHasNoMarginBottom
											{...sliderAttrs}
										/>
									);
									break;
								}
								case 'kirki-toggle':
									control = (
										<ToggleControl
											label={opt.label || opt.id}
											checked={opt.value === 'on'}
											onChange={(value) => {
												this.updateOptions(
													value ? 'on' : 'off',
													opt
												);
											}}
											className="ghostkit-customizer-list-field"
											__nextHasNoMarginBottom
										/>
									);
									break;
								case 'kirki-editor':
									control = (
										<TextareaControl
											label={opt.label || opt.id}
											value={opt.value}
											onChange={(value) => {
												this.updateOptions(value, opt);
											}}
											className="ghostkit-customizer-list-field"
											__nextHasNoMarginBottom
										/>
									);
									break;
								case 'kirki-image':
									opt.choices = [];
								// fallthrough
								default:
									if (opt.choices && opt.choices.length) {
										control = (
											<SelectControl
												label={opt.label || opt.id}
												value={opt.value}
												options={opt.choices}
												onChange={(value) => {
													this.updateOptions(
														value,
														opt
													);
												}}
												className="ghostkit-customizer-list-field"
												__next40pxDefaultSize
												__nextHasNoMarginBottom
											/>
										);
									} else {
										control = (
											<TextControl
												label={opt.label || opt.id}
												value={opt.value}
												onChange={(value) => {
													this.updateOptions(
														value,
														opt
													);
												}}
												className="ghostkit-customizer-list-field"
												__next40pxDefaultSize
												__nextHasNoMarginBottom
											/>
										);
									}
									break;
							}

							return (
								<div key={opt.id}>
									{control}
									<div className="ghostkit-customizer-list-info">
										<small className="ghostkit-customizer-list-info-id">
											{opt.id}
										</small>
										{opt.default ||
										typeof opt.default === 'boolean' ? (
											<small className="ghostkit-customizer-list-info-default">
												{__('Default:', 'ghostkit')}{' '}
												<span>
													{typeof opt.default ===
													'boolean'
														? opt.default.toString()
														: opt.default}
												</span>
											</small>
										) : null}
									</div>
									<button
										className="ghostkit-customizer-list-remove"
										onClick={(e) => {
											e.preventDefault();
											this.updateOptions(null, opt);
										}}
									>
										<span className="dashicons dashicons-no-alt" />
									</button>
								</div>
							);
						})}
					</div>
				) : null}
			</Modal>
		);
	}
}

const CustomizerModalWithSelect = compose([
	withSelect((select) => {
		const currentMeta =
			select('core/editor').getCurrentPostAttribute('meta');
		const editedMeta = select('core/editor').getEditedPostAttribute('meta');

		return {
			meta: { ...currentMeta, ...editedMeta },
			customizerOptions: select(
				'ghostkit/plugins/customizer'
			).getCustomizerData(),
		};
	}),
	withDispatch((dispatch) => ({
		updateMeta(value) {
			dispatch('core/editor').editPost({ meta: value });
		},
	})),
])(Customizer);

export { CustomizerModalWithSelect as CustomizerModal };

export const name = 'ghostkit-customizer';

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
						{__('Customizer', 'ghostkit')}
					</PluginMoreMenuItem>
				) : null}
				{isModalOpen ? (
					<CustomizerModalWithSelect
						onRequestClose={() =>
							this.setState({ isModalOpen: false })
						}
					/>
				) : null}
			</>
		);
	}
}
