import prepareQuery from './prepare-query';

export function getTwitterFeed(state, data) {
	const query = prepareQuery('feed', data);

	return state.feeds[query];
}

export function getTwitterProfile(state, data) {
	const query = prepareQuery('profile', data);

	return state.profiles[query];
}
