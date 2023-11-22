/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';

import { Fragment } from '@wordpress/element';

import { BaseControl, PanelBody, ToggleControl } from '@wordpress/components';

import { InspectorControls, RichText, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected } = props;

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
    'ghostkit-pricing-table-item-wrap',
    showPopular ? 'ghostkit-pricing-table-item-popular' : ''
  );

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });
  const innerBlocksProps = useInnerBlocksProps(
    {
      className: 'ghostkit-pricing-table-item-button-wrapper',
    },
    {
      template: [
        [
          'ghostkit/button',
          {
            align: 'center',
          },
          [
            [
              'ghostkit/button-single',
              {
                text: 'Purchase',
              },
            ],
          ],
        ],
      ],
      templateLock: 'all',
      allowedBlocks: ['ghostkit/button'],
    }
  );

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody>
          <BaseControl>
            <ToggleControl
              label={__('Show Popular Badge', '@@text_domain')}
              checked={!!showPopular}
              onChange={(value) => setAttributes({ showPopular: value })}
            />
            <ToggleControl
              label={__('Show Title', '@@text_domain')}
              checked={!!showTitle}
              onChange={(value) => setAttributes({ showTitle: value })}
            />
            <ToggleControl
              label={__('Show Price', '@@text_domain')}
              checked={!!showPrice}
              onChange={(value) => setAttributes({ showPrice: value })}
            />
            {showPrice ? (
              <Fragment>
                <ToggleControl
                  label={__('Show Price Currency', '@@text_domain')}
                  checked={!!showPriceCurrency}
                  onChange={(value) => setAttributes({ showPriceCurrency: value })}
                />
                <ToggleControl
                  label={__('Show Price Repeat', '@@text_domain')}
                  checked={!!showPriceRepeat}
                  onChange={(value) => setAttributes({ showPriceRepeat: value })}
                />
              </Fragment>
            ) : (
              ''
            )}
            <ToggleControl
              label={__('Show Description', '@@text_domain')}
              checked={!!showDescription}
              onChange={(value) => setAttributes({ showDescription: value })}
            />
            <ToggleControl
              label={__('Show Features', '@@text_domain')}
              checked={!!showFeatures}
              onChange={(value) => setAttributes({ showFeatures: value })}
            />
            <ToggleControl
              label={__('Show Button', '@@text_domain')}
              checked={!!showButton}
              onChange={(value) => setAttributes({ showButton: value })}
            />
          </BaseControl>
        </PanelBody>
      </InspectorControls>
      <div className="ghostkit-pricing-table-item">
        {showTitle ? (
          <RichText
            inlineToolbar
            tagName="h3"
            className="ghostkit-pricing-table-item-title"
            onChange={(val) => setAttributes({ title: val })}
            value={title}
            placeholder={__('Plan', '@@text_domain')}
            withoutInteractiveFormatting
          />
        ) : null}
        {showPrice ? (
          <div className="ghostkit-pricing-table-item-price">
            {showPriceCurrency && (!RichText.isEmpty(priceCurrency) || isSelected) ? (
              <div className="ghostkit-pricing-table-item-price-currency">
                <RichText
                  inlineToolbar
                  tagName="div"
                  onChange={(val) => setAttributes({ priceCurrency: val })}
                  value={priceCurrency}
                  placeholder={__('$', '@@text_domain')}
                  withoutInteractiveFormatting
                />
              </div>
            ) : null}
            <div className="ghostkit-pricing-table-item-price-amount">
              <RichText
                inlineToolbar
                tagName="div"
                onChange={(val) => setAttributes({ price: val })}
                value={price}
                placeholder="77"
                withoutInteractiveFormatting
              />
            </div>
            {showPriceRepeat && (!RichText.isEmpty(priceRepeat) || isSelected) ? (
              <div className="ghostkit-pricing-table-item-price-repeat">
                <RichText
                  inlineToolbar
                  tagName="div"
                  onChange={(val) => setAttributes({ priceRepeat: val })}
                  value={priceRepeat}
                  placeholder={__('/mo', '@@text_domain')}
                  withoutInteractiveFormatting
                />
              </div>
            ) : null}
          </div>
        ) : null}
        {showDescription && (!RichText.isEmpty(description) || isSelected) ? (
          <RichText
            inlineToolbar
            tagName="div"
            className="ghostkit-pricing-table-item-description"
            onChange={(val) => setAttributes({ description: val })}
            value={description}
            placeholder={__('Description', '@@text_domain')}
            withoutInteractiveFormatting
          />
        ) : null}
        {showFeatures && (!RichText.isEmpty(features) || isSelected) ? (
          <RichText
            inlineToolbar
            tagName="ul"
            multiline="li"
            className="ghostkit-pricing-table-item-features"
            onChange={(val) => setAttributes({ features: val })}
            value={features}
            placeholder={__('Add features', '@@text_domain')}
          />
        ) : null}
        {showButton ? <div {...innerBlocksProps} /> : null}
        {showPopular && (!RichText.isEmpty(popularText) || isSelected) ? (
          <div className="ghostkit-pricing-table-item-popular-badge">
            <RichText
              inlineToolbar
              tagName="div"
              onChange={(val) => setAttributes({ popularText: val })}
              value={popularText}
              placeholder={__('Popular', '@@text_domain')}
              withoutInteractiveFormatting
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
