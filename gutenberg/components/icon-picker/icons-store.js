import apiFetch from '@wordpress/api-fetch';
import { useEffect, useSyncExternalStore } from '@wordpress/element';

// The full icons list is about 2MB, so it is not printed with the page.
// It is fetched once per page load, the first time something needs it.
let state = { icons: null, error: false };
let request = null;
const listeners = new Set();

function setState(newState) {
	state = newState;
	listeners.forEach((listener) => {
		listener();
	});
}

function subscribe(listener) {
	listeners.add(listener);

	return () => listeners.delete(listener);
}

function getState() {
	return state;
}

export function loadIcons() {
	if (!request) {
		request = apiFetch({ path: '/ghostkit/v1/get_icons/' })
			.then((result) => {
				setState({ icons: result?.response || {}, error: false });
			})
			.catch((error) => {
				// Allow the next caller to retry.
				request = null;
				setState({ icons: null, error: true });

				// eslint-disable-next-line no-console
				console.error(error);
			});
	}

	return request;
}

/**
 * Icons list, loaded on demand.
 *
 * @param {boolean} load load the list if it is not loaded yet.
 *
 * @return {Object} `{ icons, error }`, icons is null until loaded.
 */
export function useIcons(load = true) {
	const current = useSyncExternalStore(subscribe, getState);

	useEffect(() => {
		if (load && !current.icons) {
			loadIcons();
		}
	}, [load, current.icons]);

	return current;
}
