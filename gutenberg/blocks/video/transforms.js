import { createBlock } from '@wordpress/blocks';

// parse youtube ID
function getYoutubeID(ytUrl) {
	const regExp =
		/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
	const match = ytUrl.match(regExp);
	return match && match[1].length === 11 ? match[1] : false;
}

// parse vimeo ID
function getVimeoID(vmUrl) {
	const regExp =
		/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
	const match = vmUrl.match(regExp);
	return match && match[3] ? match[3] : false;
}

// prepare attributes for core embed
function prepareAttributesForCoreEmbed(attributes) {
	let aspectRatio = '16-9';
	const { video, videoAspectRatio } = attributes;
	let { className } = attributes;

	if (videoAspectRatio === '21:9') {
		aspectRatio = '21-9';
	} else if (videoAspectRatio === '4:3') {
		aspectRatio = '4-3';
	} else if (videoAspectRatio === '3:2') {
		aspectRatio = '3-2';
	}

	if (aspectRatio) {
		className = `wp-embed-aspect-${aspectRatio} wp-has-aspect-ratio ${className}`;
	}

	return {
		url: video,
		className,
	};
}

export default {
	from: [
		{
			type: 'block',
			blocks: ['core-embed/youtube', 'core-embed/vimeo'],
			isMatch(attributes) {
				return (
					attributes && attributes.type && attributes.type === 'video'
				);
			},
			transform(attributes) {
				let aspectRatio = '16:9';
				const { url, className } = attributes;

				if (className && /wp-embed-aspect-21-9/.test(className)) {
					aspectRatio = '21:9';
				} else if (className && /wp-embed-aspect-4-3/.test(className)) {
					aspectRatio = '4:3';
				} else if (className && /wp-embed-aspect-3-2/.test(className)) {
					aspectRatio = '3:2';
				}

				return createBlock('ghostkit/video', {
					video: url,
					videoAspectRatio: aspectRatio,
				});
			},
		},
		{
			type: 'block',
			blocks: ['core/video'],
			isMatch(attributes) {
				return attributes && attributes.id;
			},
			transform(attributes) {
				const { id, src, muted } = attributes;

				const attrs = {
					type: 'video',
					videoVolume: muted ? 0 : 100,
				};

				if (/\.ogv$|\.ogg$/.test(src)) {
					attrs.videoOgv = src;
					attrs.videoOgvId = id;
				} else if (/\.webm$/.test(src)) {
					attrs.videoWebm = src;
					attrs.videoWebmId = id;
				} else {
					attrs.videoMp4 = src;
					attrs.videoMp4Id = id;
				}

				return createBlock('ghostkit/video', attrs);
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: ['core-embed/youtube'],
			isMatch(attributes) {
				return (
					attributes &&
					attributes.type &&
					attributes.type === 'yt_vm_video' &&
					attributes.video &&
					getYoutubeID(attributes.video)
				);
			},
			transform(attributes) {
				return createBlock(
					'core-embed/youtube',
					prepareAttributesForCoreEmbed(attributes)
				);
			},
		},
		{
			type: 'block',
			blocks: ['core-embed/vimeo'],
			isMatch(attributes) {
				return (
					attributes &&
					attributes.type &&
					attributes.type === 'yt_vm_video' &&
					attributes.video &&
					getVimeoID(attributes.video)
				);
			},
			transform(attributes) {
				return createBlock(
					'core-embed/vimeo',
					prepareAttributesForCoreEmbed(attributes)
				);
			},
		},
		{
			type: 'block',
			blocks: ['core/video'],
			isMatch(attributes) {
				return (
					attributes &&
					attributes.type &&
					attributes.type === 'video' &&
					(attributes.videoMp4Id ||
						attributes.videoOgvId ||
						attributes.videoWebmId) &&
					(attributes.videoMp4 ||
						attributes.videoOgv ||
						attributes.videoWebm)
				);
			},
			transform(attributes) {
				return createBlock('core/video', {
					id:
						attributes.videoMp4Id ||
						attributes.videoOgvId ||
						attributes.videoWebmId,
					src:
						attributes.videoMp4 ||
						attributes.videoOgv ||
						attributes.videoWebm,
					muted: attributes.videoVolume === 0,
				});
			},
		},
	],
};
