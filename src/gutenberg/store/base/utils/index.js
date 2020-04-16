/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import * as selectors from './selectors';

const {
    registerStore,
} = wp.data;

registerStore( 'ghostkit/base/utils', {
    selectors,
    reducer( state ) {
        return state;
    },
} );
