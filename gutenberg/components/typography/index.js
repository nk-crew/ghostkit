import {
	DropdownMenu,
	ExternalLink,
	MenuGroup,
	MenuItem,
	Tooltip,
} from '@wordpress/components';
import { Component } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';
import ApplyFilters from '../apply-filters';
import InputDrag from '../input-drag';
import Select from '../select';

const { GHOSTKIT } = window;

const { version } = window.ghostkitVariables;

/**
 * Get Default Font
 *
 * @param {string} fontFamily - Current Font.
 * @return {*} - Current font or default label if font is empty.
 */
function getDefaultFont(fontFamily) {
	return fontFamily === '' ? __('Default Site Font', 'ghostkit') : fontFamily;
}

/**
 * Go over each fonts.
 *
 * @param {string} category - Font Family Category.
 * @return {*[]} - Fonts List.
 */
function getFonts(category = 'google-fonts') {
	const { fonts } = GHOSTKIT;

	const fontList = [];

	Object.keys(fonts).forEach((fontFamilyCategory) => {
		Object.keys(fonts[fontFamilyCategory].fonts).forEach((fontKey) => {
			const fontData = fonts[fontFamilyCategory].fonts[fontKey];
			let fontValue = fontData.name;

			if (fontFamilyCategory === 'default') {
				fontValue = '';
			}

			if (
				category === fontFamilyCategory ||
				fontFamilyCategory === 'default'
			) {
				fontList.push({
					value: fontValue,
					label: fontData.label || fontData.name,
					fontFamilyCategory,
				});
			}
		});
	});

	return fontList;
}

/**
 * Get Weight Label.
 *
 * @param {string} weight - Weight Value.
 * @return {string} - Weight Label.
 */
function getFontWeightLabel(weight) {
	let label = '';

	switch (weight) {
		case '':
			label = __('Default', 'ghostkit');
			break;
		case '100':
			label = __('Thin', 'ghostkit');
			break;
		case '100i':
			label = __('Thin Italic', 'ghostkit');
			break;
		case '200':
			label = __('Extra Light', 'ghostkit');
			break;
		case '200i':
			label = __('Extra Light Italic', 'ghostkit');
			break;
		case '300':
			label = __('Light', 'ghostkit');
			break;
		case '300i':
			label = __('Light Italic', 'ghostkit');
			break;
		case '400':
			label = __('Regular', 'ghostkit');
			break;
		case '400i':
			label = __('Regular Italic', 'ghostkit');
			break;
		case '500':
			label = __('Medium', 'ghostkit');
			break;
		case '500i':
			label = __('Medium Italic', 'ghostkit');
			break;
		case '600':
			label = __('Semi Bold', 'ghostkit');
			break;
		case '600i':
			label = __('Semi Bold Italic', 'ghostkit');
			break;
		case '700':
			label = __('Bold', 'ghostkit');
			break;
		case '700i':
			label = __('Bold Italic', 'ghostkit');
			break;
		case '800':
			label = __('Extra Bold', 'ghostkit');
			break;
		case '800i':
			label = __('Extra Bold Italic', 'ghostkit');
			break;
		case '900':
			label = __('Black', 'ghostkit');
			break;
		case '900i':
			label = __('Black Italic', 'ghostkit');
			break;
		// no default
	}

	return label;
}

/**
 * Get all font widths.
 *
 * @param {string} font               - search font.
 * @param {string} fontFamilyCategory - font fontFamilyCategory.
 * @return {Array} - all font widths.
 */
function getFontWeights(font, fontFamilyCategory) {
	const { fonts } = GHOSTKIT;

	const fontWeights = [];

	if (
		font !== '' &&
		fontFamilyCategory !== '' &&
		typeof font !== 'undefined' &&
		typeof fontFamilyCategory !== 'undefined' &&
		typeof fonts[fontFamilyCategory] !== 'undefined'
	) {
		Object.keys(fonts[fontFamilyCategory].fonts).forEach((fontKey) => {
			if (fonts[fontFamilyCategory].fonts[fontKey].name === font) {
				Object.keys(
					fonts[fontFamilyCategory].fonts[fontKey].widths
				).forEach((widthKey) => {
					const width =
						fonts[fontFamilyCategory].fonts[fontKey].widths[
							widthKey
						];
					fontWeights.push({
						value: width,
						label: getFontWeightLabel(width),
					});
				});
			}
		});
	}

	return fontWeights;
}

/**
 * Component Class
 */
export default class Typography extends Component {
	render() {
		let { fontFamilyCategory } = this.props;

		fontFamilyCategory =
			fontFamilyCategory === 'default'
				? 'google-fonts'
				: fontFamilyCategory;

		const {
			onChange,
			placeholders,
			label,
			fontFamily,
			fontWeight,
			fontSize,
			lineHeight,
			letterSpacing,
			childOf,
			fontWeights = getFontWeights(
				getDefaultFont(fontFamily),
				fontFamilyCategory
			),
		} = this.props;

		const fontsIcon = `icon-typography-${fontFamilyCategory}`;
		const allowFontSelectors = applyFilters(
			'ghostkit.typography.allow.fonts',
			fontFamilyCategory !== 'adobe-fonts' &&
				fontFamilyCategory !== 'custom-fonts',
			fontFamilyCategory
		);
		const fontFamilyValue = {
			value: fontFamily,
			label: getDefaultFont(fontFamily),
			fontFamilyCategory,
		};
		const fontWeightValue = {
			value: fontWeight,
			label: getFontWeightLabel(fontWeight),
		};
		const fontSizeValue = typeof fontSize === 'undefined' ? '' : fontSize;
		const fontFamilies = getFonts(fontFamilyCategory);

		// Find actual label.
		if (fontFamilyValue.value) {
			fontFamilies.forEach((familyData) => {
				if (fontFamilyValue.value === familyData.value) {
					fontFamilyValue.label = familyData.label;
				}
			});
		}

		return (
			<div
				className={`ghostkit-typography${
					childOf
						? ` ghostkit-typography-child ghostkit-typography-child-of-${childOf}`
						: ''
				}`}
			>
				<h4>{label}</h4>
				<div className="ghostkit-control-typography">
					{typeof fontFamilyCategory !== 'undefined' ? (
						<DropdownMenu
							icon={getIcon(fontsIcon, false)}
							label={__('Font Family Category', 'ghostkit')}
							popoverProps={{
								position: 'bottom right',
							}}
							menuProps={{
								className:
									'ghostkit-typography-font-category-control-menu',
							}}
							toggleProps={{
								className:
									'ghostkit-typography-font-category-control-toggle',
							}}
							hasArrowIndicator
						>
							{({ onClose }) => (
								<MenuGroup>
									<MenuItem
										icon={getIcon(
											'icon-typography-google-fonts',
											false
										)}
										onClick={() => {
											onChange({
												fontFamilyCategory:
													'google-fonts',
												fontFamily: '',
												fontWeight: '',
											});
											onClose();
										}}
									>
										{__('Google Fonts', 'ghostkit')}
									</MenuItem>
									<MenuItem
										icon={getIcon(
											'icon-typography-adobe-fonts',
											false
										)}
										onClick={() => {
											onChange({
												fontFamilyCategory:
													'adobe-fonts',
												fontFamily: '',
												fontWeight: '',
											});
											onClose();
										}}
									>
										{__('Adobe Fonts', 'ghostkit')}
										<span className="ghostkit-typography-badge-pro">
											{__('PRO', 'ghostkit')}
										</span>
									</MenuItem>
									<MenuItem
										icon={getIcon(
											'icon-typography-custom-fonts',
											false
										)}
										onClick={() => {
											onChange({
												fontFamilyCategory:
													'custom-fonts',
												fontFamily: '',
												fontWeight: '',
											});
											onClose();
										}}
									>
										{__('Custom Fonts', 'ghostkit')}
										<span className="ghostkit-typography-badge-pro">
											{__('PRO', 'ghostkit')}
										</span>
									</MenuItem>
								</MenuGroup>
							)}
						</DropdownMenu>
					) : null}
					<ApplyFilters
						name="ghostkit.typography.fontFamilySelector.info"
						props={this.props}
					>
						{fontFamilyCategory === 'adobe-fonts' ? (
							<div className="ghostkit-typography-information-control ghostkit-typography-font-control">
								{__(
									'Adobe Fonts available for Pro users only. Read more about Ghost Kit Pro plugin here - ',
									'ghostkit'
								)}
								<ExternalLink
									href={`https://www.ghostkit.io/pricing/?utm_source=plugin&utm_medium=settings&utm_campaign=adobe_fonts&utm_content=${version}`}
								>
									https://www.ghostkit.io/pricing/
								</ExternalLink>
							</div>
						) : null}
						{fontFamilyCategory === 'custom-fonts' ? (
							<div className="ghostkit-typography-information-control ghostkit-typography-font-control">
								{__(
									'Custom Fonts available for Pro users only. Read more about Ghost Kit Pro plugin here - ',
									'ghostkit'
								)}
								<ExternalLink
									href={`https://www.ghostkit.io/pricing/?utm_source=plugin&utm_medium=settings&utm_campaign=custom_fonts&utm_content=${version}`}
								>
									https://www.ghostkit.io/pricing/
								</ExternalLink>
							</div>
						) : null}
					</ApplyFilters>
					{typeof fontFamily !== 'undefined' && allowFontSelectors ? (
						<div className="ghostkit-typography-font-control">
							<Tooltip text={__('Font Family', 'ghostkit')}>
								<div>
									<Select
										value={fontFamilyValue}
										onChange={(opt) => {
											onChange({
												fontFamily:
													opt && opt.value
														? opt.value
														: '',
												fontWeight:
													opt && opt.value
														? '400'
														: '',
												fontFamilyCategory,
											});
										}}
										options={fontFamilies}
										placeholder={__(
											'--- Select Font Family ---',
											'ghostkit'
										)}
										className="ghostkit-typography-font-selector"
										menuPosition="fixed"
									/>
								</div>
							</Tooltip>
						</div>
					) : null}
					{typeof fontWeight !== 'undefined' && allowFontSelectors ? (
						<div className="ghostkit-typography-weight-control">
							<Tooltip text={__('Font Weight', 'ghostkit')}>
								<div>
									<Select
										value={fontWeightValue}
										onChange={(opt) => {
											onChange({
												fontWeight:
													opt && opt.value
														? opt.value
														: '',
											});
										}}
										options={fontWeights}
										placeholder={__(
											'--- Select Weight ---',
											'ghostkit'
										)}
										className="ghostkit-typography-weight-selector"
										classNamePrefix="ghostkit-typography-weight-selector"
										menuPosition="fixed"
									/>
								</div>
							</Tooltip>
						</div>
					) : null}
					{typeof fontSize !== 'undefined' ? (
						<div className="ghostkit-typography-size-control">
							<Tooltip text={__('Font Size', 'ghostkit')}>
								<div>
									<InputDrag
										value={fontSizeValue}
										placeholder={placeholders['font-size']}
										onChange={(value) => {
											onChange({
												fontSize: value,
											});
										}}
										autoComplete="off"
										icon={getIcon(
											'icon-typography-font-size'
										)}
										defaultUnit="px"
									/>
								</div>
							</Tooltip>
						</div>
					) : null}
					{typeof lineHeight !== 'undefined' ? (
						<div className="ghostkit-typography-line-control">
							<Tooltip text={__('Line Height', 'ghostkit')}>
								<div>
									<InputDrag
										value={lineHeight}
										placeholder={
											placeholders['line-height']
										}
										onChange={(value) => {
											onChange({
												lineHeight: value,
											});
										}}
										autoComplete="off"
										icon={getIcon(
											'icon-typography-line-height'
										)}
										step={0.1}
									/>
								</div>
							</Tooltip>
						</div>
					) : null}
					{typeof letterSpacing !== 'undefined' ? (
						<div className="ghostkit-typography-letter-control">
							<Tooltip text={__('Letter Spacing', 'ghostkit')}>
								<div>
									<InputDrag
										value={letterSpacing}
										placeholder={
											placeholders['letter-spacing']
										}
										onChange={(value) => {
											onChange({
												letterSpacing: value,
											});
										}}
										autoComplete="off"
										icon={getIcon(
											'icon-typography-letter-spacing'
										)}
										defaultUnit="em"
										step={0.01}
									/>
								</div>
							</Tooltip>
						</div>
					) : null}
				</div>
			</div>
		);
	}
}
