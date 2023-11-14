/**
 * Internal dependencies
 */
import * as selectors from './selectors';

/**
 * WordPress dependencies
 */
const { registerStore } = wp.data;

registerStore('ghostkit/base/utils', {
  selectors,
  reducer(state) {
    return state;
  },
});
