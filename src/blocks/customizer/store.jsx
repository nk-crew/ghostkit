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
    setCustomizerData( query, data ) {
        return {
            type: 'SET_CUSTOMIZER_DATA',
            query,
            data,
        };
    },
};

registerStore( 'ghostkit/customizer', {
    reducer( state = { data: false }, action ) {
        switch ( action.type ) {
        case 'SET_CUSTOMIZER_DATA':
            if ( ! state.data && action.data ) {
                return {
                    data: action.data,
                };
            }
            return state;
        // no default
        }
        return state;
    },
    actions,
    selectors: {
        getCustomizerData( state ) {
            return state.data;
        },
    },
    controls: {
        API_FETCH( { request } ) {
            // create iframe with customizer url to prepare customizer data.
            async function maybeGetCustomizerData() {
                const promise = new Promise( ( resolve ) => {
                    const iframe = document.createElement( 'iframe' );
                    iframe.style.display = 'none';
                    iframe.onload = () => {
                        iframe.parentNode.removeChild( iframe );
                        resolve();
                    };
                    iframe.src = window.GHOSTKIT.adminUrl + 'customize.php';
                    document.body.appendChild( iframe );
                } );

                return await promise;
            }

            return apiFetch( request )
                .catch( async function( fetchedData ) {
                    // try to get customizer data.
                    if ( fetchedData && fetchedData.error && 'no_options_found' === fetchedData.error_code ) {
                        await maybeGetCustomizerData();
                        return apiFetch( request );
                    }

                    return fetchedData;
                } )
                .catch( ( fetchedData ) => {
                    if ( fetchedData && fetchedData.error && 'no_options_found' === fetchedData.error_code ) {
                        return {
                            response: {},
                            error: false,
                            success: true,
                        };
                    }

                    return false;
                } )
                .then( ( fetchedData ) => {
                    if ( fetchedData && fetchedData.success && fetchedData.response ) {
                        return fetchedData.response;
                    }
                    return {};
                } );
        },
    },
    resolvers: {
        * getCustomizerData( query ) {
            const data = yield actions.apiFetch( { path: query } );
            return actions.setCustomizerData( query, data );
        },
    },
} );
