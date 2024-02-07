export function apiFetch(request) {
	return {
		type: 'API_FETCH',
		request,
	};
}

export function setTwitterFeed(query, feed) {
	return {
		type: 'SET_TWITTER_FEED',
		query,
		feed,
	};
}

export function setTwitterProfile(query, profile) {
	return {
		type: 'SET_TWITTER_PROFILE',
		query,
		profile,
	};
}
