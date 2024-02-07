function reducer(state = { device: '' }, action = {}) {
	switch (action.type) {
		case 'SET_DEVICE':
			if (state.device !== action.device) {
				return {
					...state,
					device: action.device,
				};
			}

			break;
		// no default
	}

	return state;
}

export default reducer;
