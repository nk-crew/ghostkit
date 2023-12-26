import * as actions from './actions';
import prepareQuery from './prepare-query';

export function* getTOC(data) {
	const query = prepareQuery(data);
	const toc = yield actions.apiFetch({ path: query });

	return actions.setTOC(query, toc);
}
