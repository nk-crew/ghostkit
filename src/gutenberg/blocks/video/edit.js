/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import ApplyFilters from '../../components/apply-filters';
import ImagePicker from '../../components/image-picker';
import ToggleGroup from '../../components/toggle-group';
import RangeControl from '../../components/range-control';
import getIcon from '../../utils/get-icon';
import { hasClass, addClass, removeClass } from '../../utils/classes-replacer';

import ImgAspectRatio32 from './aspect-ratio/aspect-ratio-3-2.png';
import ImgAspectRatio43 from './aspect-ratio/aspect-ratio-4-3.png';
import ImgAspectRatio169 from './aspect-ratio/aspect-ratio-16-9.png';
import ImgAspectRatio219 from './aspect-ratio/aspect-ratio-21-9.png';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Fragment, useEffect } = wp.element;

const {
  BaseControl,
  PanelBody,
  SelectControl,
  Button,
  ToggleControl,
  TextControl,
  TextareaControl,
  ExternalLink,
  ToolbarGroup,
  ToolbarButton,
  Dropdown,
} = wp.components;

const { useSelect } = wp.data;

const { InspectorControls, BlockControls, MediaUpload, BlockAlignmentToolbar, useBlockProps } =
  wp.blockEditor;

const DEFAULT_SIZE_SLUG = 'full';

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
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected } = props;

  let { className = '' } = props;

  const {
    type,
    video,
    videoPosterPreview,
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
    posterSizeSlug,

    clickAction,
    fullscreenBackgroundColor,
    fullscreenActionCloseIcon,
  } = attributes;

  const { editorSettings, posterImage } = useSelect((select) => {
    const { getSettings } = select('core/block-editor');
    const { getMedia } = select('core');

    return {
      editorSettings: getSettings(),
      posterImage: posterId && isSelected ? getMedia(posterId) : null,
    };
  });

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
    if (clickAction === 'plain' && className && hasClass(className, 'is-style-icon-only')) {
      setAttributes({ clickAction: 'fullscreen' });
    }
  }, [clickAction, className]);

  useEffect(() => {
    // Remove unused classes.
    if (className && !hasClass(className, 'is-style-icon-only')) {
      let newClassName = className;

      newClassName = removeClass(newClassName, 'ghostkit-video-style-icon-only-align-right');
      newClassName = removeClass(newClassName, 'ghostkit-video-style-icon-only-align-left');

      if (className !== newClassName) {
        setAttributes({ className: newClassName });
      }
    }
  }, [className]);

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

  function getAspectRatioPicker() {
    return (
      <ImagePicker
        label={__('Aspect Ratio', '@@text_domain')}
        value={videoAspectRatio}
        options={[
          {
            value: '16:9',
            label: __('Wide', '@@text_domain'),
            image: ImgAspectRatio169,
          },
          {
            value: '21:9',
            label: __('Ultra Wide', '@@text_domain'),
            image: ImgAspectRatio219,
          },
          {
            value: '4:3',
            label: __('TV', '@@text_domain'),
            image: ImgAspectRatio43,
          },
          {
            value: '3:2',
            label: __('Classic Film', '@@text_domain'),
            image: ImgAspectRatio32,
          },
        ]}
        onChange={(value) => setAttributes({ videoAspectRatio: value })}
      />
    );
  }

  className = classnames('ghostkit-video', className);

  className = applyFilters('ghostkit.editor.className', className, props);

  let styleIconOnlyAlign = 'center';
  if (hasClass(className, 'ghostkit-video-style-icon-only-align-left')) {
    styleIconOnlyAlign = 'left';
  } else if (hasClass(className, 'ghostkit-video-style-icon-only-align-right')) {
    styleIconOnlyAlign = 'right';
  }

  let toolbarAspectRatioIcon = getIcon('icon-aspect-ratio-16-9');
  if (videoAspectRatio === '3:2') {
    toolbarAspectRatioIcon = getIcon('icon-aspect-ratio-3-2');
  }
  if (videoAspectRatio === '4:3') {
    toolbarAspectRatioIcon = getIcon('icon-aspect-ratio-4-3');
  }
  if (videoAspectRatio === '21:9') {
    toolbarAspectRatioIcon = getIcon('icon-aspect-ratio-21-9');
  }

  const blockProps = useBlockProps({ className, 'data-video-aspect-ratio': videoAspectRatio });

  return (
    <div {...blockProps}>
      <BlockControls>
        <ToolbarGroup>
          <Dropdown
            renderToggle={({ onToggle }) => (
              <ToolbarButton
                label={__('Aspect Ratio', '@@text_domain')}
                icon={toolbarAspectRatioIcon}
                className="components-toolbar__control"
                onClick={onToggle}
              />
            )}
            renderContent={() => (
              <div
                style={{
                  minWidth: 260,
                }}
              >
                {getAspectRatioPicker()}
              </div>
            )}
          />
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <PanelBody>
          <ToggleGroup
            value={type}
            options={[
              {
                label: __('YouTube / Vimeo', '@@text_domain'),
                value: 'yt_vm_video',
              },
              {
                label: __('Self Hosted', '@@text_domain'),
                value: 'video',
              },
            ]}
            onChange={(value) => {
              setAttributes({ type: value });
            }}
            isBlock
          />
          {type === 'yt_vm_video' && (
            <TextControl
              label={__('Video URL', '@@text_domain')}
              type="url"
              value={video}
              onChange={(value) => setAttributes({ video: value })}
            />
          )}

          {/* Preview Video */}
          {type === 'video' && (videoMp4 || videoOgv || videoWebm) ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video controls>
              {videoMp4 ? <source src={videoMp4} type="video/mp4" /> : ''}
              {videoOgv ? <source src={videoOgv} type="video/ogg" /> : ''}
              {videoWebm ? <source src={videoWebm} type="video/webm" /> : ''}
            </video>
          ) : null}

          {/* Select Videos */}
          {type === 'video' && !videoMp4 ? (
            <MediaUpload
              onSelect={(media) => {
                setAttributes({
                  videoMp4: '',
                  videoMp4Id: '',
                });
                wp.media
                  .attachment(media.id)
                  .fetch()
                  .then((data) => {
                    setAttributes({
                      videoMp4: data.url,
                      videoMp4Id: data.id,
                    });
                  });
              }}
              allowedTypes={['video/mp4', 'video/m4v']}
              value={videoMp4}
              render={({ open }) => (
                <div style={{ marginBottom: 13 }}>
                  <Button onClick={open} isPrimary>
                    {__('Select MP4', '@@text_domain')}
                  </Button>
                </div>
              )}
            />
          ) : null}
          {type === 'video' && videoMp4 ? (
            <div>
              <span>{videoMp4.substring(videoMp4.lastIndexOf('/') + 1)} </span>
              <Button
                isLink
                onClick={(e) => {
                  setAttributes({
                    videoMp4: '',
                    videoMp4Id: '',
                  });
                  e.preventDefault();
                }}
              >
                {__('(Remove)', '@@text_domain')}
              </Button>
              <div style={{ marginBottom: 13 }} />
            </div>
          ) : null}
          {type === 'video' && !videoOgv ? (
            <MediaUpload
              onSelect={(media) => {
                setAttributes({
                  videoOgv: '',
                  videoOgvId: '',
                });
                wp.media
                  .attachment(media.id)
                  .fetch()
                  .then((data) => {
                    setAttributes({
                      videoOgv: data.url,
                      videoOgvId: data.id,
                    });
                  });
              }}
              allowedTypes={['video/ogg', 'video/ogv']}
              value={videoOgv}
              render={({ open }) => (
                <div style={{ marginBottom: 13 }}>
                  <Button onClick={open} isPrimary>
                    {__('Select OGV', '@@text_domain')}
                  </Button>
                </div>
              )}
            />
          ) : null}
          {type === 'video' && videoOgv ? (
            <div>
              <span>{videoOgv.substring(videoOgv.lastIndexOf('/') + 1)} </span>
              <Button
                isLink
                onClick={(e) => {
                  setAttributes({
                    videoOgv: '',
                    videoOgvId: '',
                  });
                  e.preventDefault();
                }}
              >
                {__('(Remove)', '@@text_domain')}
              </Button>
              <div style={{ marginBottom: 13 }} />
            </div>
          ) : null}
          {type === 'video' && !videoWebm ? (
            <MediaUpload
              onSelect={(media) => {
                setAttributes({
                  videoWebm: '',
                  videoWebmId: '',
                });
                wp.media
                  .attachment(media.id)
                  .fetch()
                  .then((data) => {
                    setAttributes({
                      videoWebm: data.url,
                      videoWebmId: data.id,
                    });
                  });
              }}
              allowedTypes={['video/webm']}
              value={videoWebm}
              render={({ open }) => (
                <div style={{ marginBottom: 13 }}>
                  <Button onClick={open} isPrimary>
                    {__('Select WEBM', '@@text_domain')}
                  </Button>
                </div>
              )}
            />
          ) : null}
          {type === 'video' && videoWebm ? (
            <div>
              <span>{videoWebm.substring(videoWebm.lastIndexOf('/') + 1)} </span>
              <Button
                isLink
                onClick={(e) => {
                  setAttributes({
                    videoWebm: '',
                    videoWebmId: '',
                  });
                  e.preventDefault();
                }}
              >
                {__('(Remove)', '@@text_domain')}
              </Button>
              <div style={{ marginBottom: 13 }} />
            </div>
          ) : null}
        </PanelBody>
        <PanelBody>{getAspectRatioPicker()}</PanelBody>
        <PanelBody>
          <RangeControl
            label={__('Volume', '@@text_domain')}
            value={videoVolume}
            min={0}
            max={100}
            onChange={(v) => setAttributes({ videoVolume: v })}
          />
        </PanelBody>
        <PanelBody>
          <IconPicker
            label={__('Play Icon', '@@text_domain')}
            value={iconPlay}
            onChange={(value) => setAttributes({ iconPlay: value })}
            insideInspector
          />
          <IconPicker
            label={__('Loading Icon', '@@text_domain')}
            value={iconLoading}
            onChange={(value) => setAttributes({ iconLoading: value })}
            insideInspector
          />
          {hasClass(className, 'is-style-icon-only') ? (
            <BaseControl label={__('Icon Align', '@@text_domain')}>
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
                      setAttributes({ className: newClassName });
                    }
                  }}
                  controls={['left', 'center', 'right']}
                  isCollapsed={false}
                />
              </div>
            </BaseControl>
          ) : null}
        </PanelBody>
        <PanelBody>
          <ToggleGroup
            label={__('Click Action', '@@text_domain')}
            value={clickAction}
            options={[
              {
                label: __('Plain', '@@text_domain'),
                value: 'plain',
                disabled: hasClass(className, 'is-style-icon-only'),
              },
              {
                label: __('Fullscreen', '@@text_domain'),
                value: 'fullscreen',
              },
            ]}
            onChange={(value) => {
              setAttributes({ clickAction: value });
            }}
            isAdaptiveWidth
          />
          {clickAction === 'fullscreen' ? (
            <Fragment>
              <ApplyFilters
                name="ghostkit.editor.controls"
                attribute="fullscreenBackgroundColor"
                props={props}
              >
                <ColorPicker
                  label={__('Fullscreen Background', '@@text_domain')}
                  value={fullscreenBackgroundColor}
                  onChange={(val) => setAttributes({ fullscreenBackgroundColor: val })}
                  alpha
                />
              </ApplyFilters>
              <IconPicker
                label={__('Fullscreen Close Icon', '@@text_domain')}
                value={fullscreenActionCloseIcon}
                onChange={(value) => setAttributes({ fullscreenActionCloseIcon: value })}
                insideInspector
              />
            </Fragment>
          ) : (
            <Fragment>
              <ToggleControl
                label={__('Autoplay', '@@text_domain')}
                help={__(
                  'Automatically play video when block reaches the viewport. The video will be play muted due to browser Autoplay policy.',
                  '@@text_domain'
                )}
                checked={!!videoAutoplay}
                onChange={(value) => setAttributes({ videoAutoplay: value })}
              />
              <ToggleControl
                label={__('Autopause', '@@text_domain')}
                help={__(
                  'Automatically pause video when block out of the viewport.',
                  '@@text_domain'
                )}
                checked={!!videoAutopause}
                onChange={(value) => setAttributes({ videoAutopause: value })}
              />
              <ToggleControl
                label={__('Loop', '@@text_domain')}
                checked={!!videoLoop}
                onChange={(value) => setAttributes({ videoLoop: value })}
              />
            </Fragment>
          )}
        </PanelBody>

        {!hasClass(className, 'is-style-icon-only') ? (
          <PanelBody title={__('Poster Image', '@@text_domain')}>
            {!posterId ? (
              <MediaUpload
                onSelect={(media) => {
                  onPosterSelect(media);
                }}
                allowedTypes={['image']}
                value={posterId}
                render={({ open }) => (
                  <Button onClick={open} isPrimary>
                    {__('Select Image', '@@text_domain')}
                  </Button>
                )}
              />
            ) : null}

            {posterId ? (
              <Fragment>
                <MediaUpload
                  onSelect={(media) => {
                    onPosterSelect(media);
                  }}
                  allowedTypes={['image']}
                  value={posterId}
                  render={({ open }) => (
                    <BaseControl help={__('Click the image to edit or update', '@@text_domain')}>
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
                <div style={{ marginTop: -20 }} />
                <Button
                  isLink
                  onClick={(e) => {
                    setAttributes({
                      posterId: '',
                      posterUrl: '',
                      posterAlt: '',
                      posterWidth: '',
                      posterHeight: '',
                    });
                    e.preventDefault();
                  }}
                  className="button button-secondary"
                >
                  {__('Remove Image', '@@text_domain')}
                </Button>
                <div style={{ marginBottom: 13 }} />
                {editorSettings && editorSettings.imageSizes ? (
                  <SelectControl
                    label={__('Resolution', '@@text_domain')}
                    help={__('Select the size of the source image.', '@@text_domain')}
                    value={posterSizeSlug || DEFAULT_SIZE_SLUG}
                    onChange={(val) => {
                      onPosterSelect(posterImage, val);
                    }}
                    options={editorSettings.imageSizes.map((imgSize) => ({
                      value: imgSize.slug,
                      label: imgSize.name,
                    }))}
                  />
                ) : null}
                <TextareaControl
                  label={__('Alt text (alternative text)')}
                  value={posterAlt}
                  onChange={(val) => setAttributes({ posterAlt: val })}
                  help={
                    <Fragment>
                      <ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
                        {__('Describe the purpose of the image', '@@text_domain')}
                      </ExternalLink>
                      {__('Leave empty if the image is purely decorative.', '@@text_domain')}
                    </Fragment>
                  }
                />
              </Fragment>
            ) : null}
          </PanelBody>
        ) : null}
      </InspectorControls>

      {posterUrl && !hasClass(className, 'is-style-icon-only') ? (
        <div className="ghostkit-video-poster">
          <img src={posterUrl} alt={posterAlt} width={posterWidth} height={posterHeight} />
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
            onChange={(value) => setAttributes({ iconPlay: value })}
            value={iconPlay}
            renderToggle={({ onToggle }) => (
              <IconPicker.Preview onClick={onToggle} name={iconPlay} />
            )}
          />
        </div>
      ) : null}
    </div>
  );
}
