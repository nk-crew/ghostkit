import { createReduxStore, register } from '@wordpress/data';

import * as selectors from './selectors';

const store = createReduxStore('ghostkit/base/hooks', {
	selectors,
	reducer(state) {
		return state;
	},
});

register(store);
