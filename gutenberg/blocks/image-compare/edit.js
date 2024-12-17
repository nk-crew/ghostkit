import classnames from 'classnames/dedupe';

import {
	BlockControls,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	BaseControl,
	Button,
	ExternalLink,
	PanelBody,
	Placeholder,
	SelectControl,
	TextareaControl,
	ToggleControl,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import ColorPicker from '../../components/color-picker';
import RangeControl from '../../components/range-control';
import getIcon from '../../utils/get-icon';

const ALLOWED_MEDIA_TYPES = ['image'];
const DEFAULT_SIZE_SLUG = 'large';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, isSelected, setAttributes } = props;
	let { className } = props;

	const {
		position,
		direction,
		trigger,
		caption,

		showLabels,
		labelBeforeText,
		labelAfterText,
		labelAlign,

		beforeId,
		beforeUrl,
		beforeAlt,
		beforeWidth,
		beforeHeight,
		beforeSizeSlug,

		afterId,
		afterUrl,
		afterAlt,
		afterWidth,
		afterHeight,
		afterSizeSlug,

		colorDivider,
		colorDividerIcon,
	} = attributes;

	const { editorSettings, beforeImage, afterImage } = useSelect((select) => {
		const { getSettings } = select('core/block-editor');
		const { getMedia } = select('core');

		return {
			editorSettings: getSettings(),
			beforeImage: beforeId && isSelected ? getMedia(beforeId) : null,
			afterImage: afterId && isSelected ? getMedia(afterId) : null,
		};
	});

	const onUploadError = (message) => {
		const { noticeOperations } = props;
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	};

	const getImgTag = (type = 'before') => {
		return attributes[`${type}Url`] ? (
			<img
				src={attributes[`${type}Url`]}
				alt={attributes[`${type}Alt`]}
				className={
					attributes[`${type}Id`]
						? `wp-image-${attributes[`${type}Id`]}`
						: null
				}
				width={attributes[`${type}Width`]}
				height={attributes[`${type}Height`]}
			/>
		) : null;
	};

	const updateImageData = (
		type = 'before',
		imageData = {},
		imageSize = false
	) => {
		imageSize =
			imageSize || attributes[`${type}SizeSlug`] || DEFAULT_SIZE_SLUG;

		// Prepare full image data.
		const result = {
			[`${type}SizeSlug`]: imageSize,
			[`${type}Id`]: imageData.id,
			[`${type}Url`]: imageData.url || imageData.source_url,
			[`${type}Alt`]: imageData.alt || imageData.alt_text,
			[`${type}Width`]:
				imageData.width ||
				(imageData.media_details && imageData.media_details.width
					? imageData.media_details.width
					: undefined),
			[`${type}Height`]:
				imageData.height ||
				(imageData.media_details && imageData.media_details.height
					? imageData.media_details.height
					: undefined),
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
				result[`${type}Url`] = sizes.url;
			}
			if (sizes.source_url) {
				result[`${type}Url`] = sizes.source_url;
			}
			if (sizes.width) {
				result[`${type}Width`] = sizes.width;
			}
			if (sizes.height) {
				result[`${type}Height`] = sizes.height;
			}
		}

		setAttributes(result);
	};

	const iconStart =
		direction === 'vertical'
			? getIcon('icon-horizontal-start')
			: getIcon('icon-vertical-top');
	const iconCenter =
		direction === 'vertical'
			? getIcon('icon-horizontal-center')
			: getIcon('icon-vertical-center');
	const iconEnd =
		direction === 'vertical'
			? getIcon('icon-horizontal-end')
			: getIcon('icon-vertical-bottom');

	className = classnames(
		'ghostkit-image-compare',
		direction === 'vertical' ? 'ghostkit-image-compare-vertical' : false,
		showLabels && labelAlign
			? `ghostkit-image-compare-labels-align-${labelAlign}`
			: false,
		className
	);

	const blockProps = useBlockProps({ className });

	const baseControlLabel =
		direction === 'vertical'
			? __('Horizontal Align', 'ghostkit')
			: __('Vertical Align', 'ghostkit');

	return (
		<>
			{beforeUrl && afterUrl ? (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={getIcon('icon-flip-vertical')}
							title={__('Vertical', 'ghostkit')}
							onClick={() =>
								setAttributes({
									direction:
										direction === 'vertical'
											? ''
											: 'vertical',
								})
							}
							isActive={direction === 'vertical'}
						/>
					</ToolbarGroup>
				</BlockControls>
			) : null}

			<InspectorControls>
				{beforeUrl && afterUrl ? (
					<PanelBody title={__('General', 'ghostkit')}>
						<RangeControl
							label={__('Start Position', 'ghostkit')}
							value={position}
							min={0}
							max={100}
							onChange={(val) => setAttributes({ position: val })}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
						<ToggleGroupControl
							label={__('Direction', 'ghostkit')}
							onChange={(val) =>
								setAttributes({ direction: val })
							}
							value={direction || ''}
							isBlock
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						>
							<ToggleGroupControlOption
								value=""
								label={__('Horizontal', 'ghostkit')}
							/>
							<ToggleGroupControlOption
								value="vertical"
								label={__('Vertical', 'ghostkit')}
							/>
						</ToggleGroupControl>
						<ToggleGroupControl
							label={__('Trigger', 'ghostkit')}
							onChange={(val) => setAttributes({ trigger: val })}
							value={trigger || ''}
							isBlock
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						>
							<ToggleGroupControlOption
								value=""
								label={__('Click', 'ghostkit')}
							/>
							<ToggleGroupControlOption
								value="hover"
								label={__('Hover', 'ghostkit')}
							/>
						</ToggleGroupControl>
					</PanelBody>
				) : null}

				<PanelBody title={__('Labels', 'ghostkit')}>
					<ToggleControl
						label={__('Show Labels', 'ghostkit')}
						checked={!!showLabels}
						onChange={(value) =>
							setAttributes({ showLabels: value })
						}
						__nextHasNoMarginBottom
					/>
					{showLabels && (
						<BaseControl
							id={baseControlLabel}
							label={baseControlLabel}
							__nextHasNoMarginBottom
						>
							<div>
								<Toolbar
									label={
										direction === 'vertical'
											? __('Horizontal Align', 'ghostkit')
											: __('Vertical Align', 'ghostkit')
									}
								>
									<ToolbarButton
										icon={iconStart}
										title={__('Start', 'ghostkit')}
										onClick={() =>
											setAttributes({
												labelAlign: 'start',
											})
										}
										isActive={labelAlign === 'start'}
									/>
									<ToolbarButton
										icon={iconCenter}
										title={__('Center', 'ghostkit')}
										onClick={() =>
											setAttributes({
												labelAlign: 'center',
											})
										}
										isActive={labelAlign === 'center'}
									/>
									<ToolbarButton
										icon={iconEnd}
										title={__('End', 'ghostkit')}
										onClick={() =>
											setAttributes({ labelAlign: 'end' })
										}
										isActive={labelAlign === 'end'}
									/>
								</Toolbar>
							</div>
						</BaseControl>
					)}
				</PanelBody>

				<PanelBody title={__('Before Image Settings', 'ghostkit')}>
					{!beforeId ? (
						<MediaUpload
							onSelect={(media) => {
								updateImageData('before', media);
							}}
							allowedTypes={['image']}
							value={beforeId}
							render={({ open }) => (
								<Button onClick={open} variant="primary">
									{__('Select Image', 'ghostkit')}
								</Button>
							)}
						/>
					) : null}

					{beforeId ? (
						<>
							<MediaUpload
								onSelect={(media) => {
									updateImageData('before', media);
								}}
								allowedTypes={['image']}
								value={beforeId}
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
												src={beforeUrl}
												alt={beforeAlt}
												width={beforeWidth}
												height={beforeHeight}
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
										beforeId: '',
										beforeUrl: '',
										beforeAlt: '',
										beforeWidth: '',
										beforeHeight: '',
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
									value={beforeSizeSlug || DEFAULT_SIZE_SLUG}
									onChange={(val) => {
										updateImageData(
											'before',
											beforeImage,
											val
										);
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
								value={beforeAlt}
								onChange={(val) =>
									setAttributes({ beforeAlt: val })
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
				<PanelBody title={__('After Image Settings', 'ghostkit')}>
					{!afterId ? (
						<MediaUpload
							onSelect={(media) => {
								updateImageData('after', media);
							}}
							allowedTypes={['image']}
							value={afterId}
							render={({ open }) => (
								<Button onClick={open} variant="primary">
									{__('Select Image', 'ghostkit')}
								</Button>
							)}
						/>
					) : null}

					{afterId ? (
						<>
							<MediaUpload
								onSelect={(media) => {
									updateImageData('after', media);
								}}
								allowedTypes={['image']}
								value={afterId}
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
												src={afterUrl}
												alt={afterAlt}
												width={afterWidth}
												height={afterHeight}
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
										afterId: '',
										afterUrl: '',
										afterAlt: '',
										afterWidth: '',
										afterHeight: '',
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
									value={afterSizeSlug || DEFAULT_SIZE_SLUG}
									onChange={(val) => {
										updateImageData(
											'after',
											afterImage,
											val
										);
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
								value={afterAlt}
								onChange={(val) =>
									setAttributes({ afterAlt: val })
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
			</InspectorControls>

			<InspectorControls group="styles">
				<PanelBody title={__('Color', 'ghostkit')}>
					<ColorPicker
						label={__('Divider', 'ghostkit')}
						value={colorDivider}
						onChange={(val) => setAttributes({ colorDivider: val })}
						alpha
					/>
					<ColorPicker
						label={__('Divider Icon', 'ghostkit')}
						value={colorDividerIcon}
						onChange={(val) =>
							setAttributes({ colorDividerIcon: val })
						}
						alpha
					/>
				</PanelBody>
			</InspectorControls>

			{!beforeUrl || !afterUrl ? (
				<div {...blockProps}>
					<Placeholder
						className="ghostkit-image-compare-placeholder"
						icon={getIcon('block-image-compare')}
						label={__('Image Compare', 'ghostkit')}
						instructions={__(
							'Select images to compare',
							'ghostkit'
						)}
					>
						{getImgTag('before') ? (
							<div className="components-placeholder">
								{getImgTag('before')}
							</div>
						) : (
							<MediaPlaceholder
								icon="format-image"
								labels={{
									title: __('Image Before', 'ghostkit'),
									name: __('image', 'ghostkit'),
								}}
								onSelect={(image) => {
									updateImageData('before', image);
								}}
								accept="image/*"
								allowedTypes={ALLOWED_MEDIA_TYPES}
								disableMaxUploadErrorMessages
								onError={onUploadError}
							/>
						)}
						{getImgTag('after') ? (
							<div className="components-placeholder">
								{getImgTag('after')}
							</div>
						) : (
							<MediaPlaceholder
								icon="format-image"
								labels={{
									title: __('Image After', 'ghostkit'),
									name: __('image', 'ghostkit'),
								}}
								value={
									afterUrl
										? {
												src: afterUrl,
											}
										: false
								}
								onSelect={(image) => {
									updateImageData('after', image);
								}}
								accept="image/*"
								allowedTypes={ALLOWED_MEDIA_TYPES}
								disableMaxUploadErrorMessages
								onError={onUploadError}
							/>
						)}
					</Placeholder>
				</div>
			) : (
				<figure {...blockProps}>
					<div className="ghostkit-image-compare-images">
						<div className="ghostkit-image-compare-image-before">
							{getImgTag('before')}
							{showLabels &&
							(!RichText.isEmpty(labelBeforeText) ||
								isSelected) ? (
								<div className="ghostkit-image-compare-image-label ghostkit-image-compare-image-before-label">
									<RichText
										inlineToolbar
										tagName="div"
										onChange={(val) =>
											setAttributes({
												labelBeforeText: val,
											})
										}
										value={labelBeforeText}
										placeholder={__(
											'Before label…',
											'ghostkit'
										)}
									/>
								</div>
							) : null}
						</div>
						<div className="ghostkit-image-compare-image-after">
							{getImgTag('after')}
							{showLabels &&
							(!RichText.isEmpty(labelAfterText) ||
								isSelected) ? (
								<div className="ghostkit-image-compare-image-label ghostkit-image-compare-image-after-label">
									<RichText
										inlineToolbar
										tagName="div"
										onChange={(val) =>
											setAttributes({
												labelAfterText: val,
											})
										}
										value={labelAfterText}
										placeholder={__(
											'After label…',
											'ghostkit'
										)}
									/>
								</div>
							) : null}
						</div>
						<div className="ghostkit-image-compare-images-divider">
							<div className="ghostkit-image-compare-images-divider-button-arrow-left">
								<svg
									className="ghostkit-svg-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M14.7803 17.7803C14.4874 18.0732 14.0126 18.0732 13.7197 17.7803L8.4697 12.5303C8.1768 12.2374 8.1768 11.7626 8.4697 11.4697L13.7197 6.21967C14.0126 5.92678 14.4874 5.92678 14.7803 6.21967C15.0732 6.51256 15.0732 6.98744 14.7803 7.28033L10.0607 12L14.7803 16.7197C15.0732 17.0126 15.0732 17.4874 14.7803 17.7803Z"
										fill="currentColor"
									/>
								</svg>
							</div>
							<div className="ghostkit-image-compare-images-divider-button-arrow-right">
								<svg
									className="ghostkit-svg-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9.21967 6.2197C9.51256 5.9268 9.98744 5.9268 10.2803 6.2197L15.5303 11.4697C15.8232 11.7626 15.8232 12.2374 15.5303 12.5303L10.2803 17.7803C9.98744 18.0732 9.51256 18.0732 9.21967 17.7803C8.92678 17.4874 8.92678 17.0126 9.21967 16.7197L13.9393 12L9.21967 7.2803C8.92678 6.9874 8.92678 6.5126 9.21967 6.2197Z"
										fill="currentColor"
									/>
								</svg>
							</div>
						</div>
					</div>
					{(!RichText.isEmpty(caption) || isSelected) && (
						<RichText
							inlineToolbar
							className="ghostkit-image-compare-caption"
							onChange={(value) =>
								setAttributes({ caption: value })
							}
							placeholder={__('Write caption…', 'jetpack')}
							tagName="figcaption"
							value={caption}
						/>
					)}
				</figure>
			)}
		</>
	);
}
