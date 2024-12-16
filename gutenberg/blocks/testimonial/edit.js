import classnames from 'classnames/dedupe';

import {
	InnerBlocks,
	InspectorControls,
	MediaUpload,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	ExternalLink,
	PanelBody,
	SelectControl,
	TextareaControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import IconPicker from '../../components/icon-picker';
import RangeControl from '../../components/range-control';
import URLPicker from '../../components/url-picker';

const DEFAULT_SIZE_SLUG = 'thumbnail';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, isSelected, clientId } = props;
	let { className = '' } = props;

	const {
		icon,
		source,

		photoId,
		photoUrl,
		photoAlt,
		photoWidth,
		photoHeight,
		photoSizeSlug,

		stars,
		starsIcon,

		url,
		ariaLabel,
		target,
		rel,
	} = attributes;

	const { hasChildBlocks, editorSettings, photoImage } = useSelect(
		(select) => {
			const blockEditor = select('core/block-editor');
			const { getMedia } = select('core');

			return {
				hasChildBlocks: blockEditor
					? blockEditor.getBlockOrder(clientId).length > 0
					: false,
				editorSettings: blockEditor.getSettings(),
				photoImage:
					attributes.photoId && isSelected
						? getMedia(attributes.photoId)
						: null,
			};
		}
	);

	const onPhotoSelect = (imageData, imageSize = false) => {
		imageSize = imageSize || attributes.photoSizeSlug || DEFAULT_SIZE_SLUG;

		const result = {
			photoId: imageData.id,
			photoUrl: imageData.url || imageData.source_url,
			photoAlt: imageData.alt || imageData.alt_text,
			photoWidth:
				imageData.width ||
				(imageData.media_details && imageData.media_details.width
					? imageData.media_details.width
					: undefined),
			photoHeight:
				imageData.height ||
				(imageData.media_details && imageData.media_details.height
					? imageData.media_details.height
					: undefined),
			photoSizeSlug: imageSize,
		};

		let sizes = imageData.sizes && imageData.sizes[imageSize];

		if (
			!sizes &&
			imageData.media_details &&
			imageData.media_details.sizes &&
			imageData.media_details.sizes[imageSize]
		) {
			sizes = imageData.media_details.sizes[imageSize];
		}

		// Prepare image data for selected size.
		if (sizes) {
			if (sizes.url) {
				result.photoUrl = sizes.url;
			}
			if (sizes.source_url) {
				result.photoUrl = sizes.source_url;
			}
			if (sizes.width) {
				result.photoWidth = sizes.width;
			}
			if (sizes.height) {
				result.photoHeight = sizes.height;
			}
		}

		setAttributes(result);
	};

	className = classnames('ghostkit-testimonial', className);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });
	const innerBlockProps = useInnerBlocksProps(
		{},
		{
			renderAppender: hasChildBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
			templateLock: false,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<IconPicker
						label={__('Icon', 'ghostkit')}
						value={icon}
						onChange={(value) => setAttributes({ icon: value })}
						insideInspector
					/>
				</PanelBody>
				<PanelBody title={__('Photo', 'ghostkit')}>
					{!photoId ? (
						<MediaUpload
							onSelect={(media) => {
								onPhotoSelect(media);
							}}
							allowedTypes={['image']}
							value={photoId}
							render={({ open }) => (
								<Button onClick={open} variant="primary">
									{__('Select Image', 'ghostkit')}
								</Button>
							)}
						/>
					) : null}

					{photoId ? (
						<>
							<MediaUpload
								onSelect={(media) => {
									onPhotoSelect(media);
								}}
								allowedTypes={['image']}
								value={photoId}
								render={({ open }) => (
									<BaseControl
										help={__(
											'Click the image to edit or update',
											'ghostkit'
										)}
										__nextHasNoMarginBottom
									>
										{/* eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-is-valid */}
										<a
											href="#"
											onClick={open}
											className="ghostkit-gutenberg-media-upload"
											style={{ display: 'block' }}
										>
											<img
												src={photoUrl}
												alt={photoAlt}
												width={photoWidth}
												height={photoHeight}
											/>
										</a>
									</BaseControl>
								)}
							/>
							<div style={{ marginTop: -20 }} />
							<Button
								isLink
								onClick={(e) => {
									setAttributes({
										photoId: '',
										photoUrl: '',
										photoAlt: '',
										photoWidth: '',
										photoHeight: '',
									});
									e.preventDefault();
								}}
								className="button button-secondary"
							>
								{__('Remove Image', 'ghostkit')}
							</Button>
							<div style={{ marginBottom: 13 }} />
							{editorSettings && editorSettings.imageSizes ? (
								<SelectControl
									label={__('Resolution', 'ghostkit')}
									help={__(
										'Select the size of the source image.',
										'ghostkit'
									)}
									value={photoSizeSlug || DEFAULT_SIZE_SLUG}
									onChange={(val) => {
										onPhotoSelect(photoImage, val);
									}}
									options={editorSettings.imageSizes.map(
										(imgSize) => ({
											value: imgSize.slug,
											label: imgSize.name,
										})
									)}
									__next40pxDefaultSize
									__nextHasNoMarginBottom
								/>
							) : null}
							<TextareaControl
								label={__('Alt text (alternative text)')}
								value={photoAlt}
								onChange={(val) =>
									setAttributes({ photoAlt: val })
								}
								help={
									<>
										<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
											{__(
												'Describe the purpose of the image',
												'ghostkit'
											)}
										</ExternalLink>
										{__(
											'Leave empty if the image is purely decorative.',
											'ghostkit'
										)}
									</>
								}
								__nextHasNoMarginBottom
							/>
						</>
					) : null}
				</PanelBody>
				<PanelBody title={__('Stars', 'ghostkit')}>
					<RangeControl
						value={stars}
						min={0}
						max={5}
						step={0.5}
						beforeIcon="star-filled"
						allowReset
						onChange={(value) => setAttributes({ stars: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					{typeof stars === 'number' ? (
						<IconPicker
							label={__('Icon', 'ghostkit')}
							value={starsIcon}
							onChange={(value) =>
								setAttributes({ starsIcon: value })
							}
							insideInspector
						/>
					) : null}
				</PanelBody>
			</InspectorControls>
			<URLPicker
				url={url}
				rel={rel}
				ariaLabel={ariaLabel}
				target={target}
				onChange={(data) => {
					setAttributes(data);
				}}
				isSelected={isSelected}
				toolbarSettings
				inspectorSettings
			/>
			<div {...blockProps}>
				{icon ? (
					<div className="ghostkit-testimonial-icon">
						<IconPicker.Dropdown
							onChange={(value) => setAttributes({ icon: value })}
							value={icon}
							renderToggle={({ onToggle }) => (
								<IconPicker.Preview
									onClick={onToggle}
									name={icon}
								/>
							)}
						/>
					</div>
				) : null}
				<div className="ghostkit-testimonial-content">
					<div {...innerBlockProps} />
				</div>
				<div className="ghostkit-testimonial-photo">
					{!photoId ? (
						<MediaUpload
							onSelect={(media) => {
								onPhotoSelect(media);
							}}
							allowedTypes={['image']}
							value={photoId}
							render={({ open }) => (
								<Button onClick={open}>
									<span className="dashicons dashicons-format-image" />
								</Button>
							)}
						/>
					) : null}

					{photoId ? (
						<MediaUpload
							onSelect={(media) => {
								onPhotoSelect(media);
							}}
							allowedTypes={['image']}
							value={photoId}
							render={({ open }) => (
								// eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-is-valid
								<a
									href="#"
									onClick={open}
									className="ghostkit-gutenberg-media-upload"
									style={{ display: 'block' }}
								>
									<img
										src={photoUrl}
										alt={photoAlt}
										width={photoWidth}
										height={photoHeight}
									/>
								</a>
							)}
						/>
					) : null}
				</div>
				<div className="ghostkit-testimonial-meta">
					<RichText
						inlineToolbar
						tagName="div"
						className="ghostkit-testimonial-name"
						placeholder={__('Write name…', 'ghostkit')}
						value={attributes.name}
						onChange={(value) => setAttributes({ name: value })}
					/>
					<RichText
						inlineToolbar
						tagName="div"
						className="ghostkit-testimonial-source"
						placeholder={__('Write source…', 'ghostkit')}
						value={source}
						onChange={(value) => setAttributes({ source: value })}
					/>
				</div>
				{typeof stars === 'number' && starsIcon ? (
					<div className="ghostkit-testimonial-stars">
						<div className="ghostkit-testimonial-stars-wrap">
							<div
								className="ghostkit-testimonial-stars-front"
								style={{ width: `${(100 * stars) / 5}%` }}
							>
								<IconPicker.Preview name={starsIcon} />
								<IconPicker.Preview name={starsIcon} />
								<IconPicker.Preview name={starsIcon} />
								<IconPicker.Preview name={starsIcon} />
								<IconPicker.Preview name={starsIcon} />
							</div>
							<div className="ghostkit-testimonial-stars-back">
								<IconPicker.Preview name={starsIcon} />
								<IconPicker.Preview name={starsIcon} />
								<IconPicker.Preview name={starsIcon} />
								<IconPicker.Preview name={starsIcon} />
								<IconPicker.Preview name={starsIcon} />
							</div>
						</div>
					</div>
				) : null}
			</div>
		</>
	);
}
