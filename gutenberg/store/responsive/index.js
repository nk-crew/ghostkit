/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

import * as actions from './actions';
/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';

const store = createReduxStore( 'ghostkit/responsive', {
	reducer,
	selectors,
	actions,
} );

register( store );
