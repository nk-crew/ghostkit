// We can't use lodash merge, because it skip the specified undefined value
// which we use to reset styles.
import merge from '../merge';
import compactObject from '../compact-object';
import { maybeEncode, maybeDecode } from '../encode-decode';

const allDevices = { ...window.ghostkitVariables.media_sizes };

/**
 * Prepare and decode styles to work with.
 *
 * @param {Object} styles - styles object.
 *
 * @returns {Object}
 */
export function prepareStyles(styles) {
  return maybeDecode(styles);
}

/**
 * Get style value by property name, selected device and optional selector.
 *
 * @param {Object} styles - styles object.
 * @param {String} name - style property name.
 * @param {String} device - responsive device.
 * @param {String} selector - optional custom selector.
 *
 * @returns {any}
 */
export function getStyle(styles, name, device = false, selector = false) {
  let result;
  let processStyles = prepareStyles(styles);

  if (device) {
    processStyles = processStyles?.[`media_${device}`];
  }

  if (selector) {
    processStyles = processStyles?.[selector];
  }

  if (typeof processStyles?.[name] !== 'undefined') {
    result = processStyles?.[name];
  }

  return result;
}

/**
 * Check if style exists.
 *
 * @param {Object} styles - styles object.
 * @param {String} name - style property name.
 * @param {String} device - responsive device.
 * @param {String} selector - optional custom selector.
 *
 * @returns {boolean}
 */
export function hasStyle(styles, name, device = false, selector = false) {
  return typeof getStyle(styles, name, device, selector) !== 'undefined';
}

/**
 * Set new styles.
 *
 * @param {Object} styles - styles object.
 * @param {String} name - style property name.
 * @param {String} device - responsive device.
 * @param {String} selector - optional custom selector.
 *
 * @returns {boolean}
 */
export function getUpdatedStyles(styles, newStyles, device = false, selector = false) {
  let result;

  if (selector) {
    newStyles = { [selector]: newStyles };
  }

  if (device) {
    result = {};
    result[`media_${device}`] = newStyles;
  } else {
    result = newStyles;
  }

  // Add default properties to keep sorting.
  result = merge(
    {
      media_xl: {},
      media_lg: {},
      media_md: {},
      media_sm: {},
    },
    maybeDecode(styles),
    result
  );

  const cleanResult = compactObject(result);

  return maybeEncode(cleanResult);
}

/**
 * Get object with styles to reset.
 *
 * @param {Array} resetProps - array with CSS props to reset.
 * @param {Boolean} withResponsive - reset responsive styles.
 * @param {Selector} selectors - reset styles in custom selectors set.
 */
export function getStylesToReset(resetProps, withResponsive = false, selectors = ['']) {
  const result = {};

  selectors.forEach((selector) => {
    if (selector) {
      result[selector] = {};
    }
  });

  ['', ...(withResponsive ? Object.keys(allDevices) : [])].forEach((thisDevice) => {
    if (thisDevice) {
      result[`media_${thisDevice}`] = {};

      selectors.forEach((selector) => {
        if (selector) {
          result[`media_${thisDevice}`][selector] = {};
        }
      });
    }

    resetProps.forEach((thisProp) => {
      selectors.forEach((selector) => {
        if (thisDevice) {
          if (selector) {
            result[`media_${thisDevice}`][selector][thisProp] = undefined;
          } else {
            result[`media_${thisDevice}`][thisProp] = undefined;
          }
        } else if (selector) {
          result[selector][thisProp] = undefined;
        } else {
          result[thisProp] = undefined;
        }
      });
    });
  });

  return result;
}
