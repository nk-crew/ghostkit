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
    BaseControl,
    PanelBody,
    ToggleControl,
} = wp.components;

const {
    InspectorControls,
    RichText,
    InnerBlocks,
} = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const {
            popularText,
            title,
            price,
            priceCurrency,
            priceRepeat,
            description,
            features,

            showPopular,
            showTitle,
            showPrice,
            showPriceCurrency,
            showPriceRepeat,
            showDescription,
            showFeatures,
            showButton,
        } = attributes;

        let className = classnames(
            'ghostkit-pricing-table-item',
            showPopular ? 'ghostkit-pricing-table-item-popular' : ''
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <BaseControl>
                            <ToggleControl
                                label={ __( 'Show Popular Badge' ) }
                                checked={ !! showPopular }
                                onChange={ ( value ) => setAttributes( { showPopular: value } ) }
                            />
                            <ToggleControl
                                label={ __( 'Show Title' ) }
                                checked={ !! showTitle }
                                onChange={ ( value ) => setAttributes( { showTitle: value } ) }
                            />
                            <ToggleControl
                                label={ __( 'Show Price' ) }
                                checked={ !! showPrice }
                                onChange={ ( value ) => setAttributes( { showPrice: value } ) }
                            />
                            { showPrice ? (
                                <Fragment>
                                    <ToggleControl
                                        label={ __( 'Show Price Currency' ) }
                                        checked={ !! showPriceCurrency }
                                        onChange={ ( value ) => setAttributes( { showPriceCurrency: value } ) }
                                    />
                                    <ToggleControl
                                        label={ __( 'Show Price Repeat' ) }
                                        checked={ !! showPriceRepeat }
                                        onChange={ ( value ) => setAttributes( { showPriceRepeat: value } ) }
                                    />
                                </Fragment>
                            ) : '' }
                            <ToggleControl
                                label={ __( 'Show Description' ) }
                                checked={ !! showDescription }
                                onChange={ ( value ) => setAttributes( { showDescription: value } ) }
                            />
                            <ToggleControl
                                label={ __( 'Show Features' ) }
                                checked={ !! showFeatures }
                                onChange={ ( value ) => setAttributes( { showFeatures: value } ) }
                            />
                            <ToggleControl
                                label={ __( 'Show Button' ) }
                                checked={ !! showButton }
                                onChange={ ( value ) => setAttributes( { showButton: value } ) }
                            />
                        </BaseControl>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    { showTitle ? (
                        <RichText
                            tagName="h3"
                            className="ghostkit-pricing-table-item-title"
                            onChange={ ( val ) => setAttributes( { title: val } ) }
                            value={ title }
                            placeholder={ __( 'Plan' ) }
                            formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                            keepPlaceholderOnFocus
                        />
                    ) : '' }
                    { showPrice ? (
                        <div className="ghostkit-pricing-table-item-price">
                            { showPriceCurrency && ( ! RichText.isEmpty( priceCurrency ) || isSelected ) ? (
                                <div className="ghostkit-pricing-table-item-price-currency">
                                    <RichText
                                        tagName="div"
                                        onChange={ ( val ) => setAttributes( { priceCurrency: val } ) }
                                        value={ priceCurrency }
                                        placeholder={ __( '$' ) }
                                        formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                        keepPlaceholderOnFocus
                                    />
                                </div>
                            ) : '' }
                            <div className="ghostkit-pricing-table-item-price-amount">
                                <RichText
                                    tagName="div"
                                    onChange={ ( val ) => setAttributes( { price: val } ) }
                                    value={ price }
                                    placeholder={ __( '77' ) }
                                    formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                    keepPlaceholderOnFocus
                                />
                            </div>
                            { showPriceRepeat && ( ! RichText.isEmpty( priceRepeat ) || isSelected ) ? (
                                <div className="ghostkit-pricing-table-item-price-repeat">
                                    <RichText
                                        tagName="div"
                                        onChange={ ( val ) => setAttributes( { priceRepeat: val } ) }
                                        value={ priceRepeat }
                                        placeholder={ __( '/mo' ) }
                                        formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                        keepPlaceholderOnFocus
                                    />
                                </div>
                            ) : '' }
                        </div>
                    ) : '' }
                    { showDescription && ( ! RichText.isEmpty( description ) || isSelected ) ? (
                        <RichText
                            tagName="div"
                            className="ghostkit-pricing-table-item-description"
                            onChange={ ( val ) => setAttributes( { description: val } ) }
                            value={ description }
                            placeholder={ __( 'Description' ) }
                            formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                            keepPlaceholderOnFocus
                        />
                    ) : '' }
                    { showFeatures && ( ! RichText.isEmpty( features ) || isSelected ) ? (
                        <RichText
                            tagName="ul"
                            multiline="li"
                            className="ghostkit-pricing-table-item-features"
                            onChange={ ( val ) => setAttributes( { features: val } ) }
                            value={ features }
                            placeholder={ __( 'Add features' ) }
                            keepPlaceholderOnFocus
                        />
                    ) : '' }
                    { showButton ? (
                        <InnerBlocks
                            template={ [
                                [ 'ghostkit/button', {
                                    align: 'center',
                                }, [
                                    [ 'ghostkit/button-single', {
                                        text: 'Purchase',
                                    } ],
                                ],
                                ],
                            ] }
                            templateLock="all"
                            allowedBlocks={ [ 'ghostkit/button' ] }
                        />
                    ) : '' }
                    { showPopular && ( ! RichText.isEmpty( popularText ) || isSelected ) ? (
                        <div className="ghostkit-pricing-table-item-popular-badge">
                            <RichText
                                tagName="div"
                                onChange={ ( val ) => setAttributes( { popularText: val } ) }
                                value={ popularText }
                                placeholder={ __( 'Popular' ) }
                                formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                keepPlaceholderOnFocus
                            />
                        </div>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
