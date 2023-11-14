/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import * as controls from './controls';
import * as resolvers from './resolvers';

/**
 * WordPress dependencies
 */
const { registerStore } = wp.data;

registerStore('ghostkit/blocks/table-of-contents', {
  reducer,
  selectors,
  actions,
  controls,
  resolvers,
});
