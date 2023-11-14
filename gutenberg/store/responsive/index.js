/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';

/**
 * WordPress dependencies
 */
const { registerStore } = wp.data;

registerStore('ghostkit/responsive', {
  reducer,
  selectors,
  actions,
});
