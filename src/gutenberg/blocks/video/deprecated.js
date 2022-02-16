/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';
import { hasClass } from '../../utils/classes-replacer';

import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { applyFilters } = wp.hooks;

export default [
  // v2.20.3
  {
    ...metadata,
    isEligible(attributes) {
      return attributes.posterTag || attributes.poster;
    },
    migrate(attributes) {
      const newAttributes = {
        ...attributes,
      };

      if ('undefined' !== typeof attributes.poster) {
        newAttributes.posterId = attributes.poster;
      }
      if ('undefined' !== typeof attributes.posterSize) {
        newAttributes.posterSizeSlug = attributes.posterSize;
      }
      if ('undefined' !== typeof attributes.posterTag && attributes.posterTag) {
        const imgSrc = attributes.posterTag.match(/<img.+src=(?:"|')(.+?)(?:"|')(?:.+?)>/);
        const imgAlt = attributes.posterTag.match(/<img.+alt=(?:"|')(.+?)(?:"|')(?:.+?)>/);
        const imgWidth = attributes.posterTag.match(/<img.+width=(?:"|')(.+?)(?:"|')(?:.+?)>/);
        const imgHeight = attributes.posterTag.match(/<img.+height=(?:"|')(.+?)(?:"|')(?:.+?)>/);

        if (imgSrc && imgSrc[1]) {
          // eslint-disable-next-line prefer-destructuring
          newAttributes.posterUrl = imgSrc[1];
        }
        if (imgAlt && imgAlt[1]) {
          // eslint-disable-next-line prefer-destructuring
          newAttributes.posterAlt = imgAlt[1];
        }
        if (imgWidth && imgWidth[1]) {
          // eslint-disable-next-line prefer-destructuring
          newAttributes.posterWidth = parseInt(imgWidth[1], 10);
        }
        if (imgHeight && imgHeight[1]) {
          // eslint-disable-next-line prefer-destructuring
          newAttributes.posterHeight = parseInt(imgHeight[1], 10);
        }
      }

      delete newAttributes.poster;
      delete newAttributes.posterTag;
      delete newAttributes.posterSize;
      delete newAttributes.posterSizes;

      return [newAttributes, []];
    },
    attributes: {
      type: {
        type: 'string',
        default: 'yt_vm_video',
      },
      video: {
        type: 'string',
        default: '',
      },
      videoPosterPreview: {
        type: 'string',
        default: '',
      },
      videoMp4: {
        type: 'string',
        default: '',
      },
      videoMp4Id: {
        type: 'number',
      },
      videoOgv: {
        type: 'string',
        default: '',
      },
      videoOgvId: {
        type: 'number',
      },
      videoWebm: {
        type: 'string',
        default: '',
      },
      videoWebmId: {
        type: 'number',
      },
      videoAspectRatio: {
        type: 'string',
        default: '16:9',
      },
      videoVolume: {
        type: 'number',
        default: 100,
      },
      videoAutoplay: {
        type: 'boolean',
        default: false,
      },
      videoAutopause: {
        type: 'boolean',
        default: false,
      },
      videoLoop: {
        type: 'boolean',
        default: false,
      },

      iconPlay: {
        type: 'string',
        default:
          '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.83167C5 4.0405 5.87525 3.56266 6.54076 3.99049L17.6915 11.1588C18.3038 11.5525 18.3038 12.4475 17.6915 12.8412L6.54076 20.0095C5.87525 20.4373 5 19.9595 5 19.1683V4.83167Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      },
      iconLoading: {
        type: 'string',
        default: '<span class="ghostkit-svg-icon ghostkit-icon-spinner"></span>',
      },

      poster: {
        type: 'number',
        default: '',
      },
      posterTag: {
        type: 'string',
        default: '',
      },
      posterSizes: {
        type: 'object',
        default: '',
      },
      posterSize: {
        type: 'string',
        default: 'full',
      },

      clickAction: {
        type: 'string',
        default: 'plain',
      },
      fullscreenBackgroundColor: {
        type: 'string',
      },
      fullscreenActionCloseIcon: {
        type: 'string',
        default:
          '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L12 10.9393L16.7197 6.21967C17.0126 5.92678 17.4874 5.92678 17.7803 6.21967C18.0732 6.51256 18.0732 6.98744 17.7803 7.28033L13.0607 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4874 18.0732 17.0126 18.0732 16.7197 17.7803L12 13.0607L7.28033 17.7803C6.98744 18.0732 6.51256 18.0732 6.21967 17.7803C5.92678 17.4874 5.92678 17.0126 6.21967 16.7197L10.9393 12L6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967Z" fill="currentColor"/></svg>',
      },
    },
    save: class BlockSave extends Component {
      render() {
        const { attributes } = this.props;

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

          posterTag,

          clickAction,
          fullscreenActionCloseIcon,
          fullscreenBackgroundColor,
        } = attributes;

        const resultAttrs = {};

        resultAttrs.className = 'ghostkit-video';

        resultAttrs.className = applyFilters('ghostkit.blocks.className', resultAttrs.className, {
          ...{
            name: metadata.name,
          },
          ...this.props,
        });

        resultAttrs['data-video-type'] = type;

        resultAttrs['data-video'] = '';
        if ('video' === type) {
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

        if ('fullscreen' === clickAction) {
          resultAttrs['data-fullscreen-background-color'] = fullscreenBackgroundColor;
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

        return (
          <div {...resultAttrs}>
            {posterTag && !hasClass(resultAttrs.className, 'is-style-icon-only') ? (
              <div
                className="ghostkit-video-poster"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: posterTag,
                }}
              />
            ) : (
              ''
            )}
            {iconPlay ? (
              <IconPicker.Render name={iconPlay} tag="div" className="ghostkit-video-play-icon" />
            ) : (
              ''
            )}
            {iconLoading ? (
              <IconPicker.Render
                name={iconLoading}
                tag="div"
                className="ghostkit-video-loading-icon"
              />
            ) : (
              ''
            )}
            {'fullscreen' === clickAction && fullscreenActionCloseIcon ? (
              <IconPicker.Render
                name={fullscreenActionCloseIcon}
                tag="div"
                className="ghostkit-video-fullscreen-close-icon"
              />
            ) : (
              ''
            )}
          </div>
        );
      }
    },
  },
];
