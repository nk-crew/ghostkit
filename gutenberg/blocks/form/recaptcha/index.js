import { debounce } from 'throttle-debounce';

import apiFetch from '@wordpress/api-fetch';
import { ExternalLink, PanelBody, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const { GHOSTKIT } = window;

const initialOpen =
	!GHOSTKIT.googleReCaptchaAPISiteKey ||
	!GHOSTKIT.googleReCaptchaAPISecretKey;

const saveAPIKeys = debounce(1500, (newSiteKey, newSecretKey) => {
	apiFetch({
		path: '/ghostkit/v1/update_google_recaptcha_keys',
		method: 'POST',
		data: {
			site_key: newSiteKey,
			secret_key: newSecretKey,
		},
	});
});

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

	return (
		<PanelBody
			title={__('Google reCAPTCHA', 'ghostkit')}
			initialOpen={initialOpen}
		>
			<TextControl
				label={__('Site Key', 'ghostkit')}
				value={apiSiteKey}
				onChange={(value) => {
					setApiSiteKey(value);
					saveAPIKeys(value, apiSecretKey);
				}}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
			<TextControl
				label={__('Secret Key', 'ghostkit')}
				value={apiSecretKey}
				onChange={(value) => {
					setApiSecretKey(value);
					saveAPIKeys(apiSiteKey, value);
				}}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
			<p>
				{__(
					'Protect your form from spam using Google reCAPTCHA v3.',
					'ghostkit'
				)}
			</p>
			<p>
				<ExternalLink href="https://www.google.com/recaptcha/about/">
					{__('Generate Keys', 'ghostkit')}
				</ExternalLink>
			</p>
		</PanelBody>
	);
}
