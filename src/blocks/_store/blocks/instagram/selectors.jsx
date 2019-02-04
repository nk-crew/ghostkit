import prepareQuery from './prepare-query.jsx';

export function getInstagramFeed( state, data ) {
    const query = prepareQuery( 'feed', data );

    return state.feeds[ query ];
}

export function getInstagramProfile( state, data ) {
    const query = prepareQuery( 'profile', data );

    return state.profiles[ query ];
}
