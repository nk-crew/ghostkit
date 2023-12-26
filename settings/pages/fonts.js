/**
 * Import CSS
 */
import './fonts.scss';

import classnames from 'classnames/dedupe';

import { ExternalLink, TabPanel } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import ApplyFilters from '../../gutenberg/components/apply-filters';
import GoogleFonts from '../../gutenberg/components/google-fonts';

const { merge } = window.lodash;

import apiFetch from '@wordpress/api-fetch';

const { isFseTheme, typographyExist, fontsApiExist, version } =
	window.ghostkitVariables;

let reloadPage = false;

class FontsSettings extends Component {
	/**
	 * We should reload page after fonts updated and when we visit the Fonts settings page.
	 */
	componentWillUnmount() {
		if (reloadPage) {
			setTimeout(() => {
				window.location.reload();
			}, 0);
		}
	}

	render() {
		const { getIcon, customFonts, updateFonts } = this.props;

		const classes = classnames(
			'ghostkit-settings-content-wrapper ghostkit-settings-fonts'
		);

		return (
			<ApplyFilters name="ghostkit.fonts.settings" props={this.props}>
				{isFseTheme && fontsApiExist && !typographyExist ? (
					<div className={classes}>
						<TabPanel
							className="ghostkit-settings-fonts-tabs"
							tabs={[
								{
									name: 'google',
									title: (
										<span>
											{getIcon(
												'icon-typography-google-fonts',
												false
											)}
											{__('Google Fonts', 'ghostkit')}
										</span>
									),
								},
								{
									name: 'adobe',
									title: (
										<span>
											{getIcon(
												'icon-typography-adobe-fonts',
												false
											)}
											{__('Adobe Fonts', 'ghostkit')}
										</span>
									),
								},
								{
									name: 'custom',
									title: (
										<span>
											{getIcon(
												'icon-typography-custom-fonts',
												false
											)}
											{__('Custom Fonts', 'ghostkit')}
										</span>
									),
								},
							]}
						>
							{(data) => {
								if (data.name === 'google') {
									return (
										<GoogleFonts
											customFonts={customFonts}
											updateFonts={updateFonts}
										/>
									);
								}

								if (data.name === 'custom') {
									return (
										<div className="ghostkit-settings-content-wrapper ghostkit-settings-fonts">
											{__(
												'Custom Fonts available for Pro users only. Read more about Ghost Kit Pro plugin here - ',
												'ghostkit'
											)}
											<ExternalLink
												href={`https://ghostkit.io/pricing/?utm_source=plugin&utm_medium=settings&utm_campaign=fonts&utm_content=${version}`}
											>
												https://ghostkit.io/pricing/
											</ExternalLink>
										</div>
									);
								}

								return (
									<div className="ghostkit-settings-content-wrapper ghostkit-settings-fonts">
										{__(
											'Adobe Fonts available for Pro users only. Read more about Ghost Kit Pro plugin here - ',
											'ghostkit'
										)}
										<ExternalLink
											href={`https://ghostkit.io/pricing/?utm_source=plugin&utm_medium=settings&utm_campaign=fonts&utm_content=${version}`}
										>
											https://ghostkit.io/pricing/
										</ExternalLink>
									</div>
								);
							}}
						</TabPanel>
					</div>
				) : (
					<div className="ghostkit-settings-content-wrapper ghostkit-settings-fonts">
						{__(
							'Adobe and Custom Fonts available for Pro users only. Read more about Ghost Kit Pro plugin here - ',
							'ghostkit'
						)}
						<ExternalLink
							href={`https://ghostkit.io/pricing/?utm_source=plugin&utm_medium=settings&utm_campaign=fonts&utm_content=${version}`}
						>
							https://ghostkit.io/pricing/
						</ExternalLink>
					</div>
				)}
			</ApplyFilters>
		);
	}
}

const ComposeFontsSettings = compose([
	withSelect((select) => {
		const { getIcon } = select('ghostkit/base/utils').get();

		const customFonts = select('ghostkit/plugins/fonts').getCustomFonts();

		const defaultCustomFonts = {
			adobe: {
				token: false,
				errors: false,
				kits: false,
				kit: false,
				fonts: false,
			},
			google: false,
			custom: false,
		};

		return {
			getIcon,
			customFonts: merge(defaultCustomFonts, customFonts),
		};
	}),
	withDispatch((dispatch) => ({
		updateFonts(value) {
			dispatch('ghostkit/plugins/fonts').setCustomFonts(value);

			apiFetch({
				path: '/ghostkit/v1/update_custom_fonts',
				method: 'POST',
				data: {
					data: value,
				},
			}).then(() => {
				reloadPage = true;
			});
		},
	})),
])(FontsSettings);

export default function addFontSettings(Control, props) {
	return <ComposeFontsSettings {...props} />;
}
