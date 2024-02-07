import { createReduxStore, register } from '@wordpress/data';

import * as actions from './actions';
import * as controls from './controls';
import reducer from './reducer';
import * as resolvers from './resolvers';
import * as selectors from './selectors';

const store = createReduxStore('ghostkit/plugins/customizer', {
	reducer,
	selectors,
	actions,
	controls,
	resolvers,
});

register(store);
