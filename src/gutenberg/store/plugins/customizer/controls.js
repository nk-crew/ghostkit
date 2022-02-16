/**
 * WordPress dependencies
 */
const { apiFetch } = wp;

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
      if (fetchedData && fetchedData.error && 'no_options_found' === fetchedData.error_code) {
        await maybeGetCustomizerData();
        return apiFetch(request);
      }

      return fetchedData;
    })
    .catch((fetchedData) => {
      if (fetchedData && fetchedData.error && 'no_options_found' === fetchedData.error_code) {
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
