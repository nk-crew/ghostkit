function reducer(state = { data: false }, action = {}) {
	switch (action.type) {
		case 'SET_CUSTOMIZER_DATA':
			if (!state.data && action.data) {
				return {
					data: action.data,
				};
			}
			break;
		// no default
	}

	return state;
}

export default reducer;
