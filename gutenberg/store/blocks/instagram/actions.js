export function apiFetch(request) {
	return {
		type: 'API_FETCH',
		request,
	};
}

export function setInstagramFeed(query, feed) {
	return {
		type: 'SET_INSTAGRAM_FEED',
		query,
		feed,
	};
}

export function setInstagramProfile(query, profile) {
	return {
		type: 'SET_INSTAGRAM_PROFILE',
		query,
		profile,
	};
}
