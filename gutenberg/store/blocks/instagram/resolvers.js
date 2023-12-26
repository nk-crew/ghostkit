import * as actions from './actions';
import prepareQuery from './prepare-query';

export function* getInstagramFeed(data) {
	const query = prepareQuery('feed', data);
	const feed = yield actions.apiFetch({ path: query });

	return actions.setInstagramFeed(query, feed);
}

export function* getInstagramProfile(data) {
	const query = prepareQuery('profile', data);
	const profile = yield actions.apiFetch({ path: query });

	return actions.setInstagramProfile(query, profile);
}
