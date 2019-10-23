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
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';

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

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
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

        className = classnames(
            className,
            'ghostkit-carousel'
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
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

export default BlockEdit;
