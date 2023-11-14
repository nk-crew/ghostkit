/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import RangeControl from '../../components/range-control';
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useSelect } = wp.data;

const {
  PanelBody,
  BaseControl,
  Button,
  Placeholder,
  SelectControl,
  TextareaControl,
  ToggleControl,
  ExternalLink,
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  __experimentalToggleGroupControl: ToggleGroupControl,
  __experimentalToggleGroupControlOption: ToggleGroupControlOption,
} = wp.components;

const { InspectorControls, BlockControls, MediaUpload, RichText, MediaPlaceholder, useBlockProps } =
  wp.blockEditor;

const ALLOWED_MEDIA_TYPES = ['image'];
const DEFAULT_SIZE_SLUG = 'large';

/**
 * Block Edit Class.
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
        className={attributes[`${type}Id`] ? `wp-image-${attributes[`${type}Id`]}` : null}
        width={attributes[`${type}Width`]}
        height={attributes[`${type}Height`]}
      />
    ) : (
      false
    );
  };

  const updateImageData = (type = 'before', imageData = {}, imageSize = false) => {
    imageSize = imageSize || attributes[`${type}SizeSlug`] || DEFAULT_SIZE_SLUG;

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
    direction === 'vertical' ? getIcon('icon-horizontal-start') : getIcon('icon-vertical-top');
  const iconCenter =
    direction === 'vertical' ? getIcon('icon-horizontal-center') : getIcon('icon-vertical-center');
  const iconEnd =
    direction === 'vertical' ? getIcon('icon-horizontal-end') : getIcon('icon-vertical-bottom');

  className = classnames(
    'ghostkit-image-compare',
    direction === 'vertical' ? 'ghostkit-image-compare-vertical' : false,
    showLabels && labelAlign ? `ghostkit-image-compare-labels-align-${labelAlign}` : false,
    className
  );

  const blockProps = useBlockProps({ className });

  return (
    <>
      {beforeUrl && afterUrl ? (
        <BlockControls>
          <ToolbarGroup>
            <ToolbarButton
              icon={getIcon('icon-flip-vertical')}
              title={__('Vertical', '@@text_domain')}
              onClick={() =>
                setAttributes({ direction: direction === 'vertical' ? '' : 'vertical' })
              }
              isActive={direction === 'vertical'}
            />
          </ToolbarGroup>
        </BlockControls>
      ) : null}

      <InspectorControls>
        {beforeUrl && afterUrl ? (
          <PanelBody title={__('General', '@@text_domain')}>
            <RangeControl
              label={__('Start Position', '@@text_domain')}
              value={position}
              min={0}
              max={100}
              onChange={(val) => setAttributes({ position: val })}
            />
            <ToggleGroupControl
              label={__('Direction', '@@text_domain')}
              onChange={(val) => setAttributes({ direction: val })}
              value={direction || ''}
              isBlock
            >
              <ToggleGroupControlOption value="" label={__('Horizontal', '@@text_domain')} />
              <ToggleGroupControlOption value="vertical" label={__('Vertical', '@@text_domain')} />
            </ToggleGroupControl>
            <ToggleGroupControl
              label={__('Trigger', '@@text_domain')}
              onChange={(val) => setAttributes({ trigger: val })}
              value={trigger || ''}
              isBlock
            >
              <ToggleGroupControlOption value="" label={__('Click', '@@text_domain')} />
              <ToggleGroupControlOption value="hover" label={__('Hover', '@@text_domain')} />
            </ToggleGroupControl>
          </PanelBody>
        ) : null}

        <PanelBody title={__('Labels', '@@text_domain')}>
          <ToggleControl
            label={__('Show Labels', '@@text_domain')}
            checked={!!showLabels}
            onChange={(value) => setAttributes({ showLabels: value })}
          />
          {showLabels && (
            <BaseControl
              label={
                direction === 'vertical'
                  ? __('Horizontal Align', '@@text_domain')
                  : __('Vertical Align', '@@text_domain')
              }
            >
              <div>
                <Toolbar
                  label={
                    direction === 'vertical'
                      ? __('Horizontal Align', '@@text_domain')
                      : __('Vertical Align', '@@text_domain')
                  }
                >
                  <ToolbarButton
                    icon={iconStart}
                    title={__('Start', '@@text_domain')}
                    onClick={() => setAttributes({ labelAlign: 'start' })}
                    isActive={labelAlign === 'start'}
                  />
                  <ToolbarButton
                    icon={iconCenter}
                    title={__('Center', '@@text_domain')}
                    onClick={() => setAttributes({ labelAlign: 'center' })}
                    isActive={labelAlign === 'center'}
                  />
                  <ToolbarButton
                    icon={iconEnd}
                    title={__('End', '@@text_domain')}
                    onClick={() => setAttributes({ labelAlign: 'end' })}
                    isActive={labelAlign === 'end'}
                  />
                </Toolbar>
              </div>
            </BaseControl>
          )}
        </PanelBody>

        <PanelBody title={__('Before Image Settings', '@@text_domain')}>
          {!beforeId ? (
            <MediaUpload
              onSelect={(media) => {
                updateImageData('before', media);
              }}
              allowedTypes={['image']}
              value={beforeId}
              render={({ open }) => (
                <Button onClick={open} isPrimary>
                  {__('Select Image', '@@text_domain')}
                </Button>
              )}
            />
          ) : (
            ''
          )}

          {beforeId ? (
            <>
              <MediaUpload
                onSelect={(media) => {
                  updateImageData('before', media);
                }}
                allowedTypes={['image']}
                value={beforeId}
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
                {__('Remove Image', '@@text_domain')}
              </Button>
              <div style={{ marginBottom: 13 }} />
              {editorSettings && editorSettings.imageSizes ? (
                <SelectControl
                  label={__('Resolution', '@@text_domain')}
                  help={__('Select the size of the source image.', '@@text_domain')}
                  value={beforeSizeSlug || DEFAULT_SIZE_SLUG}
                  onChange={(val) => {
                    updateImageData('before', beforeImage, val);
                  }}
                  options={editorSettings.imageSizes.map((imgSize) => ({
                    value: imgSize.slug,
                    label: imgSize.name,
                  }))}
                />
              ) : null}
              <TextareaControl
                label={__('Alt text (alternative text)')}
                value={beforeAlt}
                onChange={(val) => setAttributes({ beforeAlt: val })}
                help={
                  <>
                    <ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
                      {__('Describe the purpose of the image', '@@text_domain')}
                    </ExternalLink>
                    {__('Leave empty if the image is purely decorative.', '@@text_domain')}
                  </>
                }
              />
            </>
          ) : (
            ''
          )}
        </PanelBody>
        <PanelBody title={__('After Image Settings', '@@text_domain')}>
          {!afterId ? (
            <MediaUpload
              onSelect={(media) => {
                updateImageData('after', media);
              }}
              allowedTypes={['image']}
              value={afterId}
              render={({ open }) => (
                <Button onClick={open} isPrimary>
                  {__('Select Image', '@@text_domain')}
                </Button>
              )}
            />
          ) : (
            ''
          )}

          {afterId ? (
            <>
              <MediaUpload
                onSelect={(media) => {
                  updateImageData('after', media);
                }}
                allowedTypes={['image']}
                value={afterId}
                render={({ open }) => (
                  <BaseControl help={__('Click the image to edit or update', '@@text_domain')}>
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-is-valid */}
                    <a
                      href="#"
                      onClick={open}
                      className="ghostkit-gutenberg-media-upload"
                      style={{ display: 'block' }}
                    >
                      <img src={afterUrl} alt={afterAlt} width={afterWidth} height={afterHeight} />
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
                {__('Remove Image', '@@text_domain')}
              </Button>
              <div style={{ marginBottom: 13 }} />
              {editorSettings && editorSettings.imageSizes ? (
                <SelectControl
                  label={__('Resolution', '@@text_domain')}
                  help={__('Select the size of the source image.', '@@text_domain')}
                  value={afterSizeSlug || DEFAULT_SIZE_SLUG}
                  onChange={(val) => {
                    updateImageData('after', afterImage, val);
                  }}
                  options={editorSettings.imageSizes.map((imgSize) => ({
                    value: imgSize.slug,
                    label: imgSize.name,
                  }))}
                />
              ) : null}
              <TextareaControl
                label={__('Alt text (alternative text)')}
                value={afterAlt}
                onChange={(val) => setAttributes({ afterAlt: val })}
                help={
                  <>
                    <ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
                      {__('Describe the purpose of the image', '@@text_domain')}
                    </ExternalLink>
                    {__('Leave empty if the image is purely decorative.', '@@text_domain')}
                  </>
                }
              />
            </>
          ) : (
            ''
          )}
        </PanelBody>
      </InspectorControls>

      <InspectorControls group="styles">
        <PanelBody title={__('Color', '@@text_domain')}>
          <ColorPicker
            label={__('Divider', '@@text_domain')}
            value={colorDivider}
            onChange={(val) => setAttributes({ colorDivider: val })}
            alpha
          />
          <ColorPicker
            label={__('Divider Icon', '@@text_domain')}
            value={colorDividerIcon}
            onChange={(val) => setAttributes({ colorDividerIcon: val })}
            alpha
          />
        </PanelBody>
      </InspectorControls>

      {!beforeUrl || !afterUrl ? (
        <div {...blockProps}>
          <Placeholder
            className="ghostkit-image-compare-placeholder"
            icon={getIcon('block-image-compare')}
            label={__('Image Compare', '@@text_domain')}
            instructions={__('Select images to compare', '@@text_domain')}
          >
            {getImgTag('before') ? (
              <div className="components-placeholder">{getImgTag('before')}</div>
            ) : (
              <MediaPlaceholder
                icon="format-image"
                labels={{
                  title: __('Image Before', '@@text_domain'),
                  name: __('image', '@@text_domain'),
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
              <div className="components-placeholder">{getImgTag('after')}</div>
            ) : (
              <MediaPlaceholder
                icon="format-image"
                labels={{
                  title: __('Image After', '@@text_domain'),
                  name: __('image', '@@text_domain'),
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
              {showLabels && (!RichText.isEmpty(labelBeforeText) || isSelected) ? (
                <div className="ghostkit-image-compare-image-label ghostkit-image-compare-image-before-label">
                  <RichText
                    inlineToolbar
                    tagName="div"
                    onChange={(val) => setAttributes({ labelBeforeText: val })}
                    value={labelBeforeText}
                    placeholder={__('Before label…', '@@text_domain')}
                  />
                </div>
              ) : null}
            </div>
            <div className="ghostkit-image-compare-image-after">
              {getImgTag('after')}
              {showLabels && (!RichText.isEmpty(labelAfterText) || isSelected) ? (
                <div className="ghostkit-image-compare-image-label ghostkit-image-compare-image-after-label">
                  <RichText
                    inlineToolbar
                    tagName="div"
                    onChange={(val) => setAttributes({ labelAfterText: val })}
                    value={labelAfterText}
                    placeholder={__('After label…', '@@text_domain')}
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
              onChange={(value) => setAttributes({ caption: value })}
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
