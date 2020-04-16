/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';

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
 * Returns the layouts configuration for a given number of slides.
 *
 * @param {number} slides Number of slides.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getColumnsTemplate = ( slides ) => {
    const result = [];

    for ( let k = 1; k <= slides; k += 1 ) {
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
                            label={ __( 'Slides', '@@text_domain' ) }
                            value={ slides }
                            onChange={ ( value ) => setAttributes( { slides: value } ) }
                            min={ 2 }
                            max={ 20 }
                        />
                    </PanelBody>
                    <PanelBody>
                        <SelectControl
                            label={ __( 'Effect', '@@text_domain' ) }
                            value={ effect }
                            options={ [
                                {
                                    value: 'slide',
                                    label: __( 'Slide', '@@text_domain' ),
                                }, {
                                    value: 'coverflow',
                                    label: __( 'Coverflow', '@@text_domain' ),
                                }, {
                                    value: 'fade',
                                    label: __( 'Fade', '@@text_domain' ),
                                },
                            ] }
                            onChange={ ( value ) => setAttributes( { effect: value } ) }
                        />
                    </PanelBody>
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Speed (seconds)', '@@text_domain' ) }
                            suffix={ __( 'sec', '@@text_domain' ) }
                            value={ speed }
                            onChange={ ( value ) => setAttributes( { speed: value } ) }
                            min={ 0 }
                            max={ 10 }
                            step={ 0.1 }
                        />
                        <RangeControl
                            label={ __( 'Autoplay (seconds)', '@@text_domain' ) }
                            value={ autoplay }
                            onChange={ ( value ) => setAttributes( { autoplay: value } ) }
                            min={ 0 }
                            max={ 20 }
                            step={ 0.3 }
                        />
                        <RangeControl
                            label={ __( 'Slides per view', '@@text_domain' ) }
                            value={ slidesPerView }
                            onChange={ ( value ) => setAttributes( { slidesPerView: value } ) }
                            min={ 1 }
                            max={ 8 }
                        />
                        <RangeControl
                            label={ __( 'Gap', '@@text_domain' ) }
                            value={ gap }
                            onChange={ ( value ) => setAttributes( { gap: value } ) }
                            min={ 0 }
                            max={ 60 }
                        />
                    </PanelBody>
                    <PanelBody>
                        <ToggleControl
                            label={ __( 'Centered slides', '@@text_domain' ) }
                            checked={ !! centeredSlides }
                            onChange={ ( val ) => setAttributes( { centeredSlides: val } ) }
                        />
                        <ToggleControl
                            label={ __( 'Loop', '@@text_domain' ) }
                            checked={ !! loop }
                            onChange={ ( val ) => setAttributes( { loop: val } ) }
                        />
                        <ToggleControl
                            label={ __( 'Free scroll', '@@text_domain' ) }
                            checked={ !! freeScroll }
                            onChange={ ( val ) => setAttributes( { freeScroll: val } ) }
                        />
                        <ToggleControl
                            label={ __( 'Show arrows', '@@text_domain' ) }
                            checked={ !! showArrows }
                            onChange={ ( val ) => setAttributes( { showArrows: val } ) }
                        />
                        { showArrows ? (
                            <Fragment>
                                <IconPicker
                                    label={ __( 'Prev arrow icon', '@@text_domain' ) }
                                    value={ arrowPrevIcon }
                                    onChange={ ( value ) => setAttributes( { arrowPrevIcon: value } ) }
                                />
                                <IconPicker
                                    label={ __( 'Next arrow icon', '@@text_domain' ) }
                                    value={ arrowNextIcon }
                                    onChange={ ( value ) => setAttributes( { arrowNextIcon: value } ) }
                                />
                            </Fragment>
                        ) : '' }
                        <ToggleControl
                            label={ __( 'Show bullets', '@@text_domain' ) }
                            checked={ !! showBullets }
                            onChange={ ( val ) => setAttributes( { showBullets: val } ) }
                        />
                        { showBullets ? (
                            <ToggleControl
                                label={ __( 'Dynamic bullets', '@@text_domain' ) }
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
                        __experimentalMoverDirection="horizontal"
                    />
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
