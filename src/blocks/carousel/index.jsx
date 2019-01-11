// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/carousel.svg';
import deprecatedArray from './deprecated.jsx';

const { GHOSTKIT } = window;

import IconPicker from '../_components/icon-picker.jsx';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    RangeControl,
    SelectControl,
    ToggleControl,
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

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-carousel-variant-${ variant }` );
        }

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    { Object.keys( availableVariants ).length > 1 ? (
                        <PanelBody>
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        </PanelBody>
                    ) : '' }
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Slides' ) }
                            value={ slides }
                            onChange={ ( value ) => setAttributes( { slides: value } ) }
                            min={ 2 }
                            max={ 20 }
                        />
                    </PanelBody>
                    <PanelBody>
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
                    </PanelBody>
                    <PanelBody>
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
                        <RangeControl
                            label={ __( 'Gap' ) }
                            value={ gap }
                            onChange={ ( value ) => setAttributes( { gap: value } ) }
                            min={ 0 }
                            max={ 60 }
                        />
                    </PanelBody>
                    <PanelBody>
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
                                <IconPicker
                                    label={ __( 'Prev arrow icon' ) }
                                    value={ arrowPrevIcon }
                                    onChange={ ( value ) => setAttributes( { arrowPrevIcon: value } ) }
                                />
                                <IconPicker
                                    label={ __( 'Next arrow icon' ) }
                                    value={ arrowNextIcon }
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
    description: __( 'Carousel for any type of content – images or other blocks.' ),
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'carousel' ),
        __( 'slider' ),
        __( 'ghostkit' ),
    ],
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

    save: function( props ) {
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
        } = props.attributes;

        let className = 'ghostkit-carousel';

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-carousel-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
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
                data-show-bullets={ showBullets ? 'true' : 'false' }
                data-dynamic-bullets={ dynamicBullets ? 'true' : 'false' }
                data-gap={ gap }
            >
                <div className="ghostkit-carousel-items">
                    <InnerBlocks.Content />
                </div>
                { arrowPrevIcon ? (
                    <div className="ghostkit-carousel-arrow-prev-icon">
                        <IconPicker.Render name={ arrowPrevIcon } />
                    </div>
                ) : '' }
                { arrowNextIcon ? (
                    <div className="ghostkit-carousel-arrow-next-icon">
                        <IconPicker.Render name={ arrowNextIcon } />
                    </div>
                ) : '' }
            </div>
        );
    },

    deprecated: deprecatedArray,
};
