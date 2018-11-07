const { apiFetch } = wp;
const {
    registerStore,
} = wp.data;

const actions = {
    apiFetch( request ) {
        return {
            type: 'API_FETCH',
            request,
        };
    },
    setInstagramFeed( query, feed ) {
        return {
            type: 'SET_INSTAGRAM_FEED',
            query,
            feed,
        };
    },
    setInstagramProfile( query, profile ) {
        return {
            type: 'SET_INSTAGRAM_PROFILE',
            query,
            profile,
        };
    },
};

registerStore( 'ghostkit/instagram', {
    reducer( state = { feeds: {}, profiles: {} }, action ) {
        switch ( action.type ) {
        case 'SET_INSTAGRAM_FEED':
            if ( ! state.feeds[ action.query ] && action.feed ) {
                state.feeds[ action.query ] = action.feed;
            }
            return state;
        case 'SET_INSTAGRAM_PROFILE':
            if ( ! state.profiles[ action.query ] && action.profile ) {
                state.profiles[ action.query ] = action.profile;
            }
            return state;
        // no default
        }
        return state;
    },
    actions,
    selectors: {
        getInstagramFeed( state, query ) {
            return state.feeds[ query ];
        },
        getInstagramProfile( state, query ) {
            return state.profiles[ query ];
        },
    },
    controls: {
        API_FETCH( { request } ) {
            return apiFetch( request )
                .then( ( fetchedData ) => {
                    if ( fetchedData && fetchedData.success && fetchedData.response ) {
                        return fetchedData.response;
                    }
                    return false;
                } );
        },
    },
    resolvers: {
        * getInstagramFeed( query ) {
            const feed = yield actions.apiFetch( { path: query } );
            return actions.setInstagramFeed( query, feed );
        },
        * getInstagramProfile( query ) {
            const profile = yield actions.apiFetch( { path: query } );
            return actions.setInstagramProfile( query, profile );
        },
    },
} );
