import * as actions from './actions.jsx';
import prepareQuery from './prepare-query.jsx';

export function * getInstagramFeed( data ) {
    const query = prepareQuery( 'feed', data );
    const feed = yield actions.apiFetch( { path: query } );

    return actions.setInstagramFeed( query, feed );
}

export function * getInstagramProfile( data ) {
    const query = prepareQuery( 'profile', data );
    const profile = yield actions.apiFetch( { path: query } );

    return actions.setInstagramProfile( query, profile );
}
