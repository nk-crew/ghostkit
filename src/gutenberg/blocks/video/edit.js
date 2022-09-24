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

const { Component, Fragment } = wp.element;

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
  Dropdown,
} = wp.components;

const { withSelect } = wp.data;

const { InspectorControls, BlockControls, MediaUpload, BlockAlignmentToolbar } = wp.blockEditor;

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

  if ('undefined' === typeof window.VideoWorker) {
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
class BlockEdit extends Component {
  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.onPosterSelect = this.onPosterSelect.bind(this);
    this.getAspectRatioPicker = this.getAspectRatioPicker.bind(this);
  }

  componentDidMount() {
    this.onUpdate();
  }

  componentDidUpdate(prevProps) {
    const { attributes, setAttributes } = this.props;

    // Change click action to Fullscreen when used Icon Only style.
    if (
      'plain' === attributes.clickAction &&
      attributes.className !== prevProps.attributes.className &&
      hasClass(attributes.className, 'is-style-icon-only')
    ) {
      setAttributes({ clickAction: 'fullscreen' });
      return;
    }

    // Remove unused classes.
    if (
      attributes.className !== prevProps.attributes.className &&
      !hasClass(attributes.className, 'is-style-icon-only')
    ) {
      let newClassName = attributes.className;

      newClassName = removeClass(newClassName, 'ghostkit-video-style-icon-only-align-right');
      newClassName = removeClass(newClassName, 'ghostkit-video-style-icon-only-align-left');

      if (attributes.className !== newClassName) {
        setAttributes({ className: newClassName });
      }
    }

    this.onUpdate();
  }

  onUpdate() {
    const { setAttributes, attributes } = this.props;

    // load YouTube / Vimeo poster
    if (!attributes.posterId && 'yt_vm_video' === attributes.type && attributes.video) {
      getVideoPoster(attributes.video, (url) => {
        if (url !== attributes.videoPosterPreview) {
          setAttributes({ videoPosterPreview: url });
        }
      });
    }
  }

  onPosterSelect(imageData, imageSize = false) {
    const { attributes, setAttributes } = this.props;

    imageSize = imageSize || attributes.posterSizeSlug || DEFAULT_SIZE_SLUG;

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

  getAspectRatioPicker() {
    const { attributes, setAttributes } = this.props;

    const { videoAspectRatio } = attributes;

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

  render() {
    const { attributes, setAttributes, editorSettings, posterImage } = this.props;

    let { className = '' } = this.props;

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

    className = classnames('ghostkit-video', className);

    className = applyFilters('ghostkit.editor.className', className, this.props);

    let styleIconOnlyAlign = 'center';
    if (hasClass(className, 'ghostkit-video-style-icon-only-align-left')) {
      styleIconOnlyAlign = 'left';
    } else if (hasClass(className, 'ghostkit-video-style-icon-only-align-right')) {
      styleIconOnlyAlign = 'right';
    }

    let toolbarAspectRatioIcon = getIcon('icon-aspect-ratio-16-9');
    if ('3:2' === videoAspectRatio) {
      toolbarAspectRatioIcon = getIcon('icon-aspect-ratio-3-2');
    }
    if ('4:3' === videoAspectRatio) {
      toolbarAspectRatioIcon = getIcon('icon-aspect-ratio-4-3');
    }
    if ('21:9' === videoAspectRatio) {
      toolbarAspectRatioIcon = getIcon('icon-aspect-ratio-21-9');
    }

    return (
      <Fragment>
        <BlockControls>
          <ToolbarGroup>
            <Dropdown
              renderToggle={({ onToggle }) => (
                <Button
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
                  {this.getAspectRatioPicker()}
                </div>
              )}
            />
          </ToolbarGroup>
          {'yt_vm_video' === type ? (
            <ToolbarGroup>
              <TextControl
                type="url"
                value={video}
                placeholder={__('YouTube / Vimeo URL', '@@text_domain')}
                onChange={(value) => setAttributes({ video: value })}
                className="ghostkit-video-toolbar-url"
              />
            </ToolbarGroup>
          ) : (
            ''
          )}
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
            {'yt_vm_video' === type && (
              <TextControl
                label={__('Video URL', '@@text_domain')}
                type="url"
                value={video}
                onChange={(value) => setAttributes({ video: value })}
              />
            )}

            {/* Preview Video */}
            {'video' === type && (videoMp4 || videoOgv || videoWebm) ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video controls>
                {videoMp4 ? <source src={videoMp4} type="video/mp4" /> : ''}
                {videoOgv ? <source src={videoOgv} type="video/ogg" /> : ''}
                {videoWebm ? <source src={videoWebm} type="video/webm" /> : ''}
              </video>
            ) : (
              ''
            )}

            {/* Select Videos */}
            {'video' === type && !videoMp4 ? (
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
            ) : (
              ''
            )}
            {'video' === type && videoMp4 ? (
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
            ) : (
              ''
            )}
            {'video' === type && !videoOgv ? (
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
            ) : (
              ''
            )}
            {'video' === type && videoOgv ? (
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
            ) : (
              ''
            )}
            {'video' === type && !videoWebm ? (
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
            ) : (
              ''
            )}
            {'video' === type && videoWebm ? (
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
            ) : (
              ''
            )}
          </PanelBody>
          <PanelBody>{this.getAspectRatioPicker()}</PanelBody>
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
            />
            <IconPicker
              label={__('Loading Icon', '@@text_domain')}
              value={iconLoading}
              onChange={(value) => setAttributes({ iconLoading: value })}
            />
            {hasClass(attributes.className, 'is-style-icon-only') ? (
              <BaseControl label={__('Icon Align', '@@text_domain')}>
                <div>
                  <BlockAlignmentToolbar
                    value={styleIconOnlyAlign}
                    onChange={(value) => {
                      let newClassName = attributes.className;

                      newClassName = removeClass(
                        newClassName,
                        'ghostkit-video-style-icon-only-align-right'
                      );
                      newClassName = removeClass(
                        newClassName,
                        'ghostkit-video-style-icon-only-align-left'
                      );

                      if ('left' === value || 'right' === value) {
                        newClassName = addClass(
                          newClassName,
                          `ghostkit-video-style-icon-only-align-${value}`
                        );
                      }

                      if (attributes.className !== newClassName) {
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
                  disabled: hasClass(attributes.className, 'is-style-icon-only'),
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
            {'fullscreen' === clickAction ? (
              <Fragment>
                <ApplyFilters
                  name="ghostkit.editor.controls"
                  attribute="fullscreenBackgroundColor"
                  props={this.props}
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

          {!hasClass(attributes.className, 'is-style-icon-only') ? (
            <PanelBody title={__('Poster Image', '@@text_domain')}>
              {!posterId ? (
                <MediaUpload
                  onSelect={(media) => {
                    this.onPosterSelect(media);
                  }}
                  allowedTypes={['image']}
                  value={posterId}
                  render={({ open }) => (
                    <Button onClick={open} isPrimary>
                      {__('Select Image', '@@text_domain')}
                    </Button>
                  )}
                />
              ) : (
                ''
              )}

              {posterId ? (
                <Fragment>
                  <MediaUpload
                    onSelect={(media) => {
                      this.onPosterSelect(media);
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
                      label={__('Image Size', '@@text_domain')}
                      value={posterSizeSlug || DEFAULT_SIZE_SLUG}
                      onChange={(val) => {
                        this.onPosterSelect(posterImage, val);
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
              ) : (
                ''
              )}
            </PanelBody>
          ) : null}
        </InspectorControls>
        <div className={className} data-video-aspect-ratio={videoAspectRatio}>
          {posterUrl && !hasClass(attributes.className, 'is-style-icon-only') ? (
            <div className="ghostkit-video-poster">
              <img src={posterUrl} alt={posterAlt} width={posterWidth} height={posterHeight} />
            </div>
          ) : (
            ''
          )}
          {!posterUrl &&
          'yt_vm_video' === type &&
          videoPosterPreview &&
          !hasClass(attributes.className, 'is-style-icon-only') ? (
            <div className="ghostkit-video-poster">
              <img src={videoPosterPreview} alt="" />
            </div>
          ) : (
            ''
          )}
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
          ) : (
            ''
          )}
        </div>
      </Fragment>
    );
  }
}

export default withSelect((select, { attributes, isSelected }) => {
  const { getSettings } = select('core/block-editor');
  const { getMedia } = select('core');

  return {
    editorSettings: getSettings(),
    posterImage: attributes.posterId && isSelected ? getMedia(attributes.posterId) : null,
  };
})(BlockEdit);
