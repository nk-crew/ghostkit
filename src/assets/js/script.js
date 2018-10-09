import { throttle } from 'throttle-debounce';
import scriptjs from 'scriptjs';
import rafl from 'rafl';

const $ = window.jQuery;
const { ghostkitVariables } = window;
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/g.test( window.navigator.userAgent || window.navigator.vendor || window.opera );

// prepare media vars.
const screenSizes = [];
Object.keys( ghostkitVariables.media_sizes ).forEach( ( k ) => {
    screenSizes.push( ghostkitVariables.media_sizes[ k ] );
} );

// Get window size
const $wnd = $( window );
let wndW = 0;
let wndH = 0;
function getWndSize() {
    wndW = $wnd.width();
    wndH = $wnd.height();
}
getWndSize();
$wnd.on( 'resize load orientationchange', getWndSize );

// enable object-fit.
if ( typeof window.objectFitImages !== 'undefined' ) {
    window.objectFitImages();
}

/*
 * Additional easing
 */
$.extend( $.easing, {
    easeOutCubic( x, t, b, c, d ) {
        return ( c * ( ( ( t = ( t / d ) - 1 ) * t * t ) + 1 ) ) + b;
    },
} );

/**
 * Is element in viewport.
 * https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
 *
 * @param {DOM} el - element.
 *
 * @returns {Boolean} - visible.
 */
function isElementInViewport( el ) {
    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= ( window.innerHeight || document.documentElement.clientHeight ) &&
        rect.right <= ( window.innerWidth || document.documentElement.clientWidth )
    );
}

/**
 * Prepare Counters (Number Box, Progress Bar)
 */
const counters = [];
function prepareCounters() {
    $( '.ghostkit-count-up:not(.ghostkit-count-up-ready)' ).each( function() {
        const $this = $( this );
        const isProgress = $this.hasClass( 'ghostkit-progress-bar' );
        const from = parseFloat( $this.attr( 'data-count-from' ) ) || 0;
        const to = parseFloat( isProgress ? $this.attr( 'aria-valuenow' ) : $this.text() ) || 0;
        let $progressCountBadgeWrap;
        let $progressCountBadge;

        $this.addClass( 'ghostkit-count-up-ready' );

        if ( isProgress ) {
            $progressCountBadgeWrap = $this.closest( '.ghostkit-progress' ).find( '.ghostkit-progress-bar-count' );
            $progressCountBadge = $progressCountBadgeWrap.find( '> div > span:eq(1)' );

            $progressCountBadgeWrap.css( 'width', '0%' );
            $progressCountBadge.text( '0' );
            $this.css( 'width', '0%' );
        } else {
            $this.text( from );
        }

        counters.push( {
            el: this,
            from: from,
            to: to,
            cb( num ) {
                if ( isProgress ) {
                    $this.css( 'width', `${ Math.ceil( num * 100 ) / 100 }%` );
                    $progressCountBadgeWrap.css( 'width', `${ Math.ceil( num * 100 ) / 100 }%` );

                    $progressCountBadge.text( Math.ceil( num ) );
                } else {
                    $this.text( Math.ceil( num ) );
                }
            },
        } );
    } );
    runCounters();
}

function runCounters() {
    if ( ! counters.length ) {
        return;
    }

    counters.forEach( ( item, index ) => {
        if ( item && isElementInViewport( item.el ) ) {
            counters[ index ] = false;

            $( { Counter: item.from } ).animate( { Counter: item.to }, {
                duration: 1000,
                easing: 'easeOutCubic',
                step() {
                    item.cb( this.Counter, false );
                },
                complete() {
                    item.cb( item.to, true );
                },
            } );
        }
    } );
}
runCounters = throttle( 200, runCounters );

$( window ).on( 'DOMContentLoaded load resize scroll', runCounters );

/**
 * Prepare custom styles.
 */
let customStyles = '';
function prepareCustomStyles() {
    let reloadStyles = false;
    $( '[data-ghostkit-styles]' ).each( function() {
        const $this = $( this );
        customStyles += window.GHOSTKIT.replaceVars( $this.attr( 'data-ghostkit-styles' ) );
        $this.removeAttr( 'data-ghostkit-styles' );
        reloadStyles = true;
    } );

    if ( reloadStyles ) {
        let $style = $( '#ghostkit-blocks-custom-css-inline-css' );
        if ( ! $style.length ) {
            $style = $( '<style id="ghostkit-blocks-custom-css-inline-css">' ).appendTo( 'head' );
        }
        $style.html( customStyles );
    }
}

/**
 * Prepare Tabs
 */
function prepareTabs() {
    $( '.ghostkit-tabs:not(.ghostkit-tabs-ready)' ).each( function() {
        const $this = $( this );
        const $tabsCont = $this.children( '.ghostkit-tabs-content' );
        const $tabsButtons = $this.children( '.ghostkit-tabs-buttons' );
        const tabsActive = $this.attr( 'data-tab-active' );

        $this.addClass( 'ghostkit-tabs-ready' );

        // click action
        $this.on( 'click', '.ghostkit-tabs-buttons-item', function( e ) {
            e.preventDefault();

            const $thisBtn = $( this );

            $thisBtn.addClass( 'ghostkit-tabs-buttons-item-active' )
                .siblings().removeClass( 'ghostkit-tabs-buttons-item-active' );

            $tabsCont.children( `[data-tab="${ $thisBtn.attr( 'data-tab' ) }"]` )
                .addClass( 'ghostkit-tab-active' )
                .siblings().removeClass( 'ghostkit-tab-active' );

            runCounters();
        } );
        $tabsButtons.find( `[data-tab="${ tabsActive }"]` ).click();
    } );
}

/**
 * Prepare Accordions
 */
function prepareAccordions() {
    $( '.ghostkit-accordion:not(.ghostkit-accordion-ready)' ).each( function() {
        $( this ).addClass( 'ghostkit-accordion-ready' )
            .on( 'click', '.ghostkit-accordion-item .ghostkit-accordion-item-heading', function( e ) {
                e.preventDefault();

                const $heading = $( this );
                const $accordion = $heading.closest( '.ghostkit-accordion' );
                const $item = $heading.closest( '.ghostkit-accordion-item' );
                const $content = $item.find( '.ghostkit-accordion-item-content' );
                const isActive = $item.hasClass( 'ghostkit-accordion-item-active' );
                const collapseOne = $accordion.hasClass( 'ghostkit-accordion-collapse-one' );

                if ( isActive ) {
                    $content.css( 'display', 'block' ).slideUp( 150 );
                    $item.removeClass( 'ghostkit-accordion-item-active' );
                } else {
                    $content.css( 'display', 'none' ).slideDown( 150 );
                    $item.addClass( 'ghostkit-accordion-item-active' );
                }

                if ( collapseOne ) {
                    const $collapseItems = $accordion.find( '.ghostkit-accordion-item-active' ).not( $item );
                    if ( $collapseItems.length ) {
                        $collapseItems.find( '.ghostkit-accordion-item-content' ).css( 'display', 'block' ).slideUp( 150 );
                        $collapseItems.removeClass( 'ghostkit-accordion-item-active' );
                    }
                }

                runCounters();
            } );
    } );
}

/**
 * Prepare Carousels
 */
function prepareCarousels() {
    if ( typeof window.Swiper === 'undefined' ) {
        return;
    }

    $( '.ghostkit-carousel:not(.ghostkit-carousel-ready)' ).each( function() {
        const $carousel = $( this );
        const $items = $carousel.children( '.ghostkit-carousel-items' );
        const options = {
            speed: ( parseFloat( $carousel.attr( 'data-speed' ) ) || 0 ) * 1000,
            effect: $carousel.attr( 'data-effect' ) || 'slide',
            spaceBetween: parseFloat( $carousel.attr( 'data-gap' ) ) || 0,
            centeredSlides: $carousel.attr( 'data-centered-slides' ) === 'true',
            freeMode: $carousel.attr( 'data-free-scroll' ) === 'true',
            loop: $carousel.attr( 'data-loop' ) === 'true',
            autoplay: parseFloat( $carousel.attr( 'data-autoplay' ) ) > 0 && {
                delay: parseFloat( $carousel.attr( 'data-autoplay' ) ) * 1000,
                disableOnInteraction: false,
            },
            navigation: $carousel.attr( 'data-show-arrows' ) === 'true' && {
                nextEl: '.ghostkit-carousel-arrow-next',
                prevEl: '.ghostkit-carousel-arrow-prev',
            },
            pagination: $carousel.attr( 'data-show-bullets' ) === 'true' && {
                el: '.ghostkit-carousel-bullets',
                clickable: true,
                dynamicBullets: $carousel.attr( 'data-dynamic-bullets' ) === 'true',
            },
            slidesPerView: parseInt( $carousel.attr( 'data-slides-per-view' ), 10 ),
            keyboard: true,
            grabCursor: true,
        };

        $carousel.addClass( 'ghostkit-carousel-ready swiper-container' );
        $items.addClass( 'swiper-wrapper' );
        $items.children().addClass( 'swiper-slide' );

        // add arrows
        if ( options.navigation ) {
            $carousel.append( `
                <div class="ghostkit-carousel-arrow ghostkit-carousel-arrow-prev"><span class="${ $carousel.attr( 'data-arrow-prev-icon' ) }"></span></div>
                <div class="ghostkit-carousel-arrow ghostkit-carousel-arrow-next"><span class="${ $carousel.attr( 'data-arrow-next-icon' ) }"></span></div>
            ` );
        }

        // add bullets
        if ( options.pagination ) {
            $carousel.append( '<div class="ghostkit-carousel-bullets"></div>' );
        }

        // calculate responsive.
        const breakPoints = {};
        if ( ! isNaN( options.slidesPerView ) ) {
            let count = options.slidesPerView - 1;
            let currentPoint = Math.min( screenSizes.length - 1, count );

            for ( ; currentPoint >= 0; currentPoint-- ) {
                if ( count > 0 && typeof screenSizes[ currentPoint ] !== 'undefined' ) {
                    breakPoints[ screenSizes[ currentPoint ] ] = {
                        slidesPerView: count,
                    };
                }
                count -= 1;
            }
        }
        options.breakpoints = breakPoints;

        // init swiper
        new window.Swiper( $carousel[ 0 ], options );
    } );
}

// set video size
const setFullscreenVideoSize = throttle( 200, () => {
    $( '.ghostkit-video-fullscreen:visible .ghostkit-video-fullscreen-frame' ).each( function() {
        const $this = $( this );
        const aspectRatio = $this.data( 'ghostkit-video-aspect-ratio' ) || 16 / 9;
        let resultW;
        let resultH;

        if ( aspectRatio > wndW / wndH ) {
            resultW = wndW * 0.9;
            resultH = resultW / aspectRatio;
        } else {
            resultH = wndH * 0.9;
            resultW = resultH * aspectRatio;
        }

        $this.css( {
            width: resultW,
            height: resultH,
            top: ( wndH - resultH ) / 2,
            left: ( wndW - resultW ) / 2,
        } );
    } );
} );
$wnd.on( 'resize load orientationchange', setFullscreenVideoSize );

/**
 * Prepare Video
 */
function prepareVideo() {
    if ( typeof window.VideoWorker === 'undefined' ) {
        return;
    }

    $( '.ghostkit-video:not(.ghostkit-video-ready)' ).each( function() {
        const $this = $( this ).addClass( 'ghostkit-video-ready' );
        const url = $this.attr( 'data-video' );
        const clickAction = $this.attr( 'data-click-action' );
        const fullscreenCloseIcon = $this.attr( 'data-fullscreen-action-close-icon' );
        const fullscreenBackgroundColor = $this.attr( 'data-fullscreen-background-color' );
        let $poster = $this.find( '.ghostkit-video-poster' );
        let $fullscreenWrapper = false;
        let $iframe = false;

        let aspectRatio = $this.attr( 'data-video-aspect-ratio' );
        if ( aspectRatio && aspectRatio.split( ':' )[ 0 ] && aspectRatio.split( ':' )[ 1 ] ) {
            aspectRatio = aspectRatio.split( ':' )[ 0 ] / aspectRatio.split( ':' )[ 1 ];
        } else {
            aspectRatio = 16 / 9;
        }

        const api = new window.VideoWorker( url, {
            autoplay: 0,
            loop: 0,
            mute: 0,
            volume: parseFloat( $this.attr( 'data-video-volume' ) ) || 0,
            showContols: 1,
        } );

        if ( api && api.isValid() ) {
            let loaded = 0;
            let clicked = 0;

            // add play event
            $this.on( 'click', function() {
                if ( clicked ) {
                    return;
                }
                clicked = 1;

                if ( isMobile ) {
                    window.open( api.url );
                    return;
                }

                // fullscreen video
                if ( 'fullscreen' === clickAction ) {
                    // add loading button
                    if ( ! loaded ) {
                        $this.addClass( 'ghostkit-video-loading' );

                        api.getIframe( ( iframe ) => {
                            // add iframe
                            $iframe = $( iframe );
                            const $parent = $iframe.parent();

                            $fullscreenWrapper = $( `<div class="ghostkit-video-fullscreen" style="background-color: ${ fullscreenBackgroundColor };">` )
                                .appendTo( 'body' )
                                .append( $( `<div class="ghostkit-video-fullscreen-close"><span class="${ fullscreenCloseIcon }"></span></div>` ) )
                                .append( $( '<div class="ghostkit-video-fullscreen-frame">' ).append( $iframe ) );
                            $fullscreenWrapper.data( 'ghostkit-video-aspect-ratio', aspectRatio );
                            $parent.remove();

                            $fullscreenWrapper.fadeIn( 200 );

                            $fullscreenWrapper.on( 'click', '.ghostkit-video-fullscreen-close', () => {
                                api.pause();
                                $fullscreenWrapper.fadeOut( 200 );
                            } );

                            setFullscreenVideoSize();
                            api.play();
                        } );

                        loaded = 1;
                    } else if ( $fullscreenWrapper ) {
                        $fullscreenWrapper.fadeIn( 200 );
                        api.play();
                    }

                // plain video
                } else if ( ! loaded ) {
                    $this.addClass( 'ghostkit-video-loading' );

                    api.getIframe( ( iframe ) => {
                        // add iframe
                        $iframe = $( iframe );
                        const $parent = $iframe.parent();
                        $( '<div class="ghostkit-video-frame">' ).appendTo( $this ).append( $iframe );
                        $parent.remove();
                        api.play();
                    } );

                    loaded = 1;
                } else {
                    api.play();
                }
            } );

            // set thumb
            if ( ! $poster.length ) {
                api.getImageURL( function( imgSrc ) {
                    $poster = $( `<div class="ghostkit-video-poster"><img src="${ imgSrc }" alt=""></div>` );
                    $this.append( $poster );
                } );
            }

            if ( isMobile ) {
                return;
            }

            api.on( 'ready', () => {
                api.play();
            } );
            api.on( 'play', () => {
                $this.removeClass( 'ghostkit-video-loading' );

                if ( 'fullscreen' !== clickAction ) {
                    $this.addClass( 'ghostkit-video-playing' );
                }
            } );
            api.on( 'pause', () => {
                if ( 'fullscreen' !== clickAction ) {
                    $this.removeClass( 'ghostkit-video-playing' );
                }
                clicked = 0;
            } );
        }
    } );
}

/**
 * Prepare Gist
 */
function prepareGist() {
    if ( typeof jQuery.fn.gist === 'undefined' ) {
        return;
    }

    $( '.ghostkit-gist:not(.ghostkit-gist-ready)' ).each( function() {
        const $this = $( this );
        $this.addClass( 'ghostkit-gist-ready' );

        const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec( $this.attr( 'data-url' ) );

        if ( match && typeof match[ 1 ] !== 'undefined' ) {
            $this.data( 'gist-id', match[ 1 ] );
            $this.data( 'gist-file', $this.attr( 'data-file' ) );
            $this.data( 'gist-caption', $this.attr( 'data-caption' ) );
            $this.data( 'gist-hide-footer', $this.attr( 'data-show-footer' ) === 'false' );
            $this.data( 'gist-hide-line-numbers', $this.attr( 'data-show-line-numbers' ) === 'false' );
            $this.data( 'gist-show-spinner', true );
            $this.data( 'gist-enable-cache', true );

            $this.gist();
        }
    } );
}

/**
 * Prepare Changelog
 */
function prepareChangelog() {
    $( '.ghostkit-changelog:not(.ghostkit-changelog-ready)' ).each( function() {
        const $this = $( this );
        $this.addClass( 'ghostkit-changelog-ready' );

        // add badges.
        $this.children( '.ghostkit-changelog-more' ).find( '> ul li, > ol li' ).each( function() {
            const $li = $( this );
            const text = $.trim( $li.html() );
            const typeMatches = text.match( /^\[(new|added|fixed|improved|updated|removed|changed)\]\s(.*)/i );

            if ( typeMatches ) {
                const changeType = typeMatches[ 1 ];
                const changeDescription = typeMatches[ 2 ];

                let className = 'ghostkit-badge ghostkit-badge-outline';

                switch ( changeType.toLowerCase() ) {
                case 'added':
                case 'new':
                    className += ' ghostkit-badge-success';
                    break;
                case 'fixed':
                case 'improved':
                case 'updated':
                    className += ' ghostkit-badge-primary';
                    break;
                case 'removed':
                    className += ' ghostkit-badge-danger';
                    break;
                }

                $li.html( `<span class="${ className }">${ changeType }</span> ${ changeDescription }` );
            }
        } );
    } );
}

/**
 * Prepare Google Maps
 */
function prepareGoogleMaps() {
    if ( window.GHOSTKIT.googleMapsLibrary && window.GHOSTKIT.googleMapsAPIKey ) {
        $( '.ghostkit-google-maps:not(.ghostkit-google-maps-ready)' ).each( function() {
            const $this = $( this );
            $this.addClass( 'ghostkit-google-maps-ready' );

            scriptjs( `${ window.GHOSTKIT.googleMapsAPIUrl }&key=${ window.GHOSTKIT.googleMapsAPIKey }`, () => {
                scriptjs( window.GHOSTKIT.googleMapsLibrary.url, () => {
                    let styles = '';
                    let markers = '';

                    try {
                        styles = JSON.parse( $this.attr( 'data-styles' ) );
                        markers = JSON.parse( $this.attr( 'data-markers' ) );
                    } catch ( e ) { }

                    const mapObject = new window.GMaps( {
                        div: $this[ 0 ],
                        lat: parseFloat( $this.attr( 'data-lat' ) ),
                        lng: parseFloat( $this.attr( 'data-lng' ) ),
                        zoom: parseInt( $this.attr( 'data-zoom' ), 10 ),
                        zoomControl: 'true' === $this.attr( 'data-show-zoom-buttons' ),
                        zoomControlOpt: {
                            style: 'DEFAULT',
                            position: 'RIGHT_BOTTOM',
                        },
                        mapTypeControl: 'true' === $this.attr( 'data-show-map-type-buttons' ),
                        streetViewControl: 'true' === $this.attr( 'data-show-street-view-button' ),
                        fullscreenControl: 'true' === $this.attr( 'data-show-fullscreen-button' ),
                        scrollwheel: 'true' === $this.attr( 'data-option-scroll-wheel' ),
                        draggable: 'true' === $this.attr( 'data-option-draggable' ),
                        styles: styles,
                    } );

                    if ( markers && markers.length ) {
                        markers.forEach( ( marker ) => {
                            mapObject.addMarker( {
                                lat: marker.lat,
                                lng: marker.lng,
                            } );
                        } );
                    }
                } );
            } );
        } );
    }
}

/**
 * Prepare ScrollReveal
 */
let reveal = false;
function prepareSR() {
    if ( ! window.ScrollReveal ) {
        return;
    } else if ( ! reveal ) {
        reveal = window.ScrollReveal().reveal;
    }

    $( '[data-ghostkit-sr]:not(.data-ghostkit-sr-ready)' ).each( function() {
        const $this = $( this );

        $this.addClass( 'data-ghostkit-sr-ready' );

        // parse data from string.
        // fade-right;duration:500;delay:1000
        const data = $this.attr( 'data-ghostkit-sr' ).split( ';' );

        let effect = data[ 0 ];
        let distance = '50px';
        let scale = 1;
        let origin = effect.split( '-' );
        if ( 2 === origin.length ) {
            effect = origin[ 0 ];
            origin = origin[ 1 ];

            switch ( origin ) {
            case 'up':
                origin = 'bottom';
                break;
            case 'down':
                origin = 'top';
                break;
            case 'right':
                origin = 'right';
                break;
            case 'left':
                origin = 'left';
                break;
            }
        } else {
            origin = 'center';
            distance = 0;
        }

        if ( 'scale' === effect ) {
            scale = 0.9;
        }

        const config = {
            distance: distance,
            origin: origin,
            opacity: 0,
            scale: scale,
            duration: 900,
            delay: 0,
            reset: false,
            afterReveal() {
                $this.removeAttr( 'data-ghostkit-sr' );
                $this.removeClass( 'data-ghostkit-sr-ready' );
            },
        };

        // replace other data config.
        if ( data.length > 1 ) {
            data.forEach( ( item ) => {
                const itemData = item.split( ':' );
                if ( 2 === itemData.length ) {
                    config[ itemData[ 0 ] ] = itemData[ 1 ];
                }
            } );
        }

        config.scale = parseFloat( config.scale );
        config.duration = parseFloat( config.duration );
        config.delay = parseFloat( config.delay );

        reveal( this, config );
    } );
}

/**
 * Prepare alerts dismiss button.
 */
$( document ).on( 'click', '.ghostkit-alert-hide-button', function( e ) {
    e.preventDefault();
    $( this ).parent()
        .animate( { opacity: 0 }, 150, function() {
            $( this ).slideUp( 200 );

            runCounters();
        } );
} );

/**
 * Init Blocks.
 */
const throttledInitBlocks = throttle( 200, () => {
    rafl( () => {
        prepareCustomStyles();
        prepareTabs();
        prepareAccordions();
        prepareCarousels();
        prepareVideo();
        prepareGist();
        prepareChangelog();
        prepareGoogleMaps();
        prepareCounters();
        prepareSR();
    } );
} );
if ( window.MutationObserver ) {
    new window.MutationObserver( throttledInitBlocks )
        .observe( document.documentElement, {
            childList: true, subtree: true,
        } );
} else {
    $( document ).on( 'DOMContentLoaded DOMNodeInserted load', () => {
        throttledInitBlocks();
    } );
}
