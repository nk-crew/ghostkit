function reducer(state = { feeds: {}, profiles: {} }, action = {}) {
	switch (action.type) {
		case 'SET_TWITTER_FEED':
			if (!state.feeds[action.query] && action.feed) {
				state.feeds[action.query] = action.feed;
			}
			break;
		case 'SET_TWITTER_PROFILE':
			if (!state.profiles[action.query] && action.profile) {
				state.profiles[action.query] = action.profile;
			}
			break;
		// no default
	}

	return state;
}

export default reducer;
