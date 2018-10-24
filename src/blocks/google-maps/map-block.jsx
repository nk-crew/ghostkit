import { compose, withProps, withHandlers, withStateHandlers } from 'recompose';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
} from 'react-google-maps';

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
                <Marker
                    key={ index }
                    position={ { lat: marker.lat, lng: marker.lng } }
                    icon={ marker.iconUrl }
                    animation={ marker.animation ? marker.animation : '' }
                    onClick={ () => props.showInfo( index ) }
                >
                    { ( props.isOpen && marker.infoWindow && props.infoIndex === index ) &&
                    <InfoWindow onCloseClick={ props.onToggleOpen }>
                        <div dangerouslySetInnerHTML={ { __html: marker.infoWindow } }>
                        </div>
                    </InfoWindow> }
                </Marker>
            ) ) }
        </GoogleMap>
    );
} );

export default MapBlock;
