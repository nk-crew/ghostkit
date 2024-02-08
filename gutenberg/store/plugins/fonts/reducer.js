import { merge } from 'lodash';

import { applyFilters } from '@wordpress/hooks';

function reducer(state = { data: false }, action = {}) {
	switch (action.type) {
		case 'SET_CUSTOM_FONTS':
			if (action.data) {
				if (state.data) {
					let result = merge(state.data, action.data);

					// We should overwrite fonts data.
					if (action.data.google && action.data.google) {
						result.google = action.data.google;
					}

					result = applyFilters(
						'ghostkit.store.fonts.reducer.result',
						result,
						action
					);

					return {
						data: result,
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
