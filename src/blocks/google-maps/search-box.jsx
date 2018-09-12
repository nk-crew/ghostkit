import { compose, withProps, withHandlers } from 'recompose';
import { withScriptjs } from 'react-google-maps';
const { StandaloneSearchBox } = require( 'react-google-maps/lib/components/places/StandaloneSearchBox' );

const {
    TextControl,
} = wp.components;

const SearchBox = compose(
    withProps( {
        loadingElement: <div />,
        containerElement: <div />,
    } ),
    withHandlers( () => {
        const refs = {
            searchBox: undefined,
        };

        return {
            onSearchBoxMounted: () => ref => {
                refs.searchBox = ref;
            },
            onPlacesChanged: ( props ) => () => {
                const places = refs.searchBox.getPlaces();

                if ( props.onChange ) {
                    props.onChange( places );
                }
            },
        };
    } ),
    withScriptjs,
)( props => {
    return (
        <div data-standalone-searchbox="" className={ props.className }>
            <StandaloneSearchBox
                ref={ props.onSearchBoxMounted }
                bounds={ props.bounds }
                onPlacesChanged={ props.onPlacesChanged }
            >
                <TextControl
                    label={ props.label }
                    placeholder={ props.placeholder }
                    value={ props.value }
                    onChange={ () => { } }
                />
            </StandaloneSearchBox>
        </div>
    );
} );

export default SearchBox;
