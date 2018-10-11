// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';
import { debounce } from 'throttle-debounce';

// Internal Dependencies.
import deprecatedArray from './deprecated.jsx';
import ElementIcon from '../_icons/google-maps.svg';
import IconFullHeight from './icons/fullheight.svg';
import IconFullHeightWhite from './icons/fullheight-white.svg';
import IconMarker from './icons/marker.svg';

import MapBlock from './map-block.jsx';
import SearchBox from './search-box.jsx';

const { GHOSTKIT } = window;

const mapsUrl = GHOSTKIT.googleMapsAPIUrl + '&libraries=geometry,drawing,places';
let geocoder = false;

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
    TextControl,
    TextareaControl,
    RangeControl,
    ToggleControl,
    Button,
    Toolbar,
} = wp.components;

const {
    InspectorControls,
    BlockControls,
} = wp.editor;

const { apiFetch } = wp;

class GoogleMapsBlock extends Component {
    constructor( props ) {
        super( props );

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
            apiFetch( { path: `/ghostkit/v1/update_google_maps_api_key?key=${ GHOSTKIT.googleMapsAPIKey }` } );
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

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
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
            style,
            styleCustom,
            markers,
            fullHeight,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'google_maps' );

        className = classnames( 'ghostkit-google-maps', className );

        // add full height classname.
        if ( fullHeight ) {
            className = classnames( className, 'ghostkit-google-maps-fullheight' );
        }

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-google-maps-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
                <BlockControls>
                    <Toolbar controls={ [
                        {
                            icon: fullHeight ? <IconFullHeightWhite viewBox="0 0 24 24" /> : <IconFullHeight viewBox="0 0 24 24" />,
                            title: __( 'Full Height' ),
                            onClick: () => setAttributes( { fullHeight: ! fullHeight } ),
                            isActive: fullHeight,
                        },
                    ] } />
                </BlockControls>
                <InspectorControls>
                    { this.state.apiKey ? (
                        <Fragment>
                            <PanelBody>
                                { Object.keys( availableVariants ).length > 1 ? (
                                    <SelectControl
                                        label={ __( 'Variants' ) }
                                        value={ variant }
                                        options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                            value: key,
                                            label: availableVariants[ key ].title,
                                        } ) ) }
                                        onChange={ ( value ) => setAttributes( { variant: value } ) }
                                    />
                                ) : '' }

                                <RangeControl
                                    label={ __( 'Height' ) }
                                    value={ height }
                                    onChange={ ( value ) => setAttributes( { height: value } ) }
                                    min={ 200 }
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
                                                    googleMapURL={ mapsUrl + '&key=' + this.state.apiKey }
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
                                        markers.push( {
                                            lat,
                                            lng,
                                        } );

                                        setAttributes( {
                                            markers: Object.assign( [], markers ),
                                        } );
                                    } }
                                >
                                    { __( '+ Add Marker' ) }
                                </Button>
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
                            </PanelBody>
                            <PanelBody title={ __( 'Style' ) }>
                                <SelectControl
                                    value={ style }
                                    options={ [
                                        {
                                            value: 'default',
                                            label: 'Default',
                                        },
                                        {
                                            value: 'light',
                                            label: 'Light',
                                        },
                                        {
                                            value: 'dark',
                                            label: 'Dark',
                                        },
                                        {
                                            value: 'pale_dawn',
                                            label: 'Pale Dawn',
                                        },
                                        {
                                            value: 'bright',
                                            label: 'Bright',
                                        },
                                        {
                                            value: 'custom',
                                            label: 'Custom',
                                        },
                                    ] }
                                    onChange={ ( value ) => {
                                        let customString = styleCustom;

                                        switch ( value ) {
                                        case 'bright':
                                            customString = '[{"featureType":"all","elementType":"all","stylers":[{"saturation":"32"},{"lightness":"-3"},{"visibility":"on"},{"weight":"1.18"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"saturation":"-70"},{"lightness":"14"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":"100"},{"lightness":"-14"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"12"}]}]';
                                            break;
                                        case 'pale_dawn':
                                            customString = '[{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}]';
                                            break;
                                        case 'light':
                                            customString = '[{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]';
                                            break;
                                        case 'dark':
                                            customString = '[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.country","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":"-100"},{"lightness":"30"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"gamma":"0.00"},{"lightness":"74"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"3"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]';
                                            break;
                                        case 'custom':
                                            break;
                                        default:
                                            customString = '';
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
                            <MapBlock
                                key={ this.state.mapID + markers.length }
                                googleMapURL={ mapsUrl + '&key=' + this.state.apiKey }
                                containerElement={ <div className="ghostkit-google-maps-wrap" style={ { minHeight: height } } /> }
                                markers={ markers }
                                zoom={ zoom }
                                center={ { lat: lat, lng: lng } }
                                options={ {
                                    styles: styleCustom ? this.getStyles( styleCustom ) : [],
                                    zoomControl: showZoomButtons,
                                    mapTypeControl: showMapTypeButtons,
                                    streetViewControl: showStreetViewButton,
                                    fullscreenControl: showFullscreenButton,
                                    scrollwheel: isSelected ? optionScrollWheel : false,
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
                                    scrollwheel: isSelected ? optionScrollWheel : false,
                                    draggable: optionDraggable,
                                } }
                                onZoomChanged={ debounce( 500, ( val ) => setAttributes( { zoom: val } ) ) }
                                onCenterChanged={ debounce( 500, ( val ) => setAttributes( { lat: val.lat(), lng: val.lng() } ) ) }
                            />
                            { isSelected ? (
                                <div className="ghostkit-google-maps-search">
                                    <SearchBox
                                        googleMapURL={ mapsUrl + '&key=' + this.state.apiKey }
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
    description: __( 'Show Google Maps with markers.' ),
    icon: ElementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'maps' ),
        __( 'google' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitSpacings: true,
        ghostkitDisplay: true,
        ghostkitSR: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
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

    save: function( { attributes, className = '' } ) {
        const {
            variant,
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
            styleCustom,
            markers,
            fullHeight,
        } = attributes;

        className = classnames( 'ghostkit-google-maps', className );

        // add full height classname.
        if ( fullHeight ) {
            className = classnames( className, 'ghostkit-google-maps-fullheight' );
        }

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-google-maps-variant-${ variant }` );
        }

        return (
            <div
                className={ className }
                data-lat={ lat }
                data-lng={ lng }
                data-zoom={ zoom }
                data-show-zoom-buttons={ showZoomButtons ? 'true' : 'false' }
                data-show-map-type-buttons={ showMapTypeButtons ? 'true' : 'false' }
                data-show-street-view-button={ showStreetViewButton ? 'true' : 'false' }
                data-show-fullscreen-button={ showFullscreenButton ? 'true' : 'false' }
                data-option-scroll-wheel={ optionScrollWheel ? 'true' : 'false' }
                data-option-draggable={ optionDraggable ? 'true' : 'false' }
                data-styles={ styleCustom }
                data-markers={ markers ? JSON.stringify( markers ) : '' }
                style={ { minHeight: height } }
            />
        );
    },

    deprecated: deprecatedArray,
};
