import { useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

import IconPicker from '../../components/icon-picker';
import { hasClass, removeClass } from '../../utils/classes-replacer';
import BackgroundColor from './edit/background-color';
import BlockInspectorControls from './edit/inspector-controls';

/**
 * Load YouTube / Vimeo poster image
 */
const videoPosterCache = {};
let videoPosterTimeout;
function getVideoPoster(url, cb) {
	if (videoPosterCache[url]) {
		cb(videoPosterCache[url]);
		return;
	}

	if (typeof window.VideoWorker === 'undefined') {
		cb('');
		return;
	}

	clearTimeout(videoPosterTimeout);
	videoPosterTimeout = setTimeout(() => {
		const videoObject = new window.VideoWorker(url);

		if (videoObject.isValid()) {
			videoObject.getImageURL((videoPosterUrl) => {
				videoPosterCache[url] = videoPosterUrl;
				cb(videoPosterUrl);
			});
		} else {
			cb('');
		}
	}, 500);
}

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, isSelected, clientId } = props;

	const {
		type,
		video,
		videoPosterPreview,
		videoAspectRatio,

		iconPlay,

		posterId,
		posterUrl,
		posterAlt,
		posterWidth,
		posterHeight,

		clickAction,

		className,
	} = attributes;

	// Mount and update.
	useEffect(() => {
		// load YouTube / Vimeo poster
		if (!posterId && type === 'yt_vm_video' && video) {
			getVideoPoster(video, (url) => {
				if (url !== videoPosterPreview) {
					setAttributes({ videoPosterPreview: url });
				}
			});
		}
	});

	useEffect(() => {
		// Change click action to Fullscreen when used Icon Only style.
		if (
			clickAction === 'plain' &&
			className &&
			hasClass(className, 'is-style-icon-only')
		) {
			setAttributes({ clickAction: 'fullscreen' });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clickAction, className]);

	useEffect(() => {
		// Remove unused classes.
		if (className && !hasClass(className, 'is-style-icon-only')) {
			let newClassName = className;

			newClassName = removeClass(
				newClassName,
				'ghostkit-video-style-icon-only-align-right'
			);
			newClassName = removeClass(
				newClassName,
				'ghostkit-video-style-icon-only-align-left'
			);

			if (className !== newClassName) {
				setAttributes({ className: newClassName });
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [className]);

	const blockProps = useBlockProps({
		className: applyFilters(
			'ghostkit.editor.className',
			'ghostkit-video',
			props
		),
		'data-video-aspect-ratio': videoAspectRatio,
	});

	return (
		<>
			<BackgroundColor
				attributes={attributes}
				setAttributes={setAttributes}
				clientId={clientId}
			/>
			<BlockInspectorControls
				attributes={attributes}
				setAttributes={setAttributes}
				isSelected={isSelected}
			/>

			<div {...blockProps}>
				{posterUrl && !hasClass(className, 'is-style-icon-only') ? (
					<div className="ghostkit-video-poster">
						<img
							src={posterUrl}
							alt={posterAlt}
							width={posterWidth}
							height={posterHeight}
						/>
					</div>
				) : null}
				{!posterUrl &&
				type === 'yt_vm_video' &&
				videoPosterPreview &&
				!hasClass(className, 'is-style-icon-only') ? (
					<div className="ghostkit-video-poster">
						<img src={videoPosterPreview} alt="" />
					</div>
				) : null}
				{iconPlay ? (
					<div className="ghostkit-video-play-icon">
						<IconPicker.Dropdown
							onChange={(value) =>
								setAttributes({ iconPlay: value })
							}
							value={iconPlay}
							renderToggle={({ onToggle }) => (
								<IconPicker.Preview
									onClick={onToggle}
									name={iconPlay}
								/>
							)}
						/>
					</div>
				) : null}
			</div>
		</>
	);
}
