import * as actions from './actions';
import prepareQuery from './prepare-query';

export function* getImageTagData(data) {
	const query = prepareQuery(data);
	const image = yield actions.apiFetch({ path: query });

	return actions.setImageTagData(query, image);
}
