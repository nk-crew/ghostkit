import * as actions from './actions';
import prepareQuery from './prepare-query';

export function* getTwitterFeed(data) {
	const query = prepareQuery('feed', data);
	const feed = yield actions.apiFetch({ path: query });

	return actions.setTwitterFeed(query, feed);
}

export function* getTwitterProfile(data) {
	const query = prepareQuery('profile', data);
	const profile = yield actions.apiFetch({ path: query });

	return actions.setTwitterProfile(query, profile);
}
