/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { Component } = wp.element;

const { RichText, InnerBlocks } = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save Class.
 */
class BlockSave extends Component {
  render() {
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
    } = this.props.attributes;

    let className = classnames(
      'ghostkit-pricing-table-item',
      showPopular ? 'ghostkit-pricing-table-item-popular' : ''
    );

    className = applyFilters('ghostkit.blocks.className', className, {
      ...{
        name,
      },
      ...this.props,
    });

    return (
      <div className="ghostkit-pricing-table-item-wrap">
        <div className={className}>
          {showTitle && !RichText.isEmpty(title) ? (
            <RichText.Content
              tagName="h3"
              className="ghostkit-pricing-table-item-title"
              value={title}
            />
          ) : (
            ''
          )}

          {showPrice && !RichText.isEmpty(price) ? (
            <div className="ghostkit-pricing-table-item-price">
              {showPriceCurrency && !RichText.isEmpty(priceCurrency) ? (
                <RichText.Content
                  tagName="span"
                  className="ghostkit-pricing-table-item-price-currency"
                  value={priceCurrency}
                />
              ) : (
                ''
              )}
              <RichText.Content
                tagName="span"
                className="ghostkit-pricing-table-item-price-amount"
                value={price}
              />
              {showPriceRepeat && !RichText.isEmpty(priceRepeat) ? (
                <RichText.Content
                  tagName="span"
                  className="ghostkit-pricing-table-item-price-repeat"
                  value={priceRepeat}
                />
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}

          {showDescription && !RichText.isEmpty(description) ? (
            <RichText.Content
              tagName="div"
              className="ghostkit-pricing-table-item-description"
              value={description}
            />
          ) : (
            ''
          )}

          {showFeatures && !RichText.isEmpty(features) ? (
            <RichText.Content
              tagName="ul"
              className="ghostkit-pricing-table-item-features"
              value={features}
            />
          ) : (
            ''
          )}

          {showButton ? (
            <div className="ghostkit-pricing-table-item-button-wrapper">
              <InnerBlocks.Content />
            </div>
          ) : (
            ''
          )}

          {showPopular && !RichText.isEmpty(popularText) ? (
            <RichText.Content
              tagName="div"
              className="ghostkit-pricing-table-item-popular-badge"
              value={popularText}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

export default BlockSave;
