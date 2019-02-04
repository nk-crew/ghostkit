import reducer from './reducer.jsx';
import * as selectors from './selectors.jsx';
import * as actions from './actions.jsx';
import * as controls from './controls.jsx';
import * as resolvers from './resolvers.jsx';

const {
    registerStore,
} = wp.data;

registerStore( 'ghostkit/base/images', { reducer, selectors, actions, controls, resolvers } );
