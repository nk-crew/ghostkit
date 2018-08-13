// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/carousel.svg';

const { GHOSTKIT } = window;

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    RangeControl,
    SelectControl,
    ToggleControl,
    TextControl,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
} = wp.editor;

/**
 * Returns the layouts configuration for a given number of slides.
 *
 * @param {number} slides Number of slides.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getColumnsTemplate = ( slides ) => {
    const result = [];

    for ( let k = 1; k <= slides; k++ ) {
        result.push( [ 'ghostkit/carousel-slide' ] );
    }

    return result;
};

class CarouselBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            slides,
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
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'carousel' );

        className = classnames(
            className,
            'ghostkit-carousel'
        );

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
                <InspectorControls>
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
                            label={ __( 'Slides' ) }
                            value={ slides }
                            onChange={ ( value ) => setAttributes( { slides: value } ) }
                            min={ 2 }
                            max={ 20 }
                        />

                        <SelectControl
                            label={ __( 'Effect' ) }
                            value={ effect }
                            options={ [
                                {
                                    value: 'slide',
                                    label: __( 'Slide' ),
                                }, {
                                    value: 'coverflow',
                                    label: __( 'Coverflow' ),
                                }, {
                                    value: 'fade',
                                    label: __( 'Fade' ),
                                },
                            ] }
                            onChange={ ( value ) => setAttributes( { effect: value } ) }
                        />

                        <RangeControl
                            label={ __( 'Speed (seconds)' ) }
                            suffix={ __( 'sec' ) }
                            value={ speed }
                            onChange={ ( value ) => setAttributes( { speed: value } ) }
                            min={ 0 }
                            max={ 10 }
                            step={ 0.1 }
                        />

                        <RangeControl
                            label={ __( 'Autoplay (seconds)' ) }
                            value={ autoplay }
                            onChange={ ( value ) => setAttributes( { autoplay: value } ) }
                            min={ 0 }
                            max={ 20 }
                            step={ 0.3 }
                        />

                        <RangeControl
                            label={ __( 'Slides per view' ) }
                            value={ slidesPerView }
                            onChange={ ( value ) => setAttributes( { slidesPerView: value } ) }
                            min={ 1 }
                            max={ 8 }
                        />

                        <ToggleControl
                            label={ __( 'Centered slides' ) }
                            checked={ !! centeredSlides }
                            onChange={ ( val ) => setAttributes( { centeredSlides: val } ) }
                        />

                        <ToggleControl
                            label={ __( 'Loop' ) }
                            checked={ !! loop }
                            onChange={ ( val ) => setAttributes( { loop: val } ) }
                        />

                        <ToggleControl
                            label={ __( 'Free scroll' ) }
                            checked={ !! freeScroll }
                            onChange={ ( val ) => setAttributes( { freeScroll: val } ) }
                        />

                        <ToggleControl
                            label={ __( 'Show arrows' ) }
                            checked={ !! showArrows }
                            onChange={ ( val ) => setAttributes( { showArrows: val } ) }
                        />

                        { showArrows ? (
                            <Fragment>
                                <TextControl
                                    label={ __( 'Prev arrow icon' ) }
                                    value={ arrowPrevIcon }
                                    help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                                    onChange={ ( value ) => setAttributes( { arrowPrevIcon: value } ) }
                                />
                                <TextControl
                                    label={ __( 'Next arrow icon' ) }
                                    value={ arrowNextIcon }
                                    help={ __( 'Icon class. By default available FontAwesome classes. https://fontawesome.com/icons' ) }
                                    onChange={ ( value ) => setAttributes( { arrowNextIcon: value } ) }
                                />
                            </Fragment>
                        ) : '' }

                        <ToggleControl
                            label={ __( 'Show bullets' ) }
                            checked={ !! showBullets }
                            onChange={ ( val ) => setAttributes( { showBullets: val } ) }
                        />

                        { showBullets ? (
                            <ToggleControl
                                label={ __( 'Dynamic bullets' ) }
                                checked={ !! dynamicBullets }
                                onChange={ ( val ) => setAttributes( { dynamicBullets: val } ) }
                            />
                        ) : '' }

                        <RangeControl
                            label={ __( 'Gap' ) }
                            value={ gap }
                            onChange={ ( value ) => setAttributes( { gap: value } ) }
                            min={ 0 }
                            max={ 60 }
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <InnerBlocks
                        template={ getColumnsTemplate( slides ) }
                        templateLock="all"
                        allowedBlocks={ [ 'ghostkit/carousel-slide' ] }
                    />
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/carousel';

export const settings = {
    title: __( 'Carousel' ),
    description: __( 'Add a block that displays content inside carousel, then add whatever content blocks you\'d like.' ),
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'ghostkit',
    keywords: [
        __( 'carousel' ),
        __( 'slider' ),
        __( 'ghostkit' ),
    ],
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

    edit: CarouselBlock,

    save: function( { attributes, className = '' } ) {
        const {
            variant,
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
        } = attributes;

        className = classnames(
            className,
            'ghostkit-carousel'
        );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-carousel-variant-${ variant }` );
        }

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
};
