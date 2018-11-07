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
    setImageTagData( query, image ) {
        return {
            type: 'SET_IMAGE_TAG_DATA',
            query,
            image,
        };
    },
};

registerStore( 'ghostkit/video', {
    reducer( state = { images: {} }, action ) {
        switch ( action.type ) {
        case 'SET_IMAGE_TAG_DATA':
            if ( ! state.images[ action.query ] && action.image ) {
                state.images[ action.query ] = action.image;
            }
            return state;
        // no default
        }
        return state;
    },
    actions,
    selectors: {
        getImageTagData( state, query ) {
            return state.images[ query ];
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
        * getImageTagData( query ) {
            const image = yield actions.apiFetch( { path: query } );
            return actions.setImageTagData( query, image );
        },
    },
} );
