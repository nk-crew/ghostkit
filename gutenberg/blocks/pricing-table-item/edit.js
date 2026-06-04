import classnames from 'classnames/dedupe';

import {
	InspectorControls,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { BaseControl, PanelBody, ToggleControl } from '@wordpress/components';
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

function parseFeatureHtml(html = '') {
	if (!html) {
		return '';
	}

	const template = document.createElement('template');
	template.innerHTML = html;

	return template.content.textContent || '';
}

function hasFeatureContent(value = '') {
	return !!parseFeatureHtml(value).trim();
}

function getFeatureValues(value = '') {
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

	const fallbackItems = parseFeatureHtml(value)
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);

	return fallbackItems.length ? fallbackItems : [''];
}

function getFeaturesMarkup(values = []) {
	return values
		.filter((item) => hasFeatureContent(item))
		.map((item) => `<li>${item}</li>`)
		.join('');
}

function focusFeatureEditable(node) {
	if (!node) {
		return false;
	}

	const editable =
		node.contentEditable === 'true'
			? node
			: node.querySelector?.('[contenteditable="true"]');

	if (!editable) {
		return false;
	}

	editable.focus();

	const range = editable.ownerDocument.createRange();
	range.selectNodeContents(editable);
	range.collapse(true);

	const selection = editable.ownerDocument.defaultView?.getSelection();

	if (selection) {
		selection.removeAllRanges();
		selection.addRange(range);
	}

	return true;
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

	const featureRowIdRef = useRef(0);
	const featureItemRefs = useRef([]);
	const [featureFocusIndex, setFeatureFocusIndex] = useState(null);

	const createFeatureRowId = useCallback(() => {
		featureRowIdRef.current += 1;
		return `feature-${featureRowIdRef.current}`;
	}, []);

	const createFeatureRow = useCallback(
		(value = '') => ({
			id: createFeatureRowId(),
			value,
		}),
		[createFeatureRowId]
	);

	const getFeatureRowsFromValues = useCallback(
		(values, previousRows = []) =>
			values.map((value, index) => ({
				id:
					previousRows[index]?.value === value
						? previousRows[index].id
						: createFeatureRowId(),
				value,
			})),
		[createFeatureRowId]
	);

	const [featureRows, setFeatureRows] = useState(() =>
		getFeatureRowsFromValues(getFeatureValues(features))
	);

	useEffect(() => {
		if (!isSelected) {
			setFeatureRows(
				getFeatureRowsFromValues(getFeatureValues(features))
			);
			return;
		}

		setFeatureRows((currentRows) => {
			const currentMarkup = getFeaturesMarkup(
				currentRows.map((row) => row.value)
			);

			if (currentMarkup === (features || '')) {
				return currentRows;
			}

			return getFeatureRowsFromValues(
				getFeatureValues(features),
				currentRows
			);
		});
	}, [features, isSelected, getFeatureRowsFromValues]);

	useLayoutEffect(() => {
		if (typeof featureFocusIndex !== 'number') {
			return;
		}

		const focusIndex = featureFocusIndex;
		const focusNode = featureItemRefs.current[focusIndex];

		const attemptFocus = () =>
			focusFeatureEditable(featureItemRefs.current[focusIndex]);

		if (!attemptFocus()) {
			const frameWindow = focusNode?.ownerDocument?.defaultView;

			if (frameWindow) {
				frameWindow.requestAnimationFrame(attemptFocus);
			}
		}

		setFeatureFocusIndex(null);
	}, [featureFocusIndex, featureRows.length]);

	function commitFeatureRows(nextRows, { focusIndex } = {}) {
		const normalizedRows = nextRows.length
			? nextRows
			: [createFeatureRow()];

		setFeatureRows(normalizedRows);
		setAttributes({
			features: getFeaturesMarkup(normalizedRows.map((row) => row.value)),
		});

		if (typeof focusIndex === 'number') {
			setFeatureFocusIndex(focusIndex);
		}
	}

	function updateFeatureRowValue(index, value) {
		const nextRows = featureRows.map((row, rowIndex) =>
			rowIndex === index ? { ...row, value } : row
		);

		commitFeatureRows(nextRows);
	}

	function insertFeatureRowAfter(index) {
		const nextRows = [...featureRows];
		nextRows.splice(index + 1, 0, createFeatureRow());

		commitFeatureRows(nextRows, { focusIndex: index + 1 });
	}

	function removeFeatureRow(index) {
		const nextRows = [...featureRows];
		nextRows.splice(index, 1);

		commitFeatureRows(nextRows, {
			focusIndex: Math.max(0, index - 1),
		});
	}

	function handleFeatureKeyDown(event, index) {
		const isCurrentRowEmpty = !hasFeatureContent(featureRows[index].value);

		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			insertFeatureRowAfter(index);
			return;
		}

		if (
			event.key === 'Backspace' &&
			isCurrentRowEmpty &&
			featureRows.length > 1
		) {
			event.preventDefault();
			removeFeatureRow(index);
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

	const featuresMarkup = getFeaturesMarkup(
		featureRows.map((row) => row.value)
	);
	const hasRenderedFeatures =
		showFeatures && (!!featuresMarkup || isSelected);

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
						{featureRows.map((row, index) => (
							<RichText
								key={row.id}
								tagName="li"
								value={row.value}
								onChange={(value) =>
									updateFeatureRowValue(index, value)
								}
								onKeyDown={(event) =>
									handleFeatureKeyDown(event, index)
								}
								ref={(element) => {
									featureItemRefs.current[index] = element;
								}}
								placeholder={
									index === 0
										? __('Add features', 'ghostkit')
										: __('Add feature', 'ghostkit')
								}
								inlineToolbar
								withoutInteractiveFormatting
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
