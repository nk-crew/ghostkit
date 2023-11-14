/**
 * WordPress dependencies
 */
const { FocalPointPicker } = wp.components;

/**
 * Internal dependencies
 */
const imgCache = {};

/**
 * Convert background size tp focal point object value
 *
 * @param {string} size - background size.
 *
 * @return {object} background size object.
 */
function sizeToPoint(size) {
  const sizes = size.split(' ');
  const result = {
    x: 0.5,
    y: 0.5,
  };

  if (!sizes[0]) {
    return result;
  }

  if (!sizes[1]) {
    sizes.push(sizes[0]);
  }

  result.x = Math.max(Math.min(parseFloat(sizes[0]) / 100, 1), 0);
  result.y = Math.max(Math.min(parseFloat(sizes[1]) / 100, 1), 0);

  return result;
}

/**
 * Parse string with image tag and retreive image src.
 *
 * @param {string} image - image tag in string
 *
 * @return {string} - image src
 */
function parseImageUrl(image) {
  if (typeof imgCache[image] !== 'undefined') {
    return imgCache[image];
  }

  // <img> tag
  let src = /<img\s[^>]*?src\s*=\s*['"]([^'"]*?)['"][^>]*?>/g.exec(image);

  if (src && src[1]) {
    // eslint-disable-next-line prefer-destructuring
    imgCache[image] = src[1];
    return src[1];
  }

  // <div> tag with background image style.
  const style = /<div\s[^>]*?style\s*=\s*['"]([^'"]*?)['"][^>]*?>/g.exec(image);

  if (style && style[1]) {
    src = style[1]
      .replace('background-image: url("', '')
      .replace('background-image: url(&quot;', '')
      .replace('");', '')
      .replace('&quot;);', '');

    if (src) {
      imgCache[image] = src;
      return src;
    }
  }

  imgCache[image] = false;
  return false;
}

/**
 * Component Class.
 */
export default function CustomFocalPointPicker(props) {
  const { value, onChange, label, image } = props;

  const focalPointValue = sizeToPoint(value);
  let imageUrl = '';

  if (!image) {
    return null;
  }

  imageUrl = parseImageUrl(image);

  if (!imageUrl) {
    return null;
  }

  return (
    <FocalPointPicker
      label={label}
      url={imageUrl}
      value={focalPointValue}
      onChange={(val) => {
        onChange(`${parseInt(100 * val.x, 10)}% ${parseInt(100 * val.y, 10)}%`);
      }}
    />
  );
}
