import prepareQuery from './prepare-query.jsx';

export function getImageTagData( state, data ) {
    const query = prepareQuery( data );

    return state.images[ query ];
}
