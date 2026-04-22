import classnames from 'classnames/dedupe';

import {
	InspectorControls,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { BaseControl, PanelBody, ToggleControl } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

function stripFeatureMarkup(value = '') {
	if (!value) {
		return '';
	}

	const template = document.createElement('template');
	template.innerHTML = value;

	return template.content.textContent || '';
}

function hasFeatureContent(value = '') {
	return !!stripFeatureMarkup(value).trim();
}

function getFeatureItems(value = '') {
	if (!value) {
		return [''];
	}

	const template = document.createElement('template');
	template.innerHTML = `<ul>${value}</ul>`;

	const items = Array.from(template.content.querySelectorAll('li'))
		.map((item) => item.innerHTML)
		.filter((item) => hasFeatureContent(item));

	if (items.length) {
		return items;
	}

	const fallbackItems = stripFeatureMarkup(value)
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);

	return fallbackItems.length ? fallbackItems : [''];
}

function getFeaturesMarkup(items = []) {
	return items
		.filter((item) => hasFeatureContent(item))
		.map((item) => `<li>${item}</li>`)
		.join('');
}

/**
 * Block Edit Class.
 *
 * @param props
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

	const [featureItems, setFeatureItems] = useState(() =>
		getFeatureItems(features)
	);
	const featureItemRefs = useRef([]);
	const [featureFocusIndex, setFeatureFocusIndex] = useState(null);

	useEffect(() => {
		setFeatureItems((currentItems) =>
			getFeaturesMarkup(currentItems) === (features || '')
				? currentItems
				: getFeatureItems(features)
		);
	}, [features]);

	useEffect(() => {
		if (!isSelected) {
			setFeatureItems(getFeatureItems(features));
		}
	}, [features, isSelected]);

	useEffect(() => {
		if (typeof featureFocusIndex === 'number') {
			const editable = featureItemRefs.current[
				featureFocusIndex
			]?.querySelector('[contenteditable="true"]');

			if (editable) {
				editable.focus();
			}

			setFeatureFocusIndex(null);
		}
	}, [featureFocusIndex]);

	function updateFeatureItems(nextItems, { focusIndex } = {}) {
		const normalizedItems = nextItems.length ? nextItems : [''];

		setFeatureItems(normalizedItems);
		setAttributes({
			features: getFeaturesMarkup(normalizedItems),
		});

		if (typeof focusIndex === 'number') {
			setFeatureFocusIndex(focusIndex);
		}
	}

	let className = classnames(
		'ghostkit-pricing-table-item-wrap',
		showPopular && 'ghostkit-pricing-table-item-popular'
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

	const hasRenderedFeatures =
		showFeatures && (!!getFeaturesMarkup(featureItems) || isSelected);

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody>
					<BaseControl __nextHasNoMarginBottom>
						<ToggleControl
							label={__('Show Popular Badge', 'ghostkit')}
							checked={!!showPopular}
							onChange={(value) =>
								setAttributes({ showPopular: value })
							}
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={__('Show Title', 'ghostkit')}
							checked={!!showTitle}
							onChange={(value) =>
								setAttributes({ showTitle: value })
							}
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={__('Show Price', 'ghostkit')}
							checked={!!showPrice}
							onChange={(value) =>
								setAttributes({ showPrice: value })
							}
							__nextHasNoMarginBottom
						/>
						{showPrice ? (
							<>
								<ToggleControl
									label={__(
										'Show Price Currency',
										'ghostkit'
									)}
									checked={!!showPriceCurrency}
									onChange={(value) =>
										setAttributes({
											showPriceCurrency: value,
										})
									}
									__nextHasNoMarginBottom
								/>
								<ToggleControl
									label={__('Show Price Repeat', 'ghostkit')}
									checked={!!showPriceRepeat}
									onChange={(value) =>
										setAttributes({
											showPriceRepeat: value,
										})
									}
									__nextHasNoMarginBottom
								/>
							</>
						) : null}
						<ToggleControl
							label={__('Show Description', 'ghostkit')}
							checked={!!showDescription}
							onChange={(value) =>
								setAttributes({ showDescription: value })
							}
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={__('Show Features', 'ghostkit')}
							checked={!!showFeatures}
							onChange={(value) =>
								setAttributes({ showFeatures: value })
							}
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={__('Show Button', 'ghostkit')}
							checked={!!showButton}
							onChange={(value) =>
								setAttributes({ showButton: value })
							}
							__nextHasNoMarginBottom
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
						placeholder={__('Plan', 'ghostkit')}
						withoutInteractiveFormatting
					/>
				) : null}
				{showPrice ? (
					<div className="ghostkit-pricing-table-item-price">
						{showPriceCurrency &&
						(!RichText.isEmpty(priceCurrency) || isSelected) ? (
							<div className="ghostkit-pricing-table-item-price-currency">
								<RichText
									inlineToolbar
									tagName="div"
									onChange={(val) =>
										setAttributes({ priceCurrency: val })
									}
									value={priceCurrency}
									placeholder={__('$', 'ghostkit')}
									withoutInteractiveFormatting
								/>
							</div>
						) : null}
						<div className="ghostkit-pricing-table-item-price-amount">
							<RichText
								inlineToolbar
								tagName="div"
								onChange={(val) =>
									setAttributes({ price: val })
								}
								value={price}
								placeholder="77"
								withoutInteractiveFormatting
							/>
						</div>
						{showPriceRepeat &&
						(!RichText.isEmpty(priceRepeat) || isSelected) ? (
							<div className="ghostkit-pricing-table-item-price-repeat">
								<RichText
									inlineToolbar
									tagName="div"
									onChange={(val) =>
										setAttributes({ priceRepeat: val })
									}
									value={priceRepeat}
									placeholder={__('/mo', 'ghostkit')}
									withoutInteractiveFormatting
								/>
							</div>
						) : null}
					</div>
				) : null}
				{showDescription &&
				(!RichText.isEmpty(description) || isSelected) ? (
					<RichText
						inlineToolbar
						tagName="div"
						className="ghostkit-pricing-table-item-description"
						onChange={(val) => setAttributes({ description: val })}
						value={description}
						placeholder={__('Description', 'ghostkit')}
						withoutInteractiveFormatting
					/>
				) : null}
				{hasRenderedFeatures ? (
					<ul className="ghostkit-pricing-table-item-features">
						{featureItems.map((item, index) => (
							<RichText
								key={index}
								tagName="li"
								value={item}
								onChange={(val) => {
									const nextItems = [...featureItems];
									nextItems[index] = val;
									updateFeatureItems(nextItems);
								}}
								onKeyDown={(event) => {
									const isCurrentItemEmpty =
										!hasFeatureContent(featureItems[index]);

									if (
										event.key === 'Enter' &&
										!event.shiftKey
									) {
										event.preventDefault();

										const nextItems = [...featureItems];
										nextItems.splice(index + 1, 0, '');

										updateFeatureItems(nextItems, {
											focusIndex: index + 1,
										});
									}

									if (
										event.key === 'Backspace' &&
										isCurrentItemEmpty &&
										featureItems.length > 1
									) {
										event.preventDefault();

										const nextItems = [...featureItems];
										nextItems.splice(index, 1);

										updateFeatureItems(nextItems, {
											focusIndex: Math.max(0, index - 1),
										});
									}
								}}
								ref={(element) => {
									featureItemRefs.current[index] = element;
								}}
								placeholder={
									index === 0
										? __('Add features', 'ghostkit')
										: __('Add feature', 'ghostkit')
								}
								inlineToolbar
							/>
						))}
					</ul>
				) : null}
				{showButton ? <div {...innerBlocksProps} /> : null}
				{showPopular &&
				(!RichText.isEmpty(popularText) || isSelected) ? (
					<div className="ghostkit-pricing-table-item-popular-badge">
						<RichText
							inlineToolbar
							tagName="div"
							onChange={(val) =>
								setAttributes({ popularText: val })
							}
							value={popularText}
							placeholder={__('Popular', 'ghostkit')}
							withoutInteractiveFormatting
						/>
					</div>
				) : null}
			</div>
		</div>
	);
}
