/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
    render() {
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
        } = this.props.attributes;

        let className = 'ghostkit-google-maps';

        // add full height classname.
        if ( fullHeight ) {
            className = classnames( className, 'ghostkit-google-maps-fullheight' );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...this.props,
        } );

        const attrs = {
            className,
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

                        const markerName = `marker-${ i }`;

                        return (
                            <div
                                key={ markerName }
                                className="ghostkit-google-maps-marker"
                                { ...markerData }
                            />
                        );
                    } )
                ) : '' }
            </div>
        );
    }
}

export default BlockSave;
