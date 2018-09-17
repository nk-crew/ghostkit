// External Dependencies.
import classnames from 'classnames/dedupe';

import IconMarker from './icons/deprecated-marker.svg';

const fixMarker = {
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitIndents: true,
        ghostkitDisplay: true,
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
};

export default [
    {
        supports: fixMarker.supports,
        attributes: fixMarker.attributes,
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
                >
                    <IconMarker />
                </div>
            );
        },
    }, {
        supports: fixMarker.supports,
        attributes: fixMarker.attributes,
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

            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-google-maps-variant-${ variant }` );
            }

            // in the first version of the block there was no viewBox attribute.
            const iconMarkerNoViewBox = IconMarker();
            delete iconMarkerNoViewBox.props.viewBox;

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
                >
                    { iconMarkerNoViewBox }
                </div>
            );
        },
    },
];
