import prepareQuery from './prepare-query';

export function getTOC(state, data) {
	const query = prepareQuery(data);

	return state.toc[query];
}
