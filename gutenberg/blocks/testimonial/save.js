import classnames from 'classnames/dedupe';

import IconPicker from '../../components/icon-picker';
import metadata from './block.json';

const { name } = metadata;

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { attributes } = props;

	const {
		photoId,
		photoUrl,
		photoAlt,
		photoWidth,
		photoHeight,

		icon,
		source,
		stars,
		starsIcon,
		url,
		ariaLabel,
		target,
		rel,
	} = attributes;

	let className = classnames(
		'ghostkit-testimonial',
		url && 'ghostkit-testimonial-with-link'
	);

	className = applyFilters('ghostkit.blocks.className', className, {
		...{ name },
		...props,
	});

	const blockProps = useBlockProps.save({ className });
	const innerBlockProps = useInnerBlocksProps.save({
		className: 'ghostkit-testimonial-content',
	});

	return (
		<div {...blockProps}>
			{url ? (
				<a
					className="ghostkit-testimonial-link"
					href={url}
					target={target || null}
					rel={rel || null}
					aria-label={ariaLabel || null}
				>
					<span />
				</a>
			) : null}
			{icon ? (
				<IconPicker.Render
					name={icon}
					tag="div"
					className="ghostkit-testimonial-icon"
				/>
			) : null}
			<div {...innerBlockProps} />
			{photoUrl ? (
				<div className="ghostkit-testimonial-photo">
					<img
						src={photoUrl}
						alt={photoAlt}
						className={photoId ? `wp-image-${photoId}` : null}
						width={photoWidth}
						height={photoHeight}
					/>
				</div>
			) : null}
			{!RichText.isEmpty(attributes.name) || !RichText.isEmpty(source) ? (
				<div className="ghostkit-testimonial-meta">
					{!RichText.isEmpty(attributes.name) ? (
						<div className="ghostkit-testimonial-name">
							<RichText.Content value={attributes.name} />
						</div>
					) : null}
					{!RichText.isEmpty(source) ? (
						<div className="ghostkit-testimonial-source">
							<RichText.Content value={source} />
						</div>
					) : null}
				</div>
			) : null}
			{typeof stars === 'number' && starsIcon ? (
				<div className="ghostkit-testimonial-stars">
					<div className="ghostkit-testimonial-stars-wrap">
						<div
							className="ghostkit-testimonial-stars-front"
							style={{ width: `${(100 * stars) / 5}%` }}
						>
							<IconPicker.Render name={starsIcon} />
							<IconPicker.Render name={starsIcon} />
							<IconPicker.Render name={starsIcon} />
							<IconPicker.Render name={starsIcon} />
							<IconPicker.Render name={starsIcon} />
						</div>
						<div className="ghostkit-testimonial-stars-back">
							<IconPicker.Render name={starsIcon} />
							<IconPicker.Render name={starsIcon} />
							<IconPicker.Render name={starsIcon} />
							<IconPicker.Render name={starsIcon} />
							<IconPicker.Render name={starsIcon} />
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
