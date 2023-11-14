/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';

import metadata from './block.json';

const { name } = metadata;

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { RichText, useBlockProps, useInnerBlocksProps } = wp.blockEditor;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { attributes } = props;

  const {
    photoId,
    photoUrl,
    photoAlt,
    photoWidth,
    photoHeight,

    icon,
    source,
    stars,
    starsIcon,
    url,
    ariaLabel,
    target,
    rel,
  } = attributes;

  let className = classnames('ghostkit-testimonial', url ? 'ghostkit-testimonial-with-link' : '');

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{ name },
    ...props,
  });

  const blockProps = useBlockProps.save({ className });
  const innerBlockProps = useInnerBlocksProps.save({ className: 'ghostkit-testimonial-content' });

  return (
    <div {...blockProps}>
      {url ? (
        <a
          className="ghostkit-testimonial-link"
          href={url}
          target={target || null}
          rel={rel || null}
          aria-label={ariaLabel || null}
        >
          <span />
        </a>
      ) : (
        ''
      )}
      {icon ? (
        <IconPicker.Render name={icon} tag="div" className="ghostkit-testimonial-icon" />
      ) : (
        ''
      )}
      <div {...innerBlockProps} />
      {photoUrl ? (
        <div className="ghostkit-testimonial-photo">
          <img
            src={photoUrl}
            alt={photoAlt}
            className={photoId ? `wp-image-${photoId}` : null}
            width={photoWidth}
            height={photoHeight}
          />
        </div>
      ) : (
        ''
      )}
      {!RichText.isEmpty(attributes.name) || !RichText.isEmpty(source) ? (
        <div className="ghostkit-testimonial-meta">
          {!RichText.isEmpty(attributes.name) ? (
            <div className="ghostkit-testimonial-name">
              <RichText.Content value={attributes.name} />
            </div>
          ) : (
            ''
          )}
          {!RichText.isEmpty(source) ? (
            <div className="ghostkit-testimonial-source">
              <RichText.Content value={source} />
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
      {typeof stars === 'number' && starsIcon ? (
        <div className="ghostkit-testimonial-stars">
          <div className="ghostkit-testimonial-stars-wrap">
            <div
              className="ghostkit-testimonial-stars-front"
              style={{ width: `${(100 * stars) / 5}%` }}
            >
              <IconPicker.Render name={starsIcon} />
              <IconPicker.Render name={starsIcon} />
              <IconPicker.Render name={starsIcon} />
              <IconPicker.Render name={starsIcon} />
              <IconPicker.Render name={starsIcon} />
            </div>
            <div className="ghostkit-testimonial-stars-back">
              <IconPicker.Render name={starsIcon} />
              <IconPicker.Render name={starsIcon} />
              <IconPicker.Render name={starsIcon} />
              <IconPicker.Render name={starsIcon} />
              <IconPicker.Render name={starsIcon} />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
