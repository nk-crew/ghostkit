/**
 * WordPress dependencies
 */
const {
    registerStore,
} = wp.data;

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import * as controls from './controls';
import * as resolvers from './resolvers';

registerStore( 'ghostkit/plugins/templates', { reducer, selectors, actions, controls, resolvers } );
