const $ = window.jQuery;
const { ghostkitVariables } = window;
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/g.test( window.navigator.userAgent || window.navigator.vendor || window.opera );

// prepare media vars.
const screenSizes = [];
Object.keys( ghostkitVariables.media_sizes ).forEach( ( k ) => {
    screenSizes.push( ghostkitVariables.media_sizes[ k ] );
} );

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
                const $item = $heading.closest( '.ghostkit-accordion-item' );
                const $content = $item.find( '.ghostkit-accordion-item-content' );
                const isActive = $item.hasClass( 'ghostkit-accordion-item-active' );

                if ( isActive ) {
                    $content.css( 'display', 'block' ).slideUp( 150 );
                    $item.removeClass( 'ghostkit-accordion-item-active' );
                } else {
                    $content.css( 'display', 'none' ).slideDown( 150 );
                    $item.addClass( 'ghostkit-accordion-item-active' );
                }
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
        let $poster = $this.find( '.ghostkit-video-poster' );
        let $iframe = false;

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

                // add loading button
                if ( ! loaded ) {
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
                $this.removeClass( 'ghostkit-video-loading' ).addClass( 'ghostkit-video-playing' );
            } );
            api.on( 'pause', () => {
                $this.removeClass( 'ghostkit-video-playing' );
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

// dynamically watch for elements ready state.
let observer = false;
if ( typeof window.MutationObserver !== 'undefined' ) {
    observer = new window.MutationObserver( ( mutations ) => {
        let readyCustomStyles = false;
        let readyTabsBlock = false;
        let readyAccordionBlock = false;
        let readyGistBlock = false;
        let readyVideoBlock = false;

        mutations.forEach( function( mutation ) {
            if ( mutation.addedNodes && mutation.addedNodes.length ) {
                mutation.addedNodes.forEach( function( node ) {
                    if ( $( node ).is( '[data-ghostkit-styles]' ) ) {
                        readyCustomStyles = 1;
                    }
                    if ( $( node ).is( '.ghostkit-tabs:not(.ghostkit-tabs-ready)' ) ) {
                        readyTabsBlock = 1;
                    }
                    if ( $( node ).is( '.ghostkit-accordion:not(.ghostkit-accordion-ready)' ) ) {
                        readyAccordionBlock = 1;
                    }
                    if ( $( node ).is( '.ghostkit-video:not(.ghostkit-video-ready)' ) ) {
                        readyVideoBlock = 1;
                    }
                    if ( $( node ).is( '.ghostkit-gist:not(.ghostkit-gist-ready)' ) ) {
                        readyGistBlock = 1;
                    }
                } );
            }
        } );

        if ( readyCustomStyles ) {
            prepareCustomStyles();
        }
        if ( readyTabsBlock ) {
            prepareTabs();
        }
        if ( readyAccordionBlock ) {
            prepareAccordions();
        }
        if ( readyVideoBlock ) {
            prepareVideo();
        }
        if ( readyGistBlock ) {
            prepareGist();
        }
    } );

    observer.observe( document.documentElement, {
        childList: true,
        subtree: true,
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
        } );
} );

// on dom ready.
$( document ).on( 'DOMContentLoaded load', () => {
    prepareCustomStyles();
    prepareTabs();
    prepareAccordions();
    prepareCarousels();
    prepareVideo();
    prepareGist();
} );
