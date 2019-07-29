/**
 * WordPress dependencies
 */
const {
    registerStore,
} = wp.data;

/**
 * Internal dependencies
 */
import * as selectors from './selectors';

registerStore( 'ghostkit/base/components', {
    selectors,
    reducer( state ) {
        return state;
    },
} );
