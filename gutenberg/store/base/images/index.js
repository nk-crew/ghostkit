
/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import * as controls from './controls';
import * as resolvers from './resolvers';

const store = createReduxStore('ghostkit/base/images', {
  reducer,
  selectors,
  actions,
  controls,
  resolvers,
});

register(store);
