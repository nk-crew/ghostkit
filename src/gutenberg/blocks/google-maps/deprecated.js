/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const fixMarker = {
    ghostkit: {
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
    // v1.6.3
    {
        supports: fixMarker.supports,
        attributes: fixMarker.attributes,
        save( props ) {
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
                    name: 'ghostkit/google-maps',
                },
                ...props,
            } );

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
    },
];
