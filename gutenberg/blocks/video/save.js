import { useBlockProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import IconPicker from '../../components/icon-picker';
import { hasClass } from '../../utils/classes-replacer';
import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { attributes } = props;

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

		iconPlay,
		iconLoading,

		posterId,
		posterUrl,
		posterAlt,
		posterWidth,
		posterHeight,

		clickAction,
		fullscreenActionCloseIcon,
		fullscreenVideoBackgroundColor,
		fullscreenVideoBackgroundGradient,
		fullscreenBackgroundColor,
		fullscreenBackgroundGradient,

		className,
	} = attributes;

	const resultAttrs = {};

	resultAttrs.className = 'ghostkit-video';
	resultAttrs.className = applyFilters(
		'ghostkit.blocks.className',
		resultAttrs.className,
		{
			name,
			...props,
		}
	);

	resultAttrs['data-video-type'] = type;

	resultAttrs['data-video'] = '';
	if (type === 'video') {
		if (videoMp4) {
			resultAttrs['data-video'] += `mp4:${videoMp4}`;
		}
		if (videoOgv) {
			resultAttrs['data-video'] += `${
				resultAttrs['data-video'].length ? ',' : ''
			}ogv:${videoOgv}`;
		}
		if (videoWebm) {
			resultAttrs['data-video'] += `${
				resultAttrs['data-video'].length ? ',' : ''
			}webm:${videoWebm}`;
		}
	} else {
		resultAttrs['data-video'] = video;
	}

	resultAttrs['data-video-aspect-ratio'] = videoAspectRatio;
	resultAttrs['data-video-volume'] = videoVolume;
	resultAttrs['data-click-action'] = clickAction;

	if (clickAction === 'fullscreen') {
		resultAttrs['data-fullscreen-video-background-color'] =
			fullscreenVideoBackgroundColor;
		resultAttrs['data-fullscreen-video-background-gradient'] =
			fullscreenVideoBackgroundGradient;
		resultAttrs['data-fullscreen-background-color'] =
			fullscreenBackgroundColor;
		resultAttrs['data-fullscreen-background-gradient'] =
			fullscreenBackgroundGradient;
	} else {
		if (videoAutoplay) {
			resultAttrs['data-video-autoplay'] = 'true';
		}
		if (videoAutopause) {
			resultAttrs['data-video-autopause'] = 'true';
		}
		if (videoLoop) {
			resultAttrs['data-video-loop'] = 'true';
		}
	}

	const blockProps = useBlockProps.save(resultAttrs);

	return (
		<div {...blockProps}>
			{posterUrl && !hasClass(className, 'is-style-icon-only') ? (
				<div className="ghostkit-video-poster">
					<img
						src={posterUrl}
						alt={posterAlt}
						className={posterId ? `wp-image-${posterId}` : null}
						width={posterWidth}
						height={posterHeight}
					/>
				</div>
			) : null}
			{iconPlay ? (
				<IconPicker.Render
					name={iconPlay}
					tag="div"
					className="ghostkit-video-play-icon"
				/>
			) : null}
			{iconLoading ? (
				<IconPicker.Render
					name={iconLoading}
					tag="div"
					className="ghostkit-video-loading-icon"
				/>
			) : null}
			{clickAction === 'fullscreen' && fullscreenActionCloseIcon ? (
				<IconPicker.Render
					name={fullscreenActionCloseIcon}
					tag="div"
					className="ghostkit-video-fullscreen-close-icon"
				/>
			) : null}
		</div>
	);
}
