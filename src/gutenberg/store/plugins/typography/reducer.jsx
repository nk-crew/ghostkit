/**
 * External dependencies
 */
import deepAssign from 'deep-assign';

function reducer( state = { data: false }, action ) {
    switch ( action.type ) {
    case 'SET_CUSTOM_TYPOGRAPHY':
        if ( action.data ) {
            if ( state.data ) {
                return {
                    data: deepAssign( state.data, action.data ),
                };
            }
            return {
                data: action.data,
            };
        }
        break;
    // no default
    }

    return state;
}

export default reducer;
