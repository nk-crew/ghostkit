import * as actions from './actions.jsx';
import prepareQuery from './prepare-query.jsx';

export function * getImageTagData( data ) {
    const query = prepareQuery( data );
    const image = yield actions.apiFetch( { path: query } );

    return actions.setImageTagData( query, image );
}
