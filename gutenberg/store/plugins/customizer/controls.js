import apiFetch from '@wordpress/api-fetch';

export function API_FETCH({ request }) {
	// create iframe with customizer url to prepare customizer data.
	async function maybeGetCustomizerData() {
		const promise = new Promise((resolve) => {
			const iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.onload = () => {
				iframe.parentNode.removeChild(iframe);
				resolve();
			};
			iframe.src = `${window.GHOSTKIT.adminUrl}customize.php`;
			document.body.appendChild(iframe);
		});

		return promise;
	}

	return apiFetch(request)
		.catch(async (fetchedData) => {
			// try to get customizer data.
			if (
				fetchedData &&
				fetchedData.error &&
				fetchedData.error_code === 'no_options_found'
			) {
				await maybeGetCustomizerData();
				return apiFetch(request);
			}

			return fetchedData;
		})
		.catch((fetchedData) => {
			if (
				fetchedData &&
				fetchedData.error &&
				fetchedData.error_code === 'no_options_found'
			) {
				return {
					response: {},
					error: false,
					success: true,
				};
			}

			return false;
		})
		.then((fetchedData) => {
			if (fetchedData && fetchedData.success && fetchedData.response) {
				return fetchedData.response;
			}
			return {};
		});
}
