function reducer(state = { images: {} }, action = {}) {
	switch (action.type) {
		case 'SET_IMAGE_TAG_DATA':
			if (!state.images[action.query] && action.image) {
				state.images[action.query] = action.image;
			}
			return state;
		// no default
	}

	return state;
}

export default reducer;
