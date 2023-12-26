import { debounce } from 'throttle-debounce';

import apiFetch from '@wordpress/api-fetch';
import { ExternalLink, PanelBody, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const { GHOSTKIT } = window;

/**
 * Block Settings Class.
 */
export default function BlockSettings() {
	const [apiSiteKey, setApiSiteKey] = useState(
		GHOSTKIT.googleReCaptchaAPISiteKey
	);
	const [apiSecretKey, setApiSecretKey] = useState(
		GHOSTKIT.googleReCaptchaAPISecretKey
	);

	const saveAPIKeys = debounce(3000, () => {
		if (
			GHOSTKIT.googleReCaptchaAPISiteKey !== apiSiteKey ||
			GHOSTKIT.googleReCaptchaAPISecretKey !== apiSecretKey
		) {
			apiFetch({
				path: '/ghostkit/v1/update_google_recaptcha_keys',
				method: 'POST',
				data: {
					site_key: apiSiteKey,
					secret_key: apiSecretKey,
				},
			});
		}
	});

	return (
		<PanelBody
			title={__('Google reCAPTCHA', 'ghostkit')}
			initialOpen={!(apiSiteKey && apiSecretKey)}
		>
			<TextControl
				label={__('Site Key', 'ghostkit')}
				value={apiSiteKey}
				onChange={(value) => {
					setApiSiteKey(value);
					saveAPIKeys();
				}}
			/>
			<TextControl
				label={__('Secret Key', 'ghostkit')}
				value={apiSecretKey}
				onChange={(value) => {
					setApiSecretKey(value);
					saveAPIKeys();
				}}
			/>
			<p>
				{__(
					'Protect your form from spam using Google reCAPTCHA v3.',
					'ghostkit'
				)}
			</p>
			<p>
				<ExternalLink href="https://g.co/recaptcha/v3">
					{__('Generate Keys', 'ghostkit')}
				</ExternalLink>
			</p>
		</PanelBody>
	);
}
