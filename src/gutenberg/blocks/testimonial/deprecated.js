/* eslint-disable max-classes-per-file */
/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';
import { maybeDecode } from '../../utils/encode-decode';

import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { applyFilters } = wp.hooks;

const { InnerBlocks, RichText } = wp.blockEditor;

const { name } = metadata;

export default [
  // v2.23.2
  {
    ...metadata,
    attributes: {
      icon: {
        type: 'string',
        default:
          '%3Csvg%20class%3D%22ghostkit-svg-icon%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M13.5954%2010.708C15.7931%205.55696%2021.1071%205%2021.1071%205L21.3565%205.16714C18.945%206.72641%2019.0559%208.98169%2019.0559%208.98169C19.0559%208.98169%2022.1211%209.70495%2022.7979%2012.2673C23.5186%2014.996%2022.2158%2017.2944%2020.4141%2018.3373C18.1801%2019.6305%2015.4248%2018.9499%2014.0389%2017.0008C12.6134%2014.996%2012.8469%2012.4623%2013.5954%2010.708Z%22%20fill%3D%22currentColor%22%2F%3E%3Cpath%20d%3D%22M1.59537%2010.708C3.79305%205.55696%209.10709%205%209.10709%205L9.35651%205.16714C6.945%206.72641%207.05592%208.98169%207.05592%208.98169C7.05592%208.98169%2010.1211%209.70495%2010.7979%2012.2673C11.5186%2014.996%2010.2158%2017.2944%208.41413%2018.3373C6.18005%2019.6305%203.42475%2018.9499%202.03887%2017.0008C0.61344%2014.996%200.846929%2012.4623%201.59537%2010.708Z%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E',
      },
      photoId: {
        type: 'number',
      },
      photoUrl: {
        attribute: 'src',
        selector: '.ghostkit-testimonial-photo img',
        source: 'attribute',
        type: 'string',
      },
      photoAlt: {
        attribute: 'alt',
        selector: '.ghostkit-testimonial-photo img',
        source: 'attribute',
        type: 'string',
        default: '',
      },
      photoWidth: {
        type: 'number',
      },
      photoHeight: {
        type: 'number',
      },
      photoSizeSlug: {
        type: 'string',
      },
      name: {
        type: 'string',
        source: 'html',
        selector: '.ghostkit-testimonial-name',
        default: '<strong>Katrina Craft</strong>',
      },
      source: {
        type: 'string',
        source: 'html',
        selector: '.ghostkit-testimonial-source',
        default: 'Designer',
      },
      stars: {
        type: 'number',
      },
      starsIcon: {
        type: 'string',
        default:
          '%3Csvg%20class%3D%22ghostkit-svg-icon%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M12.6724%202.66808C12.5461%202.41207%2012.2853%202.25%2011.9998%202.25C11.7144%202.25%2011.4536%202.41207%2011.3273%202.66808L8.56287%208.26941L2.38143%209.16762C2.09892%209.20868%201.86421%209.40656%201.77599%209.67807C1.68777%209.94958%201.76134%2010.2476%201.96577%2010.4469L6.4387%2014.8069L5.38279%2020.9634C5.33453%2021.2448%205.45019%2021.5291%205.68115%2021.6969C5.91211%2021.8647%206.21831%2021.8869%206.471%2021.754L11.9998%2018.8473L17.5287%2021.754C17.7814%2021.8869%2018.0876%2021.8647%2018.3185%2021.6969C18.5495%2021.5291%2018.6652%2021.2448%2018.6169%2020.9634L17.561%2014.8069L22.0339%2010.4469C22.2383%2010.2476%2022.3119%209.94958%2022.2237%209.67807C22.1355%209.40656%2021.9008%209.20868%2021.6183%209.16762L15.4368%208.26941L12.6724%202.66808Z%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E',
      },
      url: {
        type: 'string',
      },
      target: {
        type: 'string',
      },
      rel: {
        type: 'string',
      },
    },
    save: class BlockSave extends Component {
      render() {
        const { attributes } = this.props;

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
          target,
          rel,
        } = attributes;

        let className = classnames(
          'ghostkit-testimonial',
          url ? 'ghostkit-testimonial-with-link' : ''
        );

        className = applyFilters('ghostkit.blocks.className', className, {
          ...{
            name,
          },
          ...this.props,
        });

        return (
          <div className={className}>
            {url ? (
              <a
                className="ghostkit-testimonial-link"
                href={url}
                target={target || false}
                rel={rel || false}
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
            <div className="ghostkit-testimonial-content">
              <InnerBlocks.Content />
            </div>
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
            {'number' === typeof stars && starsIcon ? (
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
    },
  },

  // v2.20.3
  {
    ...metadata,
    isEligible(attributes) {
      return attributes.photoTag || attributes.photo;
    },
    migrate(attributes) {
      const newAttributes = {
        ...attributes,
      };

      if ('undefined' !== typeof attributes.photo) {
        newAttributes.photoId = attributes.photo;
      }
      if ('undefined' !== typeof attributes.photoSize) {
        newAttributes.photoSizeSlug = attributes.photoSize;
      }
      if ('undefined' !== typeof attributes.photoTag && attributes.photoTag) {
        const imgSrc = attributes.photoTag.match(/<img.+src=(?:"|')(.+?)(?:"|')(?:.+?)>/);
        const imgAlt = attributes.photoTag.match(/<img.+alt=(?:"|')(.+?)(?:"|')(?:.+?)>/);
        const imgWidth = attributes.photoTag.match(/<img.+width=(?:"|')(.+?)(?:"|')(?:.+?)>/);
        const imgHeight = attributes.photoTag.match(/<img.+height=(?:"|')(.+?)(?:"|')(?:.+?)>/);

        if (imgSrc && imgSrc[1]) {
          // eslint-disable-next-line prefer-destructuring
          newAttributes.photoUrl = imgSrc[1];
        }
        if (imgAlt && imgAlt[1]) {
          // eslint-disable-next-line prefer-destructuring
          newAttributes.photoAlt = imgAlt[1];
        }
        if (imgWidth && imgWidth[1]) {
          // eslint-disable-next-line prefer-destructuring
          newAttributes.photoWidth = parseInt(imgWidth[1], 10);
        }
        if (imgHeight && imgHeight[1]) {
          // eslint-disable-next-line prefer-destructuring
          newAttributes.photoHeight = parseInt(imgHeight[1], 10);
        }
      }

      delete newAttributes.photo;
      delete newAttributes.photoTag;
      delete newAttributes.photoSize;
      delete newAttributes.photoSizes;

      return [newAttributes, []];
    },
    attributes: {
      icon: {
        type: 'string',
        default:
          '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5954 10.708C15.7931 5.55696 21.1071 5 21.1071 5L21.3565 5.16714C18.945 6.72641 19.0559 8.98169 19.0559 8.98169C19.0559 8.98169 22.1211 9.70495 22.7979 12.2673C23.5186 14.996 22.2158 17.2944 20.4141 18.3373C18.1801 19.6305 15.4248 18.9499 14.0389 17.0008C12.6134 14.996 12.8469 12.4623 13.5954 10.708Z" fill="currentColor"/><path d="M1.59537 10.708C3.79305 5.55696 9.10709 5 9.10709 5L9.35651 5.16714C6.945 6.72641 7.05592 8.98169 7.05592 8.98169C7.05592 8.98169 10.1211 9.70495 10.7979 12.2673C11.5186 14.996 10.2158 17.2944 8.41413 18.3373C6.18005 19.6305 3.42475 18.9499 2.03887 17.0008C0.61344 14.996 0.846929 12.4623 1.59537 10.708Z" fill="currentColor"/></svg>',
      },
      photo: {
        type: 'number',
        default: '',
      },
      photoTag: {
        type: 'string',
        default: '',
      },
      photoSizes: {
        type: 'object',
        default: '',
      },
      photoSize: {
        type: 'string',
        default: 'thumbnail',
      },
      name: {
        type: 'string',
        source: 'html',
        selector: '.ghostkit-testimonial-name',
        default: '<strong>Katrina Craft</strong>',
      },
      source: {
        type: 'string',
        source: 'html',
        selector: '.ghostkit-testimonial-source',
        default: 'Designer',
      },
      stars: {
        type: 'number',
      },
      starsIcon: {
        type: 'string',
        default:
          '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.6724 2.66808C12.5461 2.41207 12.2853 2.25 11.9998 2.25C11.7144 2.25 11.4536 2.41207 11.3273 2.66808L8.56287 8.26941L2.38143 9.16762C2.09892 9.20868 1.86421 9.40656 1.77599 9.67807C1.68777 9.94958 1.76134 10.2476 1.96577 10.4469L6.4387 14.8069L5.38279 20.9634C5.33453 21.2448 5.45019 21.5291 5.68115 21.6969C5.91211 21.8647 6.21831 21.8869 6.471 21.754L11.9998 18.8473L17.5287 21.754C17.7814 21.8869 18.0876 21.8647 18.3185 21.6969C18.5495 21.5291 18.6652 21.2448 18.6169 20.9634L17.561 14.8069L22.0339 10.4469C22.2383 10.2476 22.3119 9.94958 22.2237 9.67807C22.1355 9.40656 21.9008 9.20868 21.6183 9.16762L15.4368 8.26941L12.6724 2.66808Z" fill="currentColor"/></svg>',
      },
      url: {
        type: 'string',
      },
      target: {
        type: 'string',
      },
      rel: {
        type: 'string',
      },
    },
    save: class BlockSave extends Component {
      render() {
        const { attributes } = this.props;

        const { photoTag, icon, source, stars, starsIcon, url, target, rel } = attributes;

        let className = classnames(
          'ghostkit-testimonial',
          url ? 'ghostkit-testimonial-with-link' : ''
        );

        className = applyFilters('ghostkit.blocks.className', className, {
          ...{
            name,
          },
          ...this.props,
        });

        return (
          <div className={className}>
            {url ? (
              <a
                className="ghostkit-testimonial-link"
                href={url}
                target={target || false}
                rel={rel || false}
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
            <div className="ghostkit-testimonial-content">
              <InnerBlocks.Content />
            </div>
            {photoTag ? (
              <div
                className="ghostkit-testimonial-photo"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: maybeDecode(photoTag),
                }}
              />
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
            {'number' === typeof stars && starsIcon ? (
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
    },
  },
];
