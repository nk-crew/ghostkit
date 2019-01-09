// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/pricing.svg';

const { GHOSTKIT } = window;

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    BaseControl,
    PanelBody,
    SelectControl,
    ToggleControl,
} = wp.components;

const {
    InspectorControls,
    RichText,
    InnerBlocks,
} = wp.editor;

class PricingTableItemBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            popularText,
            title,
            price,
            priceCurrency,
            priceRepeat,
            description,
            features,

            showPopular,
            showTitle,
            showDescription,
            showFeatures,
            showButton,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-pricing-table-item'
        );

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        const availableVariants = GHOSTKIT.getVariants( 'pricing_table_item' );

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
                    <div className="ghostkit-pricing-table-item-price">
                        { ! RichText.isEmpty( priceCurrency ) || isSelected ? (
                            <div className="ghostkit-pricing-table-item-price-currency">
                                <RichText
                                    tagName="span"
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
                                tagName="span"
                                onChange={ ( val ) => setAttributes( { price: val } ) }
                                value={ price }
                                placeholder={ __( '77' ) }
                                formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                keepPlaceholderOnFocus
                            />
                        </div>
                        { ! RichText.isEmpty( priceRepeat ) || isSelected ? (
                            <div className="ghostkit-pricing-table-item-price-repeat">
                                <RichText
                                    tagName="span"
                                    onChange={ ( val ) => setAttributes( { priceRepeat: val } ) }
                                    value={ priceRepeat }
                                    placeholder={ __( '/mo' ) }
                                    formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
                                    keepPlaceholderOnFocus
                                />
                            </div>
                        ) : '' }
                    </div>
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
                                tagName="span"
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

export const name = 'ghostkit/pricing-table-item';

export const settings = {
    title: __( 'Pricing Table Item' ),
    parent: [ 'ghostkit/pricing-table' ],
    description: __( 'A single item within a pricing table block.' ),
    icon: elementIcon,
    category: 'ghostkit',
    ghostkit: {
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
        inserter: false,
        reusable: false,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        showPopular: {
            type: 'boolean',
            default: false,
        },
        popularText: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-pricing-table-item-popular-badge',
            default: 'Popular',
        },
        title: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-pricing-table-item-title',
            default: 'Standard',
        },
        price: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-pricing-table-item-price-amount',
            default: [
                {
                    props: {
                        children: [ '77' ],
                    },
                    type: 'strong',
                },
            ],
        },
        priceCurrency: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-pricing-table-item-price-currency',
            default: '$',
        },
        priceRepeat: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-pricing-table-item-price-repeat',
        },
        description: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-pricing-table-item-description',
        },
        features: {
            type: 'array',
            source: 'children',
            selector: '.ghostkit-pricing-table-item-features',
            default: [
                {
                    props: {
                        children: [ 'Feature 1' ],
                    },
                    type: 'li',
                },
                {
                    props: {
                        children: [ 'Feature 2' ],
                    },
                    type: 'li',
                },
            ],
        },

        showTitle: {
            type: 'boolean',
            default: true,
        },
        showDescription: {
            type: 'boolean',
            default: false,
        },
        showFeatures: {
            type: 'boolean',
            default: true,
        },
        showButton: {
            type: 'boolean',
            default: true,
        },
    },

    edit: PricingTableItemBlock,

    save: function( props ) {
        const {
            variant,
            popularText,
            title,
            price,
            description,
            priceCurrency,
            priceRepeat,
            features,

            showPopular,
            showTitle,
            showDescription,
            showFeatures,
            showButton,
        } = props.attributes;

        let className = classnames(
            'ghostkit-pricing-table-item',
            showPopular ? 'ghostkit-pricing-table-item-popular' : ''
        );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-pricing-table-item-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className="ghostkit-pricing-table-item-wrap">
                <div className={ className }>
                    { showTitle && ! RichText.isEmpty( title ) ? (
                        <RichText.Content
                            tagName="h3"
                            className="ghostkit-pricing-table-item-title"
                            value={ title }
                        />
                    ) : '' }

                    { ! RichText.isEmpty( price ) ? (
                        <div className="ghostkit-pricing-table-item-price">
                            { ! RichText.isEmpty( priceCurrency ) ? (
                                <RichText.Content
                                    tagName="span"
                                    className="ghostkit-pricing-table-item-price-currency"
                                    value={ priceCurrency }
                                />
                            ) : '' }
                            <RichText.Content
                                tagName="span"
                                className="ghostkit-pricing-table-item-price-amount"
                                value={ price }
                            />
                            { ! RichText.isEmpty( priceRepeat ) ? (
                                <RichText.Content
                                    tagName="span"
                                    className="ghostkit-pricing-table-item-price-repeat"
                                    value={ priceRepeat }
                                />
                            ) : '' }
                        </div>
                    ) : '' }

                    { showDescription && ! RichText.isEmpty( description ) ? (
                        <RichText.Content
                            tagName="div"
                            className="ghostkit-pricing-table-item-description"
                            value={ description }
                        />
                    ) : '' }

                    { showFeatures && ! RichText.isEmpty( features ) ? (
                        <RichText.Content
                            tagName="ul"
                            className="ghostkit-pricing-table-item-features"
                            value={ features }
                        />
                    ) : '' }

                    { showButton ? (
                        <div className="ghostkit-pricing-table-item-button-wrapper">
                            <InnerBlocks.Content />
                        </div>
                    ) : '' }

                    { showPopular && ! RichText.isEmpty( popularText ) ? (
                        <div className="ghostkit-pricing-table-item-popular-badge">{ popularText }</div>
                    ) : '' }
                </div>
            </div>
        );
    },
};
