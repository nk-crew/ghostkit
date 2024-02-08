import { merge } from 'lodash';

function reducer(state = { data: false }, action = {}) {
	switch (action.type) {
		case 'SET_CUSTOM_CODE':
			if (action.data) {
				if (state.data) {
					return {
						data: merge(state.data, action.data),
					};
				}
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
