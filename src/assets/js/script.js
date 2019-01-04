import { throttle } from 'throttle-debounce';
import scriptjs from 'scriptjs';
import rafl from 'rafl';

const $ = window.jQuery;
const {
    ghostkitVariables,
    GHOSTKIT,
} = window;

class GhostKitClass {
    constructor() {
        const self = this;

        self.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/g.test( window.navigator.userAgent || window.navigator.vendor || window.opera );

        // prepare media vars.
        self.screenSizes = [];
        Object.keys( ghostkitVariables.media_sizes ).forEach( ( k ) => {
            self.screenSizes.push( ghostkitVariables.media_sizes[ k ] );
        } );

        self.counters = [];
        self.customStyles = '';
        self.reveal = false;

        // Methods bind class.
        self.initBlocks = self.initBlocks.bind( self );
        self.getWnd = self.getWnd.bind( self );
        self.isElementInViewport = self.isElementInViewport.bind( self );
        self.prepareCounters = self.prepareCounters.bind( self );
        self.runCounters = self.runCounters.bind( self );
        self.prepareCustomStyles = self.prepareCustomStyles.bind( self );
        self.prepareTabs = self.prepareTabs.bind( self );
        self.prepareAccordions = self.prepareAccordions.bind( self );
        self.prepareCarousels = self.prepareCarousels.bind( self );
        self.setFullscreenVideoSize = self.setFullscreenVideoSize.bind( self );
        self.prepareVideo = self.prepareVideo.bind( self );
        self.prepareGist = self.prepareGist.bind( self );
        self.prepareChangelog = self.prepareChangelog.bind( self );
        self.prepareGoogleMaps = self.prepareGoogleMaps.bind( self );
        self.prepareSR = self.prepareSR.bind( self );

        GHOSTKIT.triggerEvent( 'beforeInit', self );

        // Enable object-fit.
        if ( typeof window.objectFitImages !== 'undefined' ) {
            window.objectFitImages( '.ghostkit-video-poster img' );
        }

        // Additional easing.
        $.extend( $.easing, {
            easeOutCubic( x, t, b, c, d ) {
                return ( c * ( ( ( t = ( t / d ) - 1 ) * t * t ) + 1 ) ) + b;
            },
        } );

        // Alerts dismiss button.
        $( document ).on( 'click', '.ghostkit-alert-hide-button', function( e ) {
            e.preventDefault();
            $( this ).parent()
                .animate( { opacity: 0 }, 150, function() {
                    $( this ).slideUp( 200 );

                    self.runCounters();
                } );
        } );

        // Run counters.
        const throttledRunCounters = throttle( 200, () => {
            rafl( () => {
                self.runCounters();
            } );
        } );
        $( window ).on( 'DOMContentLoaded load resize scroll', () => {
            throttledRunCounters();
        } );

        // Set FS video size.
        const throttledSetFullscreenVideoSize = throttle( 200, () => {
            rafl( () => {
                self.setFullscreenVideoSize();
            } );
        } );
        $( window ).on( 'DOMContentLoaded load resize orientationchange', () => {
            throttledSetFullscreenVideoSize();
        } );

        // Init blocks.
        const throttledInitBlocks = throttle( 200, () => {
            rafl( () => {
                self.initBlocks();
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

        GHOSTKIT.triggerEvent( 'afterInit', self );
    }

    // Init blocks.
    initBlocks() {
        const self = this;

        GHOSTKIT.triggerEvent( 'beforeInitBlocks', self );

        self.prepareCustomStyles();
        self.prepareTabs();
        self.prepareAccordions();
        self.prepareCarousels();
        self.prepareVideo();
        self.prepareGist();
        self.prepareChangelog();
        self.prepareGoogleMaps();
        self.prepareCounters();
        self.prepareSR();

        GHOSTKIT.triggerEvent( 'afterInitBlocks', self );
    }

    // Get window size.
    getWnd() {
        return {
            w: window.innerWidth,
            h: window.innerHeight,
        };
    }

    /**
     * Is element in viewport.
     * https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
     *
     * @param {DOM} el - element.
     *
     * @returns {Boolean} - visible.
     */
    isElementInViewport( el ) {
        const rect = el.getBoundingClientRect();
        const self = this;

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= self.getWnd().h &&
            rect.right <= self.getWnd().w
        );
    }

    /**
     * Prepare Counters (Number Box, Progress Bar)
     */
    prepareCounters() {
        const self = this;

        GHOSTKIT.triggerEvent( 'beforePrepareCounters', self );

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

            self.counters.push( {
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
        self.runCounters();

        GHOSTKIT.triggerEvent( 'afterPrepareCounters', self );
    }

    runCounters() {
        const self = this;

        if ( ! self.counters.length ) {
            return;
        }

        GHOSTKIT.triggerEvent( 'beforeRunCounters', self );

        self.counters.forEach( ( item, index ) => {
            if ( item && self.isElementInViewport( item.el ) ) {
                self.counters[ index ] = false;

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

        GHOSTKIT.triggerEvent( 'afterRunCounters', self );
    }

    /**
     * Prepare custom styles.
     */
    prepareCustomStyles() {
        const self = this;
        let reloadStyles = false;

        GHOSTKIT.triggerEvent( 'beforePrepareCustomStyles', self );

        $( '[data-ghostkit-styles]' ).each( function() {
            const $this = $( this );
            self.customStyles += GHOSTKIT.replaceVars( $this.attr( 'data-ghostkit-styles' ) );
            $this.removeAttr( 'data-ghostkit-styles' );
            reloadStyles = true;
        } );

        if ( reloadStyles ) {
            let $style = $( '#ghostkit-blocks-custom-css-inline-css' );
            if ( ! $style.length ) {
                $style = $( '<style id="ghostkit-blocks-custom-css-inline-css">' ).appendTo( 'head' );
            }
            $style.html( self.customStyles );
        }

        GHOSTKIT.triggerEvent( 'afterPrepareCustomStyles', self );
    }

    /**
     * Prepare Tabs
     */
    prepareTabs() {
        const self = this;

        GHOSTKIT.triggerEvent( 'beforePrepareTabs', self );

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

                self.runCounters();
            } );
            $tabsButtons.find( `[data-tab="${ tabsActive }"]` ).click();
        } );

        GHOSTKIT.triggerEvent( 'afterPrepareTabs', self );
    }

    /**
     * Prepare Accordions
     */
    prepareAccordions() {
        const self = this;

        GHOSTKIT.triggerEvent( 'beforePrepareAccordions', self );

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

                    self.runCounters();
                } );
        } );

        GHOSTKIT.triggerEvent( 'afterPrepareAccordions', self );
    }

    /**
     * Prepare Carousels
     */
    prepareCarousels() {
        const self = this;

        if ( typeof window.Swiper === 'undefined' ) {
            return;
        }

        GHOSTKIT.triggerEvent( 'beforePrepareCarousels', self );

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
                let currentPoint = Math.min( self.screenSizes.length - 1, count );

                for ( ; currentPoint >= 0; currentPoint-- ) {
                    if ( count > 0 && typeof self.screenSizes[ currentPoint ] !== 'undefined' ) {
                        breakPoints[ self.screenSizes[ currentPoint ] ] = {
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

        GHOSTKIT.triggerEvent( 'afterPrepareCarousels', self );
    }

    // set video size
    setFullscreenVideoSize() {
        const self = this;
        const wnd = self.getWnd();
        $( '.ghostkit-video-fullscreen:visible .ghostkit-video-fullscreen-frame' ).each( function() {
            const $this = $( this );
            const aspectRatio = $this.data( 'ghostkit-video-aspect-ratio' ) || 16 / 9;
            let resultW;
            let resultH;

            if ( aspectRatio > wnd.w / wnd.h ) {
                resultW = wnd.w * 0.9;
                resultH = resultW / aspectRatio;
            } else {
                resultH = wnd.h * 0.9;
                resultW = resultH * aspectRatio;
            }

            $this.css( {
                width: resultW,
                height: resultH,
                top: ( wnd.h - resultH ) / 2,
                left: ( wnd.w - resultW ) / 2,
            } );
        } );
    }

    /**
     * Prepare Video
     */
    prepareVideo() {
        const self = this;

        if ( typeof window.VideoWorker === 'undefined' ) {
            return;
        }

        GHOSTKIT.triggerEvent( 'beforePrepareVideo', self );

        $( '.ghostkit-video:not(.ghostkit-video-ready)' ).each( function() {
            const $this = $( this ).addClass( 'ghostkit-video-ready' );
            const url = $this.attr( 'data-video' );
            const clickAction = $this.attr( 'data-click-action' );
            const fullscreenCloseIcon = $this.attr( 'data-fullscreen-action-close-icon' );
            const fullscreenBackgroundColor = $this.attr( 'data-fullscreen-background-color' );
            let $poster = $this.find( '.ghostkit-video-poster' );
            let $fullscreenWrapper = false;
            let $iframe = false;
            let mute = 0;

            let aspectRatio = $this.attr( 'data-video-aspect-ratio' );
            if ( aspectRatio && aspectRatio.split( ':' )[ 0 ] && aspectRatio.split( ':' )[ 1 ] ) {
                aspectRatio = aspectRatio.split( ':' )[ 0 ] / aspectRatio.split( ':' )[ 1 ];
            } else {
                aspectRatio = 16 / 9;
            }

            // mute on mobile devices
            if ( self.isMobile ) {
                mute = 1;
            }

            const api = new window.VideoWorker( url, {
                autoplay: 0,
                loop: 0,
                mute: mute,
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

                                self.setFullscreenVideoSize();
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

        GHOSTKIT.triggerEvent( 'afterPrepareVideo', self );
    }

    /**
     * Prepare Gist
     */
    prepareGist() {
        const self = this;

        if ( typeof jQuery.fn.gist === 'undefined' ) {
            return;
        }

        GHOSTKIT.triggerEvent( 'beforePrepareGist', self );

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

        GHOSTKIT.triggerEvent( 'afterPrepareGist', self );
    }

    /**
     * Prepare Changelog
     */
    prepareChangelog() {
        const self = this;

        GHOSTKIT.triggerEvent( 'beforePrepareChangelog', self );

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

        GHOSTKIT.triggerEvent( 'afterPrepareChangelog', self );
    }

    /**
     * Prepare Google Maps
     */
    prepareGoogleMaps() {
        const self = this;

        if ( GHOSTKIT.googleMapsLibrary && GHOSTKIT.googleMapsAPIKey ) {
            GHOSTKIT.triggerEvent( 'beforePrepareGoogleMaps', self );

            $( '.ghostkit-google-maps:not(.ghostkit-google-maps-ready)' ).each( function() {
                const $this = $( this );
                $this.addClass( 'ghostkit-google-maps-ready' );

                scriptjs( `${ GHOSTKIT.googleMapsAPIUrl }&key=${ GHOSTKIT.googleMapsAPIKey }`, () => {
                    scriptjs( GHOSTKIT.googleMapsLibrary.url, () => {
                        let styles = '';
                        let markers = '';

                        try {
                            styles = JSON.parse( $this.attr( 'data-styles' ) );
                        } catch ( e ) { }

                        try {
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

            GHOSTKIT.triggerEvent( 'afterPrepareGoogleMaps', self );
        }
    }

    /**
     * Prepare ScrollReveal
     */
    prepareSR() {
        const self = this;

        if ( ! window.ScrollReveal ) {
            return;
        } else if ( ! self.reveal ) {
            self.reveal = window.ScrollReveal().reveal;
        }

        GHOSTKIT.triggerEvent( 'beforePrepareSR', self );

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

            if ( 'zoom' === effect ) {
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

            self.reveal( this, config );
        } );

        GHOSTKIT.triggerEvent( 'afterPrepareSR', self );
    }
}

GHOSTKIT.classObject = new GhostKitClass();
