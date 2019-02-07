import { compose, withProps, withHandlers, withStateHandlers } from 'recompose';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
} from 'react-google-maps';

import ApplyFilters from '../_components/apply-filters.jsx';

const MapBlock = compose(
    withStateHandlers( () => ( {
        isOpen: false,
    } ), {
        onToggleOpen: ( { isOpen } ) => () => ( {
            isOpen: ! isOpen,
        } ),
        showInfo: ( { isOpen, infoIndex } ) => ( index ) => ( {
            isOpen: infoIndex !== index || ! isOpen,
            infoIndex: index,
        } ),
    } ),
    withProps( {
        loadingElement: <div style={ { height: '100%' } } />,
        mapElement: <div style={ { height: '100%' } } />,
    } ),
    withHandlers( () => {
        const refs = {
            map: undefined,
        };

        return {
            onMapMounted: () => ref => {
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
)( ( props ) => {
    return (
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
                    key={ index }
                    name="ghostkit.editor"
                    attribute="mapMarker"
                    marker={ marker }
                    props={ props }
                >
                    <Marker
                        position={ { lat: marker.lat, lng: marker.lng } }
                        icon={ {
                            url: marker.iconUrl, // url
                            scaledSize: new window.google.maps.Size( marker.markerWidth, marker.markerHeight ), // scaled size
                        } }
                        onClick={ () => props.showInfo( index ) }
                        animation={ window.google.maps.Animation[ marker.animation ] || 0 }
                    >
                        { ( props.isOpen && marker.infoWindow && props.infoIndex === index ) &&
                        <InfoWindow
                            onCloseClick={ props.onToggleOpen }
                            options={ { maxWidth: marker.infoWindowWidth } }
                        >
                            <div dangerouslySetInnerHTML={ { __html: marker.infoWindow } }>
                            </div>
                        </InfoWindow> }
                    </Marker>
                </ApplyFilters>
            ) ) }
        </GoogleMap>
    );
} );

export default MapBlock;
