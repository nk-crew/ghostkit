/**
 * External dependencies
 */
import { compose, withProps, withHandlers } from 'recompose';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from 'react-google-maps';

/**
 * Internal dependencies
 */
import ApplyFilters from '../../components/apply-filters';

/*
 * Map Block Component.
 */
export default compose(
    withProps( {
        loadingElement: <div style={ { height: '100%' } } />,
        mapElement: <div style={ { height: '100%' } } />,
    } ),
    withHandlers( () => {
        const refs = {
            map: undefined,
        };

        return {
            onMapMounted: () => ( ref ) => {
                refs.map = ref;
            },
            onZoomChanged: ( props ) => () => {
                props.onZoomChanged( refs.map.getZoom() );
            },
            onCenterChanged: ( props ) => () => {
                props.onCenterChanged( refs.map.getCenter() );
            },
        };
    } ),
    withScriptjs,
    withGoogleMap
)( ( props ) => (
    <GoogleMap
        ref={ props.onMapMounted }
        markers={ props.markers }
        zoom={ props.zoom }
        center={ props.center }
        options={ props.options }
        defaultZoom={ props.defaultZoom }
        defaultCenter={ props.defaultCenter }
        defaultOptions={ props.defaultOptions }
        onZoomChanged={ props.onZoomChanged }
        onCenterChanged={ props.onCenterChanged }
    >
        { props.markers.map( ( marker, index ) => (
            <ApplyFilters
                // eslint-disable-next-line react/no-array-index-key
                key={ index }
                name="ghostkit.editor"
                attribute="mapMarker"
                marker={ marker }
                props={ props }
            >
                <Marker
                    position={ { lat: marker.lat, lng: marker.lng } }
                />
            </ApplyFilters>
        ) ) }
    </GoogleMap>
) );
