import prepareQuery from './prepare-query';

export function getImageTagData(state, data) {
	const query = prepareQuery(data);

	return state.images[query];
}
