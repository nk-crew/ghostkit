// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';
import { debounce } from 'throttle-debounce';

// Internal Dependencies.
import getIcon from '../../utils/get-icon';
import deprecatedArray from './deprecated';
import IconMarker from './icons/marker.svg';

import styles from './styles';

import MapBlock from './map-block';
import SearchBox from './search-box';

import ApplyFilters from '../../components/apply-filters';
import ImagePicker from '../../components/image-picker';

const { GHOSTKIT } = window;

const mapsUrl = GHOSTKIT.googleMapsAPIUrl + '&libraries=geometry,drawing,places';
let geocoder = false;

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    TextControl,
    TextareaControl,
    RangeControl,
    ToggleControl,
    Button,
    Toolbar,
    Dropdown,
    IconButton,
    ResizableBox,
} = wp.components;

const {
    InspectorControls,
    BlockControls,
} = wp.editor;

const { apiFetch } = wp;

class GoogleMapsBlock extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            mapID: this.props.attributes.apiKey,
            apiKey: GHOSTKIT.googleMapsAPIKey,
            apiKeySaved: GHOSTKIT.googleMapsAPIKey,
            styles: [],
            addresses: {},
        };

        this.updateMarkerAddress = this.updateMarkerAddress.bind( this );
        this.onChangeAPIKey = debounce( 600, this.onChangeAPIKey.bind( this ) );
        this.saveAPIKey = debounce( 3000, this.saveAPIKey.bind( this ) );
        this.getStyles = this.getStyles.bind( this );
        this.getStylesPicker = this.getStylesPicker.bind( this );
    }

    componentDidUpdate() {
        const {
            attributes,
        } = this.props;

        const { markers } = attributes;

        // find Address by lat and lng.
        if ( geocoder || ( window.google && window.google.maps && window.google.maps.Geocoder ) ) {
            geocoder = new window.google.maps.Geocoder();
        }
        if ( geocoder ) {
            if ( markers && markers.length > 0 ) {
                markers.forEach( ( marker ) => {
                    if ( ! marker.address ) {
                        if ( this.state.addresses[ marker.lat + marker.lng ] ) {
                            this.updateMarkerAddress( {
                                lat: marker.lat,
                                lng: marker.lng,
                            }, this.state.addresses[ marker.lat + marker.lng ] );
                        } else {
                            geocoder.geocode( {
                                location: {
                                    lat: marker.lat,
                                    lng: marker.lng,
                                },
                            }, ( results, status ) => {
                                if ( 'OK' === status && results.length ) {
                                    this.updateMarkerAddress( {
                                        lat: marker.lat,
                                        lng: marker.lng,
                                    }, results[ 0 ].formatted_address );
                                }
                            } );
                        }
                    }
                } );
            }
        }
    }

    updateMarkerAddress( latLng, address ) {
        const {
            attributes,
        } = this.props;

        const { markers } = attributes;
        const { addresses } = this.state;

        if ( markers && markers.length > 0 ) {
            markers.forEach( ( marker, index ) => {
                if ( ! marker.address && latLng.lat === marker.lat && latLng.lng === marker.lng ) {
                    markers[ index ].address = address;
                    addresses[ latLng.lat + latLng.lng ] = address;
                }
            } );
            this.setState( { addresses } );
        }
    }

    onChangeAPIKey() {
        GHOSTKIT.googleMapsAPIKey = this.state.apiKey;

        this.setState( {
            mapID: this.state.apiKey,
        } );
    }

    saveAPIKey() {
        if ( GHOSTKIT.googleMapsAPIKey !== this.state.apiKeySaved ) {
            this.setState( {
                apiKeySaved: GHOSTKIT.googleMapsAPIKey,
            } );
            apiFetch( {
                path: '/ghostkit/v1/update_google_maps_api_key',
                method: 'POST',
                data: {
                    key: GHOSTKIT.googleMapsAPIKey,
                },
            } );
        }
    }

    getStyles( string ) {
        let result = [];

        try {
            result = JSON.parse( string );
        } catch ( e ) {
            return [];
        }

        return result;
    }

    getStylesPicker() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        const {
            style,
            styleCustom,
        } = attributes;

        return (
            <Fragment>
                <ImagePicker
                    value={ style }
                    options={ styles }
                    onChange={ ( value ) => {
                        let customString = styleCustom;

                        if ( 'default' === value ) {
                            customString = '';
                        } else if ( 'custom' !== value ) {
                            styles.forEach( ( styleData ) => {
                                if ( value === styleData.value ) {
                                    customString = JSON.stringify( styleData.json );
                                }
                            } );
                        }

                        setAttributes( {
                            style: value,
                            styleCustom: customString,
                        } );
                    } }
                />
                { 'custom' === style ? (
                    <Fragment>
                        <TextareaControl
                            placeholder={ __( 'Enter Style JSON' ) }
                            value={ styleCustom }
                            onChange={ ( value ) => setAttributes( { styleCustom: value } ) }
                        />
                        <p><em>{ __( 'You can use custom styles presets from the' ) } <a href="https://snazzymaps.com/" target="_blank" rel="noopener noreferrer">{ __( 'Snazzy Maps' ) }</a>.</em></p>
                    </Fragment>
                ) : '' }
            </Fragment>
        );
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            toggleSelection,
        } = this.props;

        let { className = '' } = this.props;

        const {
            height,
            zoom,
            lat,
            lng,
            showZoomButtons,
            showMapTypeButtons,
            showStreetViewButton,
            showFullscreenButton,
            optionScrollWheel,
            optionDraggable,
            gestureHandling,
            styleCustom,
            markers,
            fullHeight,
        } = attributes;

        className = classnames( 'ghostkit-google-maps', className );

        // add full height classname.
        if ( fullHeight ) {
            className = classnames( className, 'ghostkit-google-maps-fullheight' );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <BlockControls>
                    <Toolbar controls={ [
                        {
                            icon: getIcon( 'icon-fullheight' ),
                            title: __( 'Full Height' ),
                            onClick: () => setAttributes( { fullHeight: ! fullHeight } ),
                            isActive: fullHeight,
                        },
                    ] } />
                    <Toolbar
                        controls={ [
                            {
                                icon: getIcon( 'icon-marker' ),
                                title: __( 'Add Marker' ),
                                onClick: () => {
                                    setAttributes( {
                                        markers: [
                                            ...markers,
                                            ...[ {
                                                lat,
                                                lng,
                                            } ],
                                        ],
                                    } );
                                },
                            },
                        ] }
                    >
                        <Dropdown
                            renderToggle={ ( { onToggle } ) => (
                                <IconButton
                                    label={ __( 'Style' ) }
                                    icon={ getIcon( 'icon-map' ) }
                                    className="components-toolbar__control"
                                    onClick={ onToggle }
                                />
                            ) }
                            renderContent={ () => {
                                return (
                                    <div style={ {
                                        padding: 15,
                                        paddingTop: 10,
                                        paddingBottom: 0,
                                    } }>
                                        { this.getStylesPicker() }
                                    </div>
                                );
                            } }
                        />
                    </Toolbar>
                </BlockControls>
                <InspectorControls>
                    { this.state.apiKey ? (
                        <Fragment>
                            <PanelBody>
                                <ToggleControl
                                    label={ __( 'Full Height' ) }
                                    checked={ !! fullHeight }
                                    onChange={ ( val ) => setAttributes( { fullHeight: val } ) }
                                />
                                <RangeControl
                                    label={ fullHeight ? __( 'Minimal Height' ) : __( 'Height' ) }
                                    value={ height }
                                    onChange={ ( value ) => setAttributes( { height: value } ) }
                                    min={ 100 }
                                    max={ 800 }
                                />
                                <RangeControl
                                    label={ __( 'Zoom' ) }
                                    value={ zoom }
                                    onChange={ ( value ) => setAttributes( { zoom: value } ) }
                                    min={ 1 }
                                    max={ 18 }
                                />
                            </PanelBody>
                            <PanelBody title={ __( 'Markers' ) }>
                                { markers && markers.length > 0 ? (
                                    <ul className="ghostkit-google-maps-markers">
                                        { markers.map( ( marker, index ) => (
                                            <li key={ index }>
                                                <SearchBox
                                                    googleMapURL={ mapsUrl + '&key=' + encodeURIComponent( this.state.apiKey ) }
                                                    placeholder={ __( 'Enter address' ) }
                                                    value={ marker.address || this.state.addresses[ marker.lat + marker.lng ] || '' }
                                                    onChange={ ( value ) => {
                                                        if ( value && value[ 0 ] ) {
                                                            markers[ index ].address = value[ 0 ].formatted_address;
                                                            markers[ index ].lat = value[ 0 ].geometry.location.lat();
                                                            markers[ index ].lng = value[ 0 ].geometry.location.lng();

                                                            setAttributes( {
                                                                markers: Object.assign( [], markers ),
                                                            } );
                                                        }
                                                    } }
                                                    className="ghostkit-google-maps-search-box"
                                                />
                                                <ApplyFilters
                                                    name="ghostkit.editor.controls"
                                                    attribute="additionalMarkerOptions"
                                                    marker={ marker }
                                                    props={ this.props }
                                                    setMarkerOptions={ ( newMarkerOptions ) => {
                                                        markers[ index ] = {
                                                            ...markers[ index ],
                                                            ...newMarkerOptions,
                                                        };

                                                        setAttributes( {
                                                            markers: Object.assign( [], markers ),
                                                        } );
                                                    } }
                                                />
                                                <Button
                                                    onClick={ () => {
                                                        markers.splice( index, 1 );

                                                        setAttributes( {
                                                            markers: Object.assign( [], markers ),
                                                        } );
                                                    } }
                                                    className="ghostkit-google-maps-marker-remove"
                                                >
                                                    { __( 'Remove Marker' ) }
                                                </Button>
                                            </li>
                                        ) ) }
                                    </ul>
                                ) : '' }
                                <Button
                                    isDefault
                                    onClick={ () => {
                                        setAttributes( {
                                            markers: [
                                                ...markers,
                                                ...[ {
                                                    lat,
                                                    lng,
                                                } ],
                                            ],
                                        } );
                                    } }
                                >
                                    { __( '+ Add Marker' ) }
                                </Button>
                            </PanelBody>
                            <PanelBody title={ __( 'Style' ) }>
                                { this.getStylesPicker() }
                            </PanelBody>
                            <PanelBody title={ __( 'Options' ) }>
                                <ToggleControl
                                    label={ __( 'Zoom Buttons' ) }
                                    checked={ !! showZoomButtons }
                                    onChange={ ( val ) => setAttributes( { showZoomButtons: val } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Map Type Buttons' ) }
                                    checked={ !! showMapTypeButtons }
                                    onChange={ ( val ) => setAttributes( { showMapTypeButtons: val } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Street View Button' ) }
                                    checked={ !! showStreetViewButton }
                                    onChange={ ( val ) => setAttributes( { showStreetViewButton: val } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Fullscreen Button' ) }
                                    checked={ !! showFullscreenButton }
                                    onChange={ ( val ) => setAttributes( { showFullscreenButton: val } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Scroll Wheel' ) }
                                    checked={ !! optionScrollWheel }
                                    onChange={ ( val ) => setAttributes( { optionScrollWheel: val } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Draggable' ) }
                                    checked={ !! optionDraggable }
                                    onChange={ ( val ) => setAttributes( { optionDraggable: val } ) }
                                />
                                { optionScrollWheel || optionDraggable ? (
                                    <ToggleControl
                                        label={ ( () => {
                                            if ( optionScrollWheel && optionDraggable ) {
                                                return __( 'Better Scroll & Draggable' );
                                            }
                                            if ( optionScrollWheel ) {
                                                return __( 'Better Scroll' );
                                            }
                                            if ( optionDraggable ) {
                                                return __( 'Better Draggable' );
                                            }
                                        } )() }
                                        help={ ( () => {
                                            if ( optionScrollWheel && optionDraggable ) {
                                                return __( 'Scroll with pressed Ctrl or ⌘ key to zoom. Draggable with two fingers.' );
                                            }
                                            if ( optionScrollWheel ) {
                                                return __( 'Scroll with pressed Ctrl or ⌘ key to zoom.' );
                                            }
                                            if ( optionDraggable ) {
                                                return __( 'Draggable with two fingers.' );
                                            }
                                        } )() }
                                        checked={ gestureHandling === 'cooperative' }
                                        onChange={ () => {
                                            setAttributes( { gestureHandling: gestureHandling === 'greedy' ? 'cooperative' : 'greedy' } );
                                        } }
                                    />
                                ) : '' }
                            </PanelBody>
                        </Fragment>
                    ) : '' }
                    <PanelBody title={ __( 'API Key' ) } initialOpen={ ! this.state.apiKey }>
                        <TextControl
                            placeholder={ __( 'Enter API Key' ) }
                            value={ this.state.apiKey }
                            onChange={ ( value ) => {
                                this.setState( { apiKey: value } );
                                this.onChangeAPIKey();
                                this.saveAPIKey();
                            } }
                        />
                        <p><em>{ __( 'A valid API key is required to use Google Maps. How to get API key' ) } <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer">{ __( 'read here' ) }</a>.</em></p>
                        <p><em>{ __( 'This key will be used in all Google Maps blocks on your site.' ) }</em></p>
                    </PanelBody>
                </InspectorControls>

                <div className={ className }>
                    { this.state.apiKey ? (
                        <Fragment>
                            <ResizableBox
                                className={ classnames( 'ghostkit-progress-bar', { 'is-selected': isSelected } ) }
                                size={ {
                                    width: '100%',
                                    height,
                                } }
                                style={ { minHeight: height } }
                                minHeight="100"
                                enable={ { bottom: true } }
                                onResizeStart={ () => {
                                    toggleSelection( false );
                                } }
                                onResizeStop={ ( event, direction, elt, delta ) => {
                                    setAttributes( {
                                        height: parseInt( height + delta.height, 10 ),
                                    } );
                                    toggleSelection( true );
                                } }
                            >
                                <MapBlock
                                    key={ this.state.mapID + markers.length }
                                    googleMapURL={ mapsUrl + '&key=' + encodeURIComponent( this.state.apiKey ) }
                                    loadingElement={ <div style={ { height: '100%' } } /> }
                                    mapElement={ <div style={ { height: '100%' } } /> }
                                    containerElement={ <div className="ghostkit-google-maps-wrap" style={ { minHeight: '100%' } } /> }
                                    markers={ markers }
                                    zoom={ zoom }
                                    center={ { lat: lat, lng: lng } }
                                    options={ {
                                        styles: styleCustom ? this.getStyles( styleCustom ) : [],
                                        zoomControl: showZoomButtons,
                                        mapTypeControl: showMapTypeButtons,
                                        streetViewControl: showStreetViewButton,
                                        fullscreenControl: showFullscreenButton,
                                        gestureHandling: 'cooperative',
                                        draggable: optionDraggable,
                                    } }
                                    defaultZoom={ zoom }
                                    defaultCenter={ { lat: lat, lng: lng } }
                                    defaultOptions={ {
                                        styles: styleCustom ? this.getStyles( styleCustom ) : [],
                                        zoomControl: showZoomButtons,
                                        mapTypeControl: showMapTypeButtons,
                                        streetViewControl: showStreetViewButton,
                                        fullscreenControl: showFullscreenButton,
                                        gestureHandling: 'cooperative',
                                        draggable: optionDraggable,
                                    } }
                                    onZoomChanged={ debounce( 500, ( val ) => setAttributes( { zoom: val } ) ) }
                                    onCenterChanged={ debounce( 500, ( val ) => setAttributes( { lat: val.lat(), lng: val.lng() } ) ) }
                                />
                            </ResizableBox>
                            { isSelected ? (
                                <div className="ghostkit-google-maps-search">
                                    <SearchBox
                                        googleMapURL={ mapsUrl + '&key=' + encodeURIComponent( this.state.apiKey ) }
                                        label={ __( 'Center Map' ) }
                                        placeholder={ __( 'Enter search query' ) }
                                        onChange={ ( value ) => {
                                            if ( value && value[ 0 ] ) {
                                                setAttributes( {
                                                    lat: value[ 0 ].geometry.location.lat(),
                                                    lng: value[ 0 ].geometry.location.lng(),
                                                } );
                                            }
                                        } }
                                        className="ghostkit-google-maps-search-box"
                                    />
                                    <div className="ghostkit-google-maps-search-note">
                                        <p><small>{ __( 'You can also drag the map to change the center coordinates.' ) }</small></p>
                                    </div>
                                </div>
                            ) : '' }
                        </Fragment>
                    ) : (
                        <div
                            className="ghostkit-google-maps-placeholder"
                            style={ { minHeight: height } }
                        >
                            <IconMarker />
                            <div className="ghostkit-google-maps-placeholder-key">
                                <div><strong>{ __( 'Google Maps API Key Required' ) }</strong></div>
                                <div><small>{ __( 'Add an API key in block settings.' ) }</small></div>
                            </div>
                        </div>
                    ) }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/google-maps';

export const settings = {
    title: __( 'Google Maps' ),
    description: __( 'Show maps with custom styles, markers and settings.' ),
    icon: getIcon( 'block-google-maps', true ),
    category: 'ghostkit',
    keywords: [
        __( 'maps' ),
        __( 'google' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/google-maps/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
    },
    attributes: {
        lat: {
            type: 'number',
            default: 40.7127753,
        },
        lng: {
            type: 'number',
            default: -74.0059728,
        },
        zoom: {
            type: 'number',
            default: 10,
        },
        height: {
            type: 'number',
            default: 350,
        },
        showZoomButtons: {
            type: 'boolean',
            default: true,
        },
        showMapTypeButtons: {
            type: 'boolean',
            default: true,
        },
        showStreetViewButton: {
            type: 'boolean',
            default: true,
        },
        showFullscreenButton: {
            type: 'boolean',
            default: true,
        },
        optionScrollWheel: {
            type: 'boolean',
            default: true,
        },
        gestureHandling: {
            type: 'string',
            default: 'greedy',
        },
        optionDraggable: {
            type: 'boolean',
            default: true,
        },
        style: {
            type: 'string',
            default: 'default',
        },
        styleCustom: {
            type: 'string',
            default: '',
        },
        markers: {
            type: 'array',
            default: [],
        },
        fullHeight: {
            type: 'boolean',
            default: false,
        },
    },

    edit: GoogleMapsBlock,

    save: function( props ) {
        const {
            height,
            zoom,
            lat,
            lng,
            showZoomButtons,
            showMapTypeButtons,
            showStreetViewButton,
            showFullscreenButton,
            optionScrollWheel,
            gestureHandling,
            optionDraggable,
            styleCustom,
            markers,
            fullHeight,
        } = props.attributes;

        let className = 'ghostkit-google-maps';

        // add full height classname.
        if ( fullHeight ) {
            className = classnames( className, 'ghostkit-google-maps-fullheight' );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        const attrs = {
            className: className,
            style: { minHeight: height },
            'data-lat': lat,
            'data-lng': lng,
            'data-zoom': zoom,
            'data-show-zoom-buttons': showZoomButtons ? 'true' : 'false',
            'data-show-map-type-buttons': showMapTypeButtons ? 'true' : 'false',
            'data-show-street-view-button': showStreetViewButton ? 'true' : 'false',
            'data-show-fullscreen-button': showFullscreenButton ? 'true' : 'false',
            'data-option-scroll-wheel': optionScrollWheel ? 'true' : 'false',
            'data-option-draggable': optionDraggable ? 'true' : 'false',
            'data-styles': styleCustom,
        };

        if ( 'greedy' !== gestureHandling ) {
            attrs[ 'data-gesture-handling' ] = gestureHandling;
        }

        return (
            <div { ...attrs }>
                { markers ? (
                    markers.map( ( marker, i ) => {
                        const markerData = {
                            'data-lat': marker.lat,
                            'data-lng': marker.lng,
                            'data-address': marker.address,
                        };

                        return (
                            <div
                                key={ `marker-${ i }` }
                                className="ghostkit-google-maps-marker"
                                { ...markerData }
                            />
                        );
                    } )
                ) : '' }
            </div>
        );
    },

    deprecated: deprecatedArray,
};
