/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const {
    InnerBlocks,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import metadata from './block.json';
import save from './save';

export default [
    // v2.8.2
    {
        ghostkit: {
            supports: {
                styles: true,
                frame: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        supports: metadata.supports,
        attributes: {
            ...metadata.attributes,
            arrowPrevIcon: {
                type: 'string',
                default: 'fas fa-angle-left',
            },
            arrowNextIcon: {
                type: 'string',
                default: 'fas fa-angle-right',
            },
        },
        save,
    },

    // v1.6.3
    {
        ghostkit: {
            previewUrl: 'https://ghostkit.io/blocks/carousel/',
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
            slides: {
                type: 'number',
                default: 3,
            },
            effect: {
                type: 'string',
                default: 'slide',
            },
            speed: {
                type: 'number',
                default: 0.2,
            },
            autoplay: {
                type: 'number',
                default: 4,
            },
            slidesPerView: {
                type: 'number',
                default: 3,
            },
            centeredSlides: {
                type: 'boolean',
                default: true,
            },
            loop: {
                type: 'boolean',
                default: true,
            },
            freeScroll: {
                type: 'boolean',
                default: false,
            },
            showArrows: {
                type: 'boolean',
                default: true,
            },
            arrowPrevIcon: {
                type: 'string',
                default: 'fas fa-angle-left',
            },
            arrowNextIcon: {
                type: 'string',
                default: 'fas fa-angle-right',
            },
            showBullets: {
                type: 'boolean',
                default: true,
            },
            dynamicBullets: {
                type: 'boolean',
                default: true,
            },
            gap: {
                type: 'number',
                default: 15,
            },
        },
        save: function( props ) {
            const {
                effect,
                speed,
                autoplay,
                slidesPerView,
                centeredSlides,
                loop,
                freeScroll,
                showArrows,
                arrowPrevIcon,
                arrowNextIcon,
                showBullets,
                dynamicBullets,
                gap,
            } = props.attributes;

            let className = 'ghostkit-carousel';

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/carousel',
                },
                ...props,
            } );

            return (
                <div
                    className={ className }
                    data-effect={ effect }
                    data-speed={ speed }
                    data-autoplay={ autoplay }
                    data-slides-per-view={ slidesPerView }
                    data-centered-slides={ centeredSlides ? 'true' : 'false' }
                    data-loop={ loop ? 'true' : 'false' }
                    data-free-scroll={ freeScroll ? 'true' : 'false' }
                    data-show-arrows={ showArrows ? 'true' : 'false' }
                    data-arrow-prev-icon={ arrowPrevIcon }
                    data-arrow-next-icon={ arrowNextIcon }
                    data-show-bullets={ showBullets ? 'true' : 'false' }
                    data-dynamic-bullets={ dynamicBullets ? 'true' : 'false' }
                    data-gap={ gap }
                >
                    <div className="ghostkit-carousel-items">
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },
];
