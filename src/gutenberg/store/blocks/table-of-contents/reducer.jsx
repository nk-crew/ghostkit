
function reducer( state = { toc: {} }, action ) {
    switch ( action.type ) {
    case 'SET_TOC':
        if ( ! state.toc[ action.query ] && action.toc ) {
            state.toc[ action.query ] = action.toc;
        }
        break;
    }

    return state;
}

export default reducer;
