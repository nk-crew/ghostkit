import * as actions from './actions';

export function* getCustomCode() {
	const query = '/ghostkit/v1/get_custom_code/';
	const data = yield actions.apiFetch({ path: query });

	return actions.setCustomCode(data);
}
