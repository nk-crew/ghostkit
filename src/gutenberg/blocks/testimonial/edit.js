/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';
import URLPicker from '../../components/url-picker';
import RangeControl from '../../components/range-control';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { PanelBody, BaseControl, SelectControl, TextareaControl, ExternalLink, Button } =
  wp.components;

const { withSelect } = wp.data;

const { InspectorControls, InnerBlocks, RichText, MediaUpload } = wp.blockEditor;

const DEFAULT_SIZE_SLUG = 'thumbnail';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  constructor(props) {
    super(props);

    this.onPhotoSelect = this.onPhotoSelect.bind(this);
  }

  onPhotoSelect(imageData, imageSize = false) {
    const { attributes, setAttributes } = this.props;

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
  }

  render() {
    const { attributes, setAttributes, editorSettings, photoImage, isSelected, hasChildBlocks } =
      this.props;

    let { className = '' } = this.props;

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

    className = classnames('ghostkit-testimonial', className);

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody>
            <IconPicker
              label={__('Icon', '@@text_domain')}
              value={icon}
              onChange={(value) => setAttributes({ icon: value })}
            />
          </PanelBody>
          <PanelBody title={__('Photo', '@@text_domain')}>
            {!photoId ? (
              <MediaUpload
                onSelect={(media) => {
                  this.onPhotoSelect(media);
                }}
                allowedTypes={['image']}
                value={photoId}
                render={({ open }) => (
                  <Button onClick={open} isPrimary>
                    {__('Select Image', '@@text_domain')}
                  </Button>
                )}
              />
            ) : null}

            {photoId ? (
              <Fragment>
                <MediaUpload
                  onSelect={(media) => {
                    this.onPhotoSelect(media);
                  }}
                  allowedTypes={['image']}
                  value={photoId}
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
                  {__('Remove Image', '@@text_domain')}
                </Button>
                <div style={{ marginBottom: 13 }} />
                {editorSettings && editorSettings.imageSizes ? (
                  <SelectControl
                    label={__('Image Size', '@@text_domain')}
                    value={photoSizeSlug || DEFAULT_SIZE_SLUG}
                    onChange={(val) => {
                      this.onPhotoSelect(photoImage, val);
                    }}
                    options={editorSettings.imageSizes.map((imgSize) => ({
                      value: imgSize.slug,
                      label: imgSize.name,
                    }))}
                  />
                ) : null}
                <TextareaControl
                  label={__('Alt text (alternative text)')}
                  value={photoAlt}
                  onChange={(val) => setAttributes({ photoAlt: val })}
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
          <PanelBody title={__('Stars', '@@text_domain')}>
            <RangeControl
              value={stars}
              min={0}
              max={5}
              step={0.5}
              beforeIcon="star-filled"
              allowReset
              onChange={(value) => setAttributes({ stars: value })}
            />
            {typeof stars === 'number' ? (
              <IconPicker
                label={__('Icon', '@@text_domain')}
                value={starsIcon}
                onChange={(value) => setAttributes({ starsIcon: value })}
              />
            ) : (
              ''
            )}
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
        <div className={className}>
          {icon ? (
            <div className="ghostkit-testimonial-icon">
              <IconPicker.Dropdown
                onChange={(value) => setAttributes({ icon: value })}
                value={icon}
                renderToggle={({ onToggle }) => (
                  <IconPicker.Preview onClick={onToggle} name={icon} />
                )}
              />
            </div>
          ) : (
            ''
          )}
          <div className="ghostkit-testimonial-content">
            <InnerBlocks
              templateLock={false}
              renderAppender={hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender}
            />
          </div>
          <div className="ghostkit-testimonial-photo">
            {!photoId ? (
              <MediaUpload
                onSelect={(media) => {
                  this.onPhotoSelect(media);
                }}
                allowedTypes={['image']}
                value={photoId}
                render={({ open }) => (
                  <Button onClick={open}>
                    <span className="dashicons dashicons-format-image" />
                  </Button>
                )}
              />
            ) : (
              ''
            )}

            {photoId ? (
              <MediaUpload
                onSelect={(media) => {
                  this.onPhotoSelect(media);
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
                    <img src={photoUrl} alt={photoAlt} width={photoWidth} height={photoHeight} />
                  </a>
                )}
              />
            ) : (
              ''
            )}
          </div>
          <div className="ghostkit-testimonial-meta">
            <RichText
              tagName="div"
              className="ghostkit-testimonial-name"
              placeholder={__('Write name…', '@@text_domain')}
              value={attributes.name}
              onChange={(value) => setAttributes({ name: value })}
            />
            <RichText
              tagName="div"
              className="ghostkit-testimonial-source"
              placeholder={__('Write source…', '@@text_domain')}
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
          ) : (
            ''
          )}
        </div>
      </Fragment>
    );
  }
}

export default withSelect((select, { attributes, isSelected, clientId }) => {
  const blockEditor = select('core/block-editor');
  const { getMedia } = select('core');

  return {
    hasChildBlocks: blockEditor ? blockEditor.getBlockOrder(clientId).length > 0 : false,
    editorSettings: blockEditor.getSettings(),
    photoImage: attributes.photoId && isSelected ? getMedia(attributes.photoId) : null,
  };
})(BlockEdit);
