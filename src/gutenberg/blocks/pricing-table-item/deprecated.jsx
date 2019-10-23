/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    RichText,
    InnerBlocks,
} = wp.blockEditor;

const {
    applyFilters,
} = wp.hooks;

export default [
    {
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

            showPopular: {
                type: 'boolean',
                default: false,
            },
            showTitle: {
                type: 'boolean',
                default: true,
            },
            showPrice: {
                type: 'boolean',
                default: true,
            },
            showPriceCurrency: {
                type: 'boolean',
                default: true,
            },
            showPriceRepeat: {
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
        save: function( props ) {
            const {
                popularText,
                title,
                price,
                description,
                priceCurrency,
                priceRepeat,
                features,

                showPopular,
                showTitle,
                showPrice,
                showPriceCurrency,
                showPriceRepeat,
                showDescription,
                showFeatures,
                showButton,
            } = props.attributes;

            let className = classnames(
                'ghostkit-pricing-table-item',
                showPopular ? 'ghostkit-pricing-table-item-popular' : ''
            );

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/pricing-table-item',
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

                        { showPrice && ! RichText.isEmpty( price ) ? (
                            <div className="ghostkit-pricing-table-item-price">
                                { showPriceCurrency && ! RichText.isEmpty( priceCurrency ) ? (
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
                                { showPriceRepeat && ! RichText.isEmpty( priceRepeat ) ? (
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
    },
];
