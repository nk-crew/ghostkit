import classnames from 'classnames/dedupe';

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
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
		showPopular && 'ghostkit-pricing-table-item-popular'
	);

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const blockProps = useBlockProps.save({
		className: 'ghostkit-pricing-table-item-wrap',
	});
	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'ghostkit-pricing-table-item-button-wrapper',
	});

	return (
		<div {...blockProps}>
			<div className={className}>
				{showTitle && !RichText.isEmpty(title) ? (
					<RichText.Content
						tagName="h3"
						className="ghostkit-pricing-table-item-title"
						value={title}
					/>
				) : null}

				{showPrice && !RichText.isEmpty(price) ? (
					<div className="ghostkit-pricing-table-item-price">
						{showPriceCurrency &&
						!RichText.isEmpty(priceCurrency) ? (
							<RichText.Content
								tagName="span"
								className="ghostkit-pricing-table-item-price-currency"
								value={priceCurrency}
							/>
						) : null}
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
						) : null}
					</div>
				) : null}

				{showDescription && !RichText.isEmpty(description) ? (
					<RichText.Content
						tagName="div"
						className="ghostkit-pricing-table-item-description"
						value={description}
					/>
				) : null}

				{showFeatures && !RichText.isEmpty(features) ? (
					<RichText.Content
						tagName="ul"
						className="ghostkit-pricing-table-item-features"
						value={features}
					/>
				) : null}

				{showButton ? <div {...innerBlocksProps} /> : null}

				{showPopular && !RichText.isEmpty(popularText) ? (
					<RichText.Content
						tagName="div"
						className="ghostkit-pricing-table-item-popular-badge"
						value={popularText}
					/>
				) : null}
			</div>
		</div>
	);
}
