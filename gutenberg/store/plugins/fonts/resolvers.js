import * as actions from './actions';

export function* getCustomFonts() {
	const query = '/ghostkit/v1/get_custom_fonts/';
	const data = yield actions.apiFetch({ path: query });
	return actions.setCustomFonts(data);
}
