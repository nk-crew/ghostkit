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

const store = createReduxStore('ghostkit/responsive', {
  reducer,
  selectors,
  actions,
});

register(store);
