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
    setTwitterFeed( query, feed ) {
        return {
            type: 'SET_TWITTER_FEED',
            query,
            feed,
        };
    },
    setTwitterProfile( query, profile ) {
        return {
            type: 'SET_TWITTER_PROFILE',
            query,
            profile,
        };
    },
};

registerStore( 'ghostkit/twitter', {
    reducer( state = { feeds: {}, profiles: {} }, action ) {
        switch ( action.type ) {
        case 'SET_TWITTER_FEED':
            if ( ! state.feeds[ action.query ] && action.feed ) {
                state.feeds[ action.query ] = action.feed;
            }
            return state;
        case 'SET_TWITTER_PROFILE':
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
        getTwitterFeed( state, query ) {
            return state.feeds[ query ];
        },
        getTwitterProfile( state, query ) {
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
        * getTwitterFeed( query ) {
            const feed = yield actions.apiFetch( { path: query } );
            return actions.setTwitterFeed( query, feed );
        },
        * getTwitterProfile( query ) {
            const profile = yield actions.apiFetch( { path: query } );
            return actions.setTwitterProfile( query, profile );
        },
    },
} );
