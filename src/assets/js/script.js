const $ = window.jQuery;
const { ghostkitVariables } = window;

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

// dynamically watch for elements ready state.
let observer = false;
if ( typeof window.MutationObserver !== 'undefined' ) {
    observer = new window.MutationObserver( ( mutations ) => {
        let readyCustomStyles = false;
        let readyTabsBlock = false;
        let readyAccordionBlock = false;

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
    $( this ).parent().css( 'display', 'block' ).slideUp( 150 );
} );

// on dom ready.
$( document ).on( 'DOMContentLoaded load', () => {
    // disconnect mutation observer.
    if ( observer ) {
        observer.disconnect();
        observer = false;
    }

    prepareCustomStyles();
    prepareTabs();
    prepareAccordions();
    prepareCarousels();
} );
