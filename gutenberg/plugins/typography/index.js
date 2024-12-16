import apiFetch from '@wordpress/api-fetch';
import { Button, TabPanel, Tooltip } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { PluginMoreMenuItem } from '@wordpress/editor';
import { Component } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import Modal from '../../components/modal';
import Typography from '../../components/typography';
import getIcon from '../../utils/get-icon';

const { GHOSTKIT } = window;

GHOSTKIT.added_fonts = [];

/**
 * Variable to simplify the relationship of filter Typography properties and objects
 */
const conformityAttributes = {
	'font-family': 'fontFamily',
	'font-family-category': 'fontFamilyCategory',
	'font-size': 'fontSize',
	'font-weight': 'fontWeight',
	'line-height': 'lineHeight',
	'letter-spacing': 'letterSpacing',
};

/**
 * Check value on the existence and emptiness.
 *
 * @param {Object} value - Cheching Value;
 * @return {boolean} - True or false.
 */
function isExist(value) {
	return (
		typeof value !== 'undefined' &&
		value !== '' &&
		value !== null &&
		value !== false
	);
}

/**
 * Get Current Fonts.
 *
 * @param {Object} typographyData - Typography Data.
 * @param {Array}  currentFonts   - Previous Array With Current Fonts.
 * @return {Array} currentFonts - Next Array With Current Fonts.
 */
function getCurrentFonts(typographyData, currentFonts) {
	if (typographyData !== false) {
		if (isExist(typographyData.ghostkit_typography)) {
			Object.keys(typographyData.ghostkit_typography).forEach(
				(typography) => {
					if (isExist(typography)) {
						const { fontFamily } =
							typographyData.ghostkit_typography[typography];
						const { fontFamilyCategory } =
							typographyData.ghostkit_typography[typography];
						let { fontWeight } =
							typographyData.ghostkit_typography[typography];
						const fontWeights = [];
						if (isExist(fontWeight)) {
							fontWeight = fontWeight.replace(/i/g, '');
							if (
								fontWeight !== '600' &&
								fontWeight !== '700' &&
								fontWeight !== '800' &&
								fontWeight !== '900' &&
								fontWeight !== '600i' &&
								fontWeight !== '700i' &&
								fontWeight !== '800i' &&
								fontWeight !== '900i'
							) {
								fontWeights.push(
									fontWeight,
									`${fontWeight}i`,
									'700',
									'700i'
								);
							} else {
								fontWeights.push(fontWeight, `${fontWeight}i`);
							}
						} else {
							fontWeights.push('400', '400i', '700', '700i');
						}
						if (
							isExist(fontFamily) &&
							isExist(fontFamilyCategory)
						) {
							currentFonts.push({
								family: fontFamilyCategory,
								label: fontFamily,
								weights: fontWeights,
							});
						}
					}
				}
			);
		}
	}
	return currentFonts;
}

/**
 * Print WebLoad fonts.
 *
 * @param {Object} typographyData - Typography Actual Data.
 */
function printFonts(typographyData) {
	const { fonts } = GHOSTKIT;

	let currentFonts = [];
	currentFonts = getCurrentFonts(
		typographyData.customTypography,
		currentFonts
	);
	currentFonts = getCurrentFonts(typographyData.meta, currentFonts);

	let uniqueFonts = currentFonts;

	const myData = uniqueFonts;

	uniqueFonts = Array.from(new Set(myData.map(JSON.stringify))).map(
		JSON.parse
	);

	const webfontList = [];

	Object.keys(uniqueFonts).forEach((font) => {
		if (
			isExist(uniqueFonts[font].family) &&
			fonts[uniqueFonts[font].family]
		) {
			Object.keys(fonts[uniqueFonts[font].family].fonts).forEach(
				(findFont) => {
					if (
						fonts[uniqueFonts[font].family].fonts[findFont].name ===
						uniqueFonts[font].label
					) {
						const { widths } =
							fonts[uniqueFonts[font].family].fonts[findFont];
						const weightsArray = [];

						if (typeof uniqueFonts[font].weights !== 'undefined') {
							Object.keys(uniqueFonts[font].weights).forEach(
								(weight) => {
									if (
										widths.indexOf(
											uniqueFonts[font].weights[weight]
										) !== -1
									) {
										weightsArray.push(
											uniqueFonts[font].weights[weight]
										);
									}
								}
							);
						}

						webfontList.push({
							family: uniqueFonts[font].family,
							name: uniqueFonts[font].label,
							weights: weightsArray,
							category:
								fonts[uniqueFonts[font].family].fonts[findFont]
									.category,
							subsets:
								fonts[uniqueFonts[font].family].fonts[findFont]
									.subsets,
						});
					}
				}
			);
		}
	});

	if (isExist(webfontList) && webfontList.length) {
		const googleFamilies = [];
		Object.keys(webfontList).forEach((key) => {
			if (webfontList[key].family === 'google-fonts') {
				let weights = '';
				if (typeof webfontList[key].weights !== 'undefined') {
					Object.keys(webfontList[key].weights).forEach(
						(keyWeight) => {
							if (
								keyWeight > 0 &&
								keyWeight !==
									webfontList[key].weights.length - 1
							) {
								weights += ',';
							}
							weights += webfontList[key].weights[keyWeight];
						}
					);
					googleFamilies.push(`${webfontList[key].name}:${weights}`);
				}
			}
		});
		Object.keys(GHOSTKIT.added_fonts).forEach((key) => {
			Object.keys(GHOSTKIT.added_fonts[key]).forEach((removeKey) => {
				Object.keys(googleFamilies).forEach((remove) => {
					if (
						GHOSTKIT.added_fonts[key][removeKey] ===
						googleFamilies[remove]
					) {
						googleFamilies.splice(remove, 1);
					}
				});
			});
		});

		GHOSTKIT.added_fonts.push(googleFamilies);

		// Insert CSS.
		if (googleFamilies.length) {
			let googleFontsUrl = '';

			googleFamilies.forEach((fontData) => {
				if (googleFontsUrl) {
					googleFontsUrl += '%7C';
				}

				googleFontsUrl += fontData;
			});

			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = `https://fonts.googleapis.com/css?family=${googleFontsUrl}`;
			document.head.appendChild(link);
		}

		doAction('ghostkit.typography.print.fonts', webfontList);
	}
}

/**
 * The function gets the current typography for generated styles.
 *
 * @param {Object} typographyData           - Typography Data.
 * @param {Array}  typographyPrepeareStyles - Previous Array With Current Styles Properties.
 * @return {*} - Next Array With Current Styles Properties.
 */
function getCurrentTypography(typographyData, typographyPrepeareStyles) {
	if (isExist(typographyData)) {
		if (isExist(typographyData.ghostkit_typography)) {
			Object.keys(typographyData.ghostkit_typography).forEach((key) => {
				if (
					isExist(typographyData.ghostkit_typography[key]) &&
					isExist(typographyPrepeareStyles[key])
				) {
					Object.keys(conformityAttributes).forEach((propertyKey) => {
						if (
							isExist(
								typographyData.ghostkit_typography[key][
									conformityAttributes[propertyKey]
								]
							) &&
							typeof typographyPrepeareStyles[key][
								'style-properties'
							][propertyKey] !== 'undefined'
						) {
							typographyPrepeareStyles[key]['style-properties'][
								propertyKey
							] =
								typographyData.ghostkit_typography[key][
									conformityAttributes[propertyKey]
								];
						}
					});
				}
			});
		}
	}
	return typographyPrepeareStyles;
}

/**
 * Print Typography Styles.
 *
 * @param {Object} typographyData - Typography Actual Data.
 */
function printStyles(typographyData) {
	const { customTypographyList } = GHOSTKIT;

	let typographyPrepeareStyles = [];
	let typographyCss = '';
	if (isExist(customTypographyList)) {
		Object.keys(customTypographyList).forEach((key) => {
			if (isExist(customTypographyList[key])) {
				if (
					isExist(customTypographyList[key].output) &&
					customTypographyList[key].output.length
				) {
					Object.keys(customTypographyList[key].output).forEach(
						(outputKey) => {
							if (
								customTypographyList[key].output[outputKey]
									.editor === true &&
								isExist(
									customTypographyList[key].output[outputKey]
										.selectors
								) &&
								isExist(customTypographyList[key].defaults)
							) {
								typographyPrepeareStyles[key] = {
									'style-properties': {
										...customTypographyList[key].defaults,
									},
									output: customTypographyList[key].output[
										outputKey
									].selectors,
								};
							}
						}
					);
				}
			}
		});

		// Global custom Typography.
		typographyPrepeareStyles = getCurrentTypography(
			typographyData.customTypography,
			typographyPrepeareStyles
		);
		// Local custom Typography.
		typographyPrepeareStyles = getCurrentTypography(
			typographyData.meta,
			typographyPrepeareStyles
		);

		if (isExist(typographyPrepeareStyles)) {
			Object.keys(typographyPrepeareStyles).forEach((key) => {
				let typographyStyles = '';
				if (isExist(typographyPrepeareStyles[key])) {
					if (isExist(typographyPrepeareStyles[key].output)) {
						typographyStyles = `${
							typographyStyles +
							typographyPrepeareStyles[key].output
						}{`;
						Object.keys(conformityAttributes).forEach(
							(propertyKey) => {
								if (
									isExist(
										typographyPrepeareStyles[key][
											'style-properties'
										][propertyKey]
									) &&
									propertyKey !== 'font-family-category'
								) {
									if (propertyKey === 'font-weight') {
										let fontWeight =
											typographyPrepeareStyles[key][
												'style-properties'
											][propertyKey];
										if (fontWeight.indexOf('i') > 0) {
											fontWeight = fontWeight.replace(
												/i/g,
												''
											);
											typographyStyles +=
												'font-style: italic;';
											typographyPrepeareStyles[key][
												'style-properties'
											][propertyKey] = fontWeight;
										} else if (fontWeight !== '') {
											typographyStyles +=
												'font-style: normal;';
										}
									}
									typographyStyles = `${
										typographyStyles + propertyKey
									}: ${
										typographyPrepeareStyles[key][
											'style-properties'
										][propertyKey]
									};`;
								}
							}
						);
						typographyStyles += '}';
					}
				}
				typographyCss += typographyStyles;
			});
		}

		const $styles = document.querySelector(
			'#ghostkit-typography-inline-css'
		);
		if ($styles) {
			$styles.innerHTML = typographyCss;
		}
	}
}

/**
 * The function checks and returns the default value of the state, if it exists.
 *
 * @param {Object} state - Typography State.
 * @return {string} - Default Value.
 */
export function getDefaultValue(state) {
	return typeof state === 'undefined' ||
		state === '' ||
		state === false ||
		state === null
		? ''
		: state;
}

/**
 * The function returns the default undefined values of options from the filter.
 *
 * @param {string} property                       - Property Object Key
 * @param {string} propertyName                   - Property Name
 * @param {Object} customTypographyPropertiesList - Typography List.
 * @return {boolean} - false if customTypographyPropertiesList options not define and value if option exist.
 */
export function setDefaultPropertyValues(
	property,
	propertyName,
	customTypographyPropertiesList
) {
	let defaultProperty = false;
	if (getDefaultValue(customTypographyPropertiesList) !== '') {
		if (
			typeof customTypographyPropertiesList[propertyName] === 'undefined'
		) {
			defaultProperty = undefined;
		} else if (typeof property !== 'undefined') {
			defaultProperty = property;
		} else if (
			typeof customTypographyPropertiesList[propertyName] !== 'undefined'
		) {
			defaultProperty =
				customTypographyPropertiesList[propertyName] !== ''
					? customTypographyPropertiesList[propertyName]
					: '';
		}
	}
	return defaultProperty;
}

/**
 * Function to get all default values from the database and from the typography filter.
 *
 * @param {Object}  setStateTypography - Current State.
 * @param {boolean} global             - Flag to check current options: global or local.
 * @return {{}} - Object with default values
 */
export function getCustomTypographyList(setStateTypography, global) {
	const { customTypographyList } = GHOSTKIT;

	const defaultTypography = {};

	if (
		typeof customTypographyList !== 'undefined' &&
		customTypographyList !== ''
	) {
		Object.keys(customTypographyList).forEach((key) => {
			const label = getDefaultValue(customTypographyList[key].label);
			const childOf = getDefaultValue(
				customTypographyList[key]['child-of']
			);

			if (
				getDefaultValue(setStateTypography) !== '' &&
				getDefaultValue(setStateTypography[key]) !== ''
			) {
				defaultTypography[key] = setStateTypography[key];

				Object.keys(conformityAttributes).forEach((property) => {
					const defaultProperty = setDefaultPropertyValues(
						setStateTypography[key][conformityAttributes[property]],
						property,
						customTypographyList[key].defaults
					);

					if (defaultProperty !== false) {
						defaultTypography[key][conformityAttributes[property]] =
							defaultProperty;
					}
				});

				defaultTypography[key].label = label;
				defaultTypography[key].childOf = childOf;
			} else if (
				getDefaultValue(customTypographyList[key].defaults) !== ''
			) {
				const fontName = getDefaultValue(
					customTypographyList[key].defaults['font-family']
				);
				const fontFamilyCategory = getDefaultValue(
					customTypographyList[key].defaults['font-family-category']
				);
				const weight = getDefaultValue(
					customTypographyList[key].defaults['font-weight']
				);

				let fontFamily;
				let fontWeight;
				let lineHeight;
				let letterSpacing;
				let fontSize;

				fontFamily = '';

				if (fontName !== '' && fontFamilyCategory !== '' && global) {
					fontFamily = fontName;
				}

				fontWeight = '';

				if (weight !== '' && global) {
					fontWeight = weight;
				}

				if (
					typeof customTypographyList[key].defaults['line-height'] ===
					'undefined'
				) {
					lineHeight = undefined;
				} else {
					lineHeight = global
						? customTypographyList[key].defaults['line-height']
						: '';
				}

				if (
					typeof customTypographyList[key].defaults[
						'letter-spacing'
					] === 'undefined'
				) {
					letterSpacing = undefined;
				} else {
					letterSpacing = global
						? customTypographyList[key].defaults['letter-spacing']
						: '';
				}

				fontSize = '';

				if (
					typeof customTypographyList[key].defaults['font-size'] !==
					'undefined'
				) {
					fontSize = global
						? customTypographyList[key].defaults['font-size']
						: '';
				}

				defaultTypography[key] = {
					fontFamily,
					fontFamilyCategory: getDefaultValue(
						customTypographyList[key].defaults[
							'font-family-category'
						]
					),
					fontSize,
					fontWeight,
					lineHeight,
					letterSpacing,
					label,
					childOf,
				};
			}
		});
	}
	return defaultTypography;
}

/**
 * Function to get the initial state state of the children. Sets the button open flag if at least one option is set in the child
 *
 * @param {Object} customTypographyList - Current typography List.
 * @return {{}} - An object with a list of states of a advanced button of child elements.
 */
export function getInitialAdvancedState(customTypographyList) {
	const advanced = {};

	Object.keys(customTypographyList).forEach((typography) => {
		if (
			typeof customTypographyList[typography].childOf !== 'undefined' &&
			customTypographyList[typography].childOf !== ''
		) {
			let showAdvanced = false;

			Object.keys(conformityAttributes).forEach((attribute) => {
				const metaTypographyAttribute =
					customTypographyList[typography][
						conformityAttributes[attribute]
					];
				if (
					typeof metaTypographyAttribute !== 'undefined' &&
					metaTypographyAttribute !== 'default' &&
					metaTypographyAttribute !== ''
				) {
					showAdvanced = true;
					advanced[customTypographyList[typography].childOf] =
						showAdvanced;
				}
			});

			if (
				advanced[customTypographyList[typography].childOf] !== true &&
				showAdvanced === false
			) {
				advanced[customTypographyList[typography].childOf] =
					showAdvanced;
			}
		}
	});

	return advanced;
}

class TypographyModal extends Component {
	constructor(props) {
		super(props);

		const { meta = {} } = this.props;

		this.state = {
			customTypography: getCustomTypographyList(
				meta.ghostkit_typography,
				false
			),
			advanced: getInitialAdvancedState(
				getCustomTypographyList(meta.ghostkit_typography, false)
			),
			globalCustomTypography: false,
			globalAdvanced: {},
		};

		this.maybePrepareGlobalTypographyAndAdvanced =
			this.maybePrepareGlobalTypographyAndAdvanced.bind(this);
	}

	componentDidMount() {
		this.maybePrepareGlobalTypographyAndAdvanced();
	}

	componentDidUpdate() {
		this.maybePrepareGlobalTypographyAndAdvanced();
	}

	/**
	 * Function for setting the current state with a list of child typographies and a button status flag when a button is clicked.
	 *
	 * @param {int}     key      - Typography identifier.
	 * @param {boolean} isGlobal - Flag of global customization.
	 */
	onClickAdvanced(key, isGlobal) {
		if (
			typeof this.state[isGlobal ? 'globalAdvanced' : 'advanced'] !==
			'undefined'
		) {
			this.setState((prevState) => ({
				[isGlobal ? 'globalAdvanced' : 'advanced']: {
					...prevState[isGlobal ? 'globalAdvanced' : 'advanced'],
					[key]: !prevState[isGlobal ? 'globalAdvanced' : 'advanced'][
						key
					],
				},
			}));
		}
	}

	/**
	 * The function returns a placeholder object.
	 *
	 * @param {string}  key      - Key of current typography.
	 * @param {boolean} isGlobal - Flag of global customization.
	 * @return {Object} - Placeholders Object.
	 */
	getPlaceholders(key, isGlobal) {
		const { customTypographyList } = GHOSTKIT;

		const placeholders = {
			'font-size': '-',
			'line-height': '-',
			'letter-spacing': '-',
		};

		Object.keys(placeholders).forEach((placeholderKey) => {
			const defaultProperty = isExist(
				customTypographyList[key].defaults[placeholderKey]
			)
				? customTypographyList[key].defaults[placeholderKey]
				: placeholders[placeholderKey];
			if (isGlobal) {
				placeholders[placeholderKey] = defaultProperty;
			} else if (isExist(this.state.globalCustomTypography[key])) {
				placeholders[placeholderKey] = isExist(
					this.state.globalCustomTypography[key][
						conformityAttributes[placeholderKey]
					]
				)
					? this.state.globalCustomTypography[key][
							conformityAttributes[placeholderKey]
						]
					: defaultProperty;
			}
		});

		return placeholders;
	}

	/**
	 * Function for get Child Render Typographies.
	 *
	 * @param {Object}  typographyList - Typography List.
	 * @param {int}     key            - Typography identifier.
	 * @param {boolean} isGlobal       - Flag of global customization.
	 * @return {Array} - Array with child typography objects.
	 */
	getChildrenTypography(typographyList, key, isGlobal) {
		const childTypographies = [];

		Object.keys(typographyList).forEach((childKey) => {
			if (typographyList[childKey].childOf === key) {
				childTypographies.push(
					<div key={childKey}>
						{this.getTypographyComponent(
							typographyList,
							childKey,
							isGlobal
						)}
					</div>
				);
			}
		});

		return childTypographies;
	}

	/**
	 * Function for get Typography Component.
	 *
	 * @param {Object}  typographyList - Typography List.
	 * @param {int}     key            - Typography identifier.
	 * @param {boolean} isGlobal       - Flag of global customization.
	 * @return {*} - Typography Object.
	 */
	getTypographyComponent(typographyList, key, isGlobal) {
		const placeholders = this.getPlaceholders(key, isGlobal);

		return (
			<Typography
				onChange={(opt) => {
					this.setState({
						[isGlobal
							? 'globalCustomTypography'
							: 'customTypography']: {
							...typographyList,
							[key]: {
								...typographyList[key],
								...opt,
							},
						},
					});
				}}
				fontFamily={typographyList[key].fontFamily}
				fontFamilyCategory={typographyList[key].fontFamilyCategory}
				fontWeight={typographyList[key].fontWeight}
				fontSize={typographyList[key].fontSize}
				lineHeight={typographyList[key].lineHeight}
				letterSpacing={typographyList[key].letterSpacing}
				label={typographyList[key].label}
				placeholders={placeholders}
				childOf={typographyList[key].childOf}
			/>
		);
	}

	maybePrepareGlobalTypographyAndAdvanced() {
		const { customTypography = {} } = this.props;

		if (customTypography && this.state.globalCustomTypography === false) {
			this.setState({
				globalCustomTypography:
					getCustomTypographyList(
						customTypography.ghostkit_typography,
						true
					) || '',
				globalAdvanced: getInitialAdvancedState(
					getCustomTypographyList(
						customTypography.ghostkit_typography,
						false
					)
				),
			});
		}
	}

	render() {
		const { updateMeta, updateCustomTypography, onRequestClose } =
			this.props;

		return (
			<Modal
				className="ghostkit-plugin-typography-modal"
				position="top"
				size="md"
				title={__('Typography', 'ghostkit')}
				onRequestClose={() => {
					const local = this.props.meta || {};
					const global = this.props.customTypography || {};
					const newLocal = {};
					const newGlobal = {};

					// Local
					if (
						this.state.customTypography !==
						local.ghostkit_typography
					) {
						newLocal.ghostkit_typography =
							this.state.customTypography;
					}

					if (Object.keys(newLocal).length) {
						updateMeta(newLocal);
					}

					// Global
					if (
						this.state.globalCustomTypography !==
						global.ghostkit_typography
					) {
						newGlobal.ghostkit_typography =
							this.state.globalCustomTypography;
					}

					if (Object.keys(newGlobal).length) {
						updateCustomTypography(newGlobal);
					}

					onRequestClose();
				}}
				icon={getIcon('plugin-typography')}
			>
				<TabPanel
					className="ghostkit-control-tabs ghostkit-component-modal-tab-panel"
					tabs={[
						{
							name: 'local',
							title: (
								<Tooltip
									text={__(
										'All changes will be applied on the current page only.',
										'ghostkit'
									)}
								>
									<span>{__('Local', 'ghostkit')}</span>
								</Tooltip>
							),
							className: 'ghostkit-control-tabs-tab',
						},
						{
							name: 'global',
							title: (
								<Tooltip
									text={__(
										'All changes will be applied site wide.',
										'ghostkit'
									)}
								>
									<span>{__('Global', 'ghostkit')}</span>
								</Tooltip>
							),
							className: 'ghostkit-control-tabs-tab',
						},
					]}
				>
					{(tabData) => {
						const isGlobal = tabData.name === 'global';
						const setStateTypography = isGlobal
							? this.state.globalCustomTypography
							: this.state.customTypography;
						const typographyList = getCustomTypographyList(
							setStateTypography,
							isGlobal
						);

						return (
							<>
								{Object.keys(typographyList).map((key) => {
									const advancedData =
										this.state[
											isGlobal
												? 'globalAdvanced'
												: 'advanced'
										][key];
									const advancedLabel =
										advancedData === true
											? __('Hide Advanced', 'ghostkit')
											: __('Show Advanced', 'ghostkit');

									if (typographyList[key].childOf === '') {
										return (
											<div
												className="ghostkit-typography-container"
												key={key}
											>
												{this.getTypographyComponent(
													typographyList,
													key,
													isGlobal
												)}

												{typeof advancedData !==
												'undefined' ? (
													<div className="ghostkit-typography-advanced">
														<Button
															variant="secondary"
															onClick={() =>
																this.onClickAdvanced(
																	key,
																	isGlobal
																)
															}
															className="ghostkit-typography-advanced-button"
														>
															{advancedLabel}
														</Button>
													</div>
												) : null}

												{advancedData === true
													? this.getChildrenTypography(
															typographyList,
															key,
															isGlobal
														)
													: ''}
											</div>
										);
									}

									return null;
								})}
							</>
						);
					}}
				</TabPanel>
			</Modal>
		);
	}
}

const TypographyModalWithSelect = compose([
	withSelect((select) => {
		const currentMeta =
			select('core/editor').getCurrentPostAttribute('meta');
		const editedMeta = select('core/editor').getEditedPostAttribute('meta');
		const customTypography = select(
			'ghostkit/plugins/typography'
		).getCustomTypography();

		try {
			currentMeta.ghostkit_typography = JSON.parse(
				currentMeta.ghostkit_typography
			);
		} catch (e) {}

		try {
			editedMeta.ghostkit_typography = JSON.parse(
				editedMeta.ghostkit_typography
			);
		} catch (e) {}

		try {
			customTypography.ghostkit_typography = JSON.parse(
				customTypography.ghostkit_typography
			);
		} catch (e) {}

		const typographyData = {
			meta: { ...currentMeta, ...editedMeta },
			customTypography,
		};

		printFonts(typographyData);
		printStyles(typographyData);

		return typographyData;
	}),
	withDispatch((dispatch) => ({
		updateMeta(value) {
			const localValue = {
				ghostkit_typography: JSON.stringify(value.ghostkit_typography),
			};

			dispatch('core/editor').editPost({ meta: localValue });
		},
		updateCustomTypography(value) {
			const globalValue = {
				ghostkit_typography: JSON.stringify(value.ghostkit_typography),
			};
			dispatch('ghostkit/plugins/typography').setCustomTypography(
				globalValue
			);

			apiFetch({
				path: '/ghostkit/v1/update_custom_typography',
				method: 'POST',
				data: {
					data: globalValue,
				},
			});
		},
	})),
])(TypographyModal);

export { TypographyModalWithSelect as TypographyModal };

export const name = 'ghostkit-typography';

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
						{__('Typography', 'ghostkit')}
					</PluginMoreMenuItem>
				) : null}
				{isModalOpen ? (
					<TypographyModalWithSelect
						onRequestClose={() =>
							this.setState({ isModalOpen: false })
						}
					/>
				) : null}
			</>
		);
	}
}
