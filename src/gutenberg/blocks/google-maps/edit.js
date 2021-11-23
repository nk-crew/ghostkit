/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import { debounce } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';
import ImagePicker from '../../components/image-picker';
import { maybeEncode } from '../../utils/encode-decode';

import IconMarker from './icons/marker.svg';
import styles from './map-styles';
import MapBlock from './map-block';
import SearchBox from './search-box';

/**
 * WordPress dependencies
 */
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
    ResizableBox,
    ExternalLink,
} = wp.components;

const {
    InspectorControls,
    BlockControls,
} = wp.blockEditor;

const { apiFetch } = wp;

const { GHOSTKIT } = window;

const mapsUrl = `${ GHOSTKIT.googleMapsAPIUrl }&libraries=geometry,drawing,places`;
let geocoder = false;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            mapID: this.props.attributes.apiKey,
            apiKey: GHOSTKIT.googleMapsAPIKey,
            apiKeySaved: GHOSTKIT.googleMapsAPIKey,
            addresses: {},
        };

        this.updateMarkerAddress = this.updateMarkerAddress.bind( this );
        this.onChangeAPIKey = debounce( 600, this.onChangeAPIKey.bind( this ) );
        this.saveAPIKey = debounce( 3000, this.saveAPIKey.bind( this ) );
        this.getStyles = this.getStyles.bind( this );
        this.getStylesPicker = this.getStylesPicker.bind( this );
        this.getMapPreview = this.getMapPreview.bind( this );
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
            if ( markers && 0 < markers.length ) {
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

    onChangeAPIKey() {
        GHOSTKIT.googleMapsAPIKey = this.state.apiKey;

        this.setState( ( prevState ) => ( {
            mapID: prevState.apiKey,
        } ) );
    }

    // eslint-disable-next-line class-methods-use-this
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
                            placeholder={ __( 'Enter Style JSON', '@@text_domain' ) }
                            value={ styleCustom }
                            onChange={ ( value ) => setAttributes( { styleCustom: value } ) }
                        />
                        <p>
                            <em>
                                { __( 'You can use custom styles presets from the', '@@text_domain' ) }
                                { ' ' }
                                <ExternalLink href="https://snazzymaps.com/">{ __( 'Snazzy Maps', '@@text_domain' ) }</ExternalLink>
                                .
                            </em>
                        </p>
                    </Fragment>
                ) : '' }
            </Fragment>
        );
    }

    getMapPreview() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        const {
            zoom,
            lat,
            lng,
            showZoomButtons,
            showMapTypeButtons,
            showStreetViewButton,
            showFullscreenButton,
            optionDraggable,
            styleCustom,
            markers,
        } = attributes;

        return (
            <MapBlock
                key={ this.state.mapID + markers.length }
                googleMapURL={ `${ mapsUrl }&key=${ maybeEncode( this.state.apiKey ) }` }
                loadingElement={ <div style={ { height: '100%' } } /> }
                mapElement={ <div style={ { height: '100%' } } /> }
                containerElement={ <div className="ghostkit-google-maps-wrap" style={ { minHeight: '100%' } } /> }
                markers={ markers }
                zoom={ zoom }
                center={ { lat, lng } }
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
                defaultCenter={ { lat, lng } }
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
        );
    }

    updateMarkerAddress( latLng, address ) {
        const {
            attributes,
        } = this.props;

        const { markers } = attributes;
        const { addresses } = this.state;

        if ( markers && 0 < markers.length ) {
            markers.forEach( ( marker, index ) => {
                if ( ! marker.address && latLng.lat === marker.lat && latLng.lng === marker.lng ) {
                    markers[ index ].address = address;
                    addresses[ latLng.lat + latLng.lng ] = address;
                }
            } );
            this.setState( { addresses } );
        }
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
                            title: __( 'Full Height', '@@text_domain' ),
                            onClick: () => setAttributes( { fullHeight: ! fullHeight } ),
                            isActive: fullHeight,
                        },
                    ] }
                    />
                    <Toolbar
                        controls={ [
                            {
                                icon: getIcon( 'icon-marker' ),
                                title: __( 'Add Marker', '@@text_domain' ),
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
                                <Button
                                    label={ __( 'Style', '@@text_domain' ) }
                                    icon={ getIcon( 'icon-map' ) }
                                    className="components-toolbar__control"
                                    onClick={ onToggle }
                                />
                            ) }
                            renderContent={ () => (
                                <div style={ {
                                    minWidth: 260,
                                } }
                                >
                                    { this.getStylesPicker() }
                                </div>
                            ) }
                        />
                    </Toolbar>
                </BlockControls>
                <InspectorControls>
                    { this.state.apiKey ? (
                        <Fragment>
                            <PanelBody>
                                <ToggleControl
                                    label={ __( 'Full Height', '@@text_domain' ) }
                                    checked={ !! fullHeight }
                                    onChange={ ( val ) => setAttributes( { fullHeight: val } ) }
                                />
                                <RangeControl
                                    label={ fullHeight ? __( 'Minimal Height', '@@text_domain' ) : __( 'Height', '@@text_domain' ) }
                                    value={ height }
                                    onChange={ ( value ) => setAttributes( { height: value } ) }
                                    min={ 100 }
                                    max={ 800 }
                                />
                                <RangeControl
                                    label={ __( 'Zoom', '@@text_domain' ) }
                                    value={ zoom }
                                    onChange={ ( value ) => setAttributes( { zoom: value } ) }
                                    min={ 1 }
                                    max={ 18 }
                                />
                            </PanelBody>
                            <PanelBody title={ __( 'Markers', '@@text_domain' ) }>
                                { markers && 0 < markers.length ? (
                                    <ul className="ghostkit-google-maps-markers">
                                        { markers.map( ( marker, index ) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <li key={ index }>
                                                <SearchBox
                                                    googleMapURL={ `${ mapsUrl }&key=${ maybeEncode( this.state.apiKey ) }` }
                                                    placeholder={ __( 'Enter address', '@@text_domain' ) }
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
                                                    { __( 'Remove Marker', '@@text_domain' ) }
                                                </Button>
                                            </li>
                                        ) ) }
                                    </ul>
                                ) : '' }
                                <Button
                                    isSecondary
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
                                    { __( '+ Add Marker', '@@text_domain' ) }
                                </Button>
                            </PanelBody>
                            <PanelBody title={ __( 'Style', '@@text_domain' ) }>
                                { this.getStylesPicker() }
                            </PanelBody>
                            <PanelBody title={ __( 'Options', '@@text_domain' ) }>
                                <ToggleControl
                                    label={ __( 'Zoom Buttons', '@@text_domain' ) }
                                    checked={ !! showZoomButtons }
                                    onChange={ ( val ) => setAttributes( { showZoomButtons: val } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Map Type Buttons', '@@text_domain' ) }
                                    checked={ !! showMapTypeButtons }
                                    onChange={ ( val ) => setAttributes( { showMapTypeButtons: val } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Street View Button', '@@text_domain' ) }
                                    checked={ !! showStreetViewButton }
                                    onChange={ ( val ) => setAttributes( { showStreetViewButton: val } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Fullscreen Button', '@@text_domain' ) }
                                    checked={ !! showFullscreenButton }
                                    onChange={ ( val ) => setAttributes( { showFullscreenButton: val } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Scroll Wheel', '@@text_domain' ) }
                                    checked={ !! optionScrollWheel }
                                    onChange={ ( val ) => setAttributes( { optionScrollWheel: val } ) }
                                />
                                <ToggleControl
                                    label={ __( 'Draggable', '@@text_domain' ) }
                                    checked={ !! optionDraggable }
                                    onChange={ ( val ) => setAttributes( { optionDraggable: val } ) }
                                />
                                { optionScrollWheel || optionDraggable ? (
                                    <ToggleControl
                                        label={ ( () => {
                                            if ( optionScrollWheel && optionDraggable ) {
                                                return __( 'Better Scroll & Draggable', '@@text_domain' );
                                            }
                                            if ( optionScrollWheel ) {
                                                return __( 'Better Scroll', '@@text_domain' );
                                            }
                                            if ( optionDraggable ) {
                                                return __( 'Better Draggable', '@@text_domain' );
                                            }
                                            return '';
                                        } )() }
                                        help={ ( () => {
                                            if ( optionScrollWheel && optionDraggable ) {
                                                return __( 'Scroll with pressed Ctrl or ⌘ key to zoom. Draggable with two fingers.', '@@text_domain' );
                                            }
                                            if ( optionScrollWheel ) {
                                                return __( 'Scroll with pressed Ctrl or ⌘ key to zoom.', '@@text_domain' );
                                            }
                                            if ( optionDraggable ) {
                                                return __( 'Draggable with two fingers.', '@@text_domain' );
                                            }
                                            return '';
                                        } )() }
                                        checked={ 'cooperative' === gestureHandling }
                                        onChange={ () => {
                                            setAttributes( { gestureHandling: 'greedy' === gestureHandling ? 'cooperative' : 'greedy' } );
                                        } }
                                    />
                                ) : '' }
                            </PanelBody>
                        </Fragment>
                    ) : '' }
                    <PanelBody title={ __( 'API Key', '@@text_domain' ) } initialOpen={ ! this.state.apiKey }>
                        <TextControl
                            placeholder={ __( 'Enter API Key', '@@text_domain' ) }
                            value={ this.state.apiKey }
                            onChange={ ( value ) => {
                                this.setState( { apiKey: value } );
                                this.onChangeAPIKey();
                                this.saveAPIKey();
                            } }
                        />
                        <p>
                            <em>
                                { __( 'A valid API key is required to use Google Maps. How to get API key', '@@text_domain' ) }
                                { ' ' }
                                <ExternalLink href="https://developers.google.com/maps/documentation/javascript/get-api-key">{ __( 'read here', '@@text_domain' ) }</ExternalLink>
                                .
                            </em>
                        </p>
                        <p><em>{ __( 'This key will be used in all Google Maps blocks on your site.', '@@text_domain' ) }</em></p>
                    </PanelBody>
                </InspectorControls>

                <div className={ className }>
                    { this.state.apiKey ? (
                        <Fragment>
                            { fullHeight ? (
                                this.getMapPreview()
                            ) : (
                                <ResizableBox
                                    className={ classnames( { 'is-selected': isSelected } ) }
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
                                    { this.getMapPreview() }
                                </ResizableBox>
                            ) }
                            { isSelected ? (
                                <div className="ghostkit-google-maps-search">
                                    <SearchBox
                                        googleMapURL={ `${ mapsUrl }&key=${ maybeEncode( this.state.apiKey ) }` }
                                        label={ __( 'Center Map', '@@text_domain' ) }
                                        placeholder={ __( 'Enter search query', '@@text_domain' ) }
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
                                        <p><small>{ __( 'You can also drag the map to change the center coordinates.', '@@text_domain' ) }</small></p>
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
                                <div><strong>{ __( 'Google Maps API Key Required', '@@text_domain' ) }</strong></div>
                                <div><small>{ __( 'Add an API key in block settings.', '@@text_domain' ) }</small></div>
                            </div>
                        </div>
                    ) }
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
