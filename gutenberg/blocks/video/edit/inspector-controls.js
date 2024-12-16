/* eslint-disable no-mixed-spaces-and-tabs */

import {
	BlockAlignmentToolbar,
	InspectorControls,
	MediaUpload,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	ExternalLink,
	PanelBody,
	SelectControl,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import ApplyFilters from '../../../components/apply-filters';
import ButtonClearMedia from '../../../components/button-clear-media';
import ColorPicker from '../../../components/color-picker';
import IconPicker from '../../../components/icon-picker';
import MediaSizeSelector from '../../../components/media-size-selector';
import RangeControl from '../../../components/range-control';
import ToggleGroup from '../../../components/toggle-group';
import {
	addClass,
	hasClass,
	removeClass,
} from '../../../utils/classes-replacer';

const DEFAULT_SIZE_SLUG = 'full';

export default function BlockInspectorControls(props) {
	const { attributes, setAttributes, isSelected } = props;

	const {
		type,
		video,
		videoMp4,
		videoOgv,
		videoWebm,
		videoAspectRatio,
		videoVolume,
		videoAutoplay,
		videoAutopause,
		videoLoop,
		videoBackgroundColor,

		iconPlay,
		iconLoading,

		posterId,
		posterUrl,
		posterAlt,
		posterWidth,
		posterHeight,
		posterSizeSlug,

		clickAction,
		fullscreenBackgroundColor,
		fullscreenActionCloseIcon,

		className,
	} = attributes;

	const { editorSettings, posterImage } = useSelect((select) => {
		const { getSettings } = select('core/block-editor');
		const { getMedia } = select('core');

		return {
			editorSettings: getSettings(),
			posterImage: posterId && isSelected ? getMedia(posterId) : null,
		};
	});

	function onPosterSelect(imageData, imageSize = false) {
		imageSize = imageSize || posterSizeSlug || DEFAULT_SIZE_SLUG;

		const result = {
			posterId: imageData.id,
			posterUrl: imageData.url || imageData.source_url,
			posterAlt: imageData.alt || imageData.alt_text,
			posterWidth:
				imageData.width ||
				(imageData.media_details && imageData.media_details.width
					? imageData.media_details.width
					: undefined),
			posterHeight:
				imageData.height ||
				(imageData.media_details && imageData.media_details.height
					? imageData.media_details.height
					: undefined),
			posterSizeSlug: imageSize,
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
				result.posterUrl = sizes.url;
			}
			if (sizes.source_url) {
				result.posterUrl = sizes.source_url;
			}
			if (sizes.width) {
				result.posterWidth = sizes.width;
			}
			if (sizes.height) {
				result.posterHeight = sizes.height;
			}
		}

		setAttributes(result);
	}

	let styleIconOnlyAlign = 'center';
	if (hasClass(className, 'ghostkit-video-style-icon-only-align-left')) {
		styleIconOnlyAlign = 'left';
	} else if (
		hasClass(className, 'ghostkit-video-style-icon-only-align-right')
	) {
		styleIconOnlyAlign = 'right';
	}

	const onSelectVideo = (media, nameAttributes) => {
		setAttributes({
			[nameAttributes[0]]: '',
			[nameAttributes[1]]: '',
		});
		wp.media
			.attachment(media.id)
			.fetch()
			.then(({ url, id }) => {
				setAttributes({
					[nameAttributes[0]]: url,
					[nameAttributes[1]]: id,
				});
			});
	};

	return (
		<InspectorControls>
			<PanelBody>
				<ToggleGroup
					value={type}
					options={[
						{
							label: __('YouTube / Vimeo', 'ghostkit'),
							value: 'yt_vm_video',
						},
						{
							label: __('Self Hosted', 'ghostkit'),
							value: 'video',
						},
					]}
					onChange={(value) => setAttributes({ type: value })}
					isBlock
				/>
				{type === 'yt_vm_video' && (
					<TextControl
						label={__('Video URL', 'ghostkit')}
						type="url"
						value={video}
						onChange={(value) => setAttributes({ video: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				)}

				{/* Select Videos */}
				{type === 'video' && (
					<BaseControl
						id={__('Select Video', 'ghostkit')}
						label={__('Select Video', 'ghostkit')}
						__nextHasNoMarginBottom
					>
						<div style={{ display: 'flex', gap: '10px' }}>
							{!videoMp4 && (
								<MediaUpload
									onSelect={(media) => {
										onSelectVideo(media, [
											'videoMp4',
											'videoMp4Id',
										]);
									}}
									allowedTypes={['video/mp4', 'video/m4v']}
									value={videoMp4}
									render={({ open }) => (
										<Button
											onClick={open}
											variant="primary"
										>
											{__('MP4', 'ghostkit')}
										</Button>
									)}
								/>
							)}
							{!videoOgv && (
								<MediaUpload
									onSelect={(media) => {
										onSelectVideo(media, [
											'videoOgv',
											'videoOgvId',
										]);
									}}
									allowedTypes={['video/ogg', 'video/ogv']}
									value={videoOgv}
									render={({ open }) => (
										<Button
											onClick={open}
											variant="primary"
										>
											{__('OGV', 'ghostkit')}
										</Button>
									)}
								/>
							)}
							{!videoWebm && (
								<MediaUpload
									onSelect={(media) => {
										onSelectVideo(media, [
											'videoWebm',
											'videoWebmId',
										]);
									}}
									allowedTypes={['video/webm']}
									value={videoWebm}
									render={({ open }) => (
										<Button
											onClick={open}
											variant="primary"
										>
											{__('WEBM', 'ghostkit')}
										</Button>
									)}
								/>
							)}
						</div>
					</BaseControl>
				)}

				{/* Preview Video */}
				{type === 'video' && (videoMp4 || videoOgv || videoWebm) ? (
					<BaseControl
						id={__('Preview', 'ghostkit')}
						label={__('Preview', 'ghostkit')}
						__nextHasNoMarginBottom
					>
						{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
						<video
							controls
							style={{
								aspectRatio: '16/9',
								backgroundColor: videoBackgroundColor,
							}}
						>
							{videoMp4 ? (
								<source src={videoMp4} type="video/mp4" />
							) : null}
							{videoOgv ? (
								<source src={videoOgv} type="video/ogg" />
							) : null}
							{videoWebm ? (
								<source src={videoWebm} type="video/webm" />
							) : null}
						</video>
						<span>
							{videoMp4?.substring(videoMp4.lastIndexOf('/') + 1)}
							{videoOgv?.substring(videoOgv.lastIndexOf('/') + 1)}
							{videoWebm?.substring(
								videoWebm.lastIndexOf('/') + 1
							)}
						</span>
						<ButtonClearMedia
							nameAttributes={[
								'videoWebm',
								'videoWebmId',
								'videoOgv',
								'videoOgvId',
								'videoMp4',
								'videoMp4Id',
							]}
							setAttributes={setAttributes}
						/>
						<div style={{ marginBottom: '-8px' }} />
					</BaseControl>
				) : null}
			</PanelBody>
			<PanelBody title={__('Settings', 'ghostkit')}>
				{/* Aspect ratio. */}
				<MediaSizeSelector
					attributes={{
						aspectRatio: videoAspectRatio,
					}}
					hasOriginalOption={false}
					hasSizeSelectors={false}
					onChangeAspectRatio={(val) =>
						setAttributes({ videoAspectRatio: val })
					}
				/>

				{/* Volume. */}
				<RangeControl
					label={__('Volume', 'ghostkit')}
					value={videoVolume}
					min={0}
					max={100}
					onChange={(val) => setAttributes({ videoVolume: val })}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>

				{/* Icon settings. */}
				<IconPicker
					label={__('Play Icon', 'ghostkit')}
					value={iconPlay}
					onChange={(val) => setAttributes({ iconPlay: val })}
					insideInspector
				/>
				<IconPicker
					label={__('Loading Icon', 'ghostkit')}
					value={iconLoading}
					onChange={(val) => setAttributes({ iconLoading: val })}
					insideInspector
				/>
				{hasClass(className, 'is-style-icon-only') ? (
					<BaseControl
						id={__('Icon Align', 'ghostkit')}
						label={__('Icon Align', 'ghostkit')}
						__nextHasNoMarginBottom
					>
						<div>
							<BlockAlignmentToolbar
								value={styleIconOnlyAlign}
								onChange={(value) => {
									let newClassName = className;

									newClassName = removeClass(
										newClassName,
										'ghostkit-video-style-icon-only-align-right'
									);
									newClassName = removeClass(
										newClassName,
										'ghostkit-video-style-icon-only-align-left'
									);

									if (value === 'left' || value === 'right') {
										newClassName = addClass(
											newClassName,
											`ghostkit-video-style-icon-only-align-${value}`
										);
									}

									if (className !== newClassName) {
										setAttributes({
											className: newClassName,
										});
									}
								}}
								controls={['left', 'center', 'right']}
								isCollapsed={false}
							/>
						</div>
					</BaseControl>
				) : null}
			</PanelBody>
			<PanelBody title={__('Click Action', 'ghostkit')}>
				<ToggleGroup
					value={clickAction}
					options={[
						{
							label: __('Plain', 'ghostkit'),
							value: 'plain',
							disabled: hasClass(className, 'is-style-icon-only'),
						},
						{
							label: __('Fullscreen', 'ghostkit'),
							value: 'fullscreen',
						},
					]}
					onChange={(value) => setAttributes({ clickAction: value })}
					isBlock
				/>
				{clickAction === 'fullscreen' ? (
					<>
						<ApplyFilters
							name="ghostkit.editor.controls"
							attribute="fullscreenBackgroundColor"
							props={props}
						>
							<ColorPicker
								label={__('Fullscreen Background', 'ghostkit')}
								value={fullscreenBackgroundColor}
								onChange={(val) =>
									setAttributes({
										fullscreenBackgroundColor: val,
									})
								}
								alpha
							/>
						</ApplyFilters>
						<IconPicker
							label={__('Fullscreen Close Icon', 'ghostkit')}
							value={fullscreenActionCloseIcon}
							onChange={(value) =>
								setAttributes({
									fullscreenActionCloseIcon: value,
								})
							}
							insideInspector
						/>
					</>
				) : (
					<>
						<ToggleControl
							label={__('Autoplay', 'ghostkit')}
							help={__(
								'Automatically play video when block reaches the viewport. The video will be play muted due to browser Autoplay policy.',
								'ghostkit'
							)}
							checked={!!videoAutoplay}
							onChange={(value) =>
								setAttributes({ videoAutoplay: value })
							}
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={__('Autopause', 'ghostkit')}
							help={__(
								'Automatically pause video when block out of the viewport.',
								'ghostkit'
							)}
							checked={!!videoAutopause}
							onChange={(value) =>
								setAttributes({ videoAutopause: value })
							}
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={__('Loop', 'ghostkit')}
							checked={!!videoLoop}
							onChange={(value) =>
								setAttributes({ videoLoop: value })
							}
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>

			{!hasClass(className, 'is-style-icon-only') ? (
				<PanelBody title={__('Poster Image', 'ghostkit')}>
					{!posterId ? (
						<MediaUpload
							onSelect={(media) => {
								onPosterSelect(media);
							}}
							allowedTypes={['image']}
							value={posterId}
							render={({ open }) => (
								<Button onClick={open} variant="primary">
									{__('Select Image', 'ghostkit')}
								</Button>
							)}
						/>
					) : null}

					{posterId ? (
						<>
							<MediaUpload
								onSelect={(media) => {
									onPosterSelect(media);
								}}
								allowedTypes={['image']}
								value={posterId}
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
												src={posterUrl}
												alt={posterAlt}
												width={posterWidth}
												height={posterHeight}
											/>
										</a>
									</BaseControl>
								)}
							/>
							<TextareaControl
								label={__('Alt text (alternative text)')}
								value={posterAlt}
								onChange={(val) =>
									setAttributes({ posterAlt: val })
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
							{editorSettings?.imageSizes ? (
								<SelectControl
									label={__('Resolution', 'ghostkit')}
									help={__(
										'Select the size of the source image.',
										'ghostkit'
									)}
									value={posterSizeSlug || DEFAULT_SIZE_SLUG}
									onChange={(val) => {
										onPosterSelect(posterImage, val);
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
							<div style={{ marginTop: '-10px' }} />
							<ButtonClearMedia
								nameAttributes={[
									'posterId',
									'posterUrl',
									'posterAlt',
									'posterWidth',
									'posterHeight',
								]}
								setAttributes={setAttributes}
							/>
						</>
					) : null}
				</PanelBody>
			) : null}
		</InspectorControls>
	);
}
