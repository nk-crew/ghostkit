/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import * as selectors from './selectors';

const store = createReduxStore('ghostkit/base/hooks', {
  selectors,
  reducer(state) {
    return state;
  },
});

register(store);
