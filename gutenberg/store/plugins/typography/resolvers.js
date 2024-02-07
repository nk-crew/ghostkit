import * as actions from './actions';

export function* getCustomTypography() {
	const query = '/ghostkit/v1/get_custom_typography/';
	const data = yield actions.apiFetch({ path: query });
	return actions.setCustomTypography(data);
}
