import * as actions from './actions';

export function* getCustomizerData() {
	const query = '/ghostkit/v1/get_customizer/';
	const data = yield actions.apiFetch({ path: query });
	return actions.setCustomizerData(query, data);
}
