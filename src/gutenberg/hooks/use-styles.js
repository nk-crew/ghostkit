// We can't use lodash merge, because it skip the specified undefined value
// which we use to reset styles.
import merge from '../utils/merge';
import compactObject from '../utils/compact-object';
import { maybeEncode, maybeDecode } from '../utils/encode-decode';

import useResponsive from './use-responsive';

const { cloneDeep } = window.lodash;

export default function useStyles(props) {
  const { attributes, setAttributes } = props;

  const ghostkitData = attributes?.ghostkit || {};
  const styles = ghostkitData?.styles || {};

  const { allDevices } = useResponsive();

  function getStyles() {
    return maybeDecode(styles);
  }

  /**
   * Get style value by property name, selected device and optional selector.
   *
   * @param {String} name - style property name.
   * @param {String} device - responsive device.
   * @param {String} selector - optional custom selector.
   *
   * @returns {any}
   */
  function getStyle(name, device = false, selector = false) {
    let result;
    let processStyles = getStyles();

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
   * @param {String} name - style property name.
   * @param {String} device - responsive device.
   * @param {String} selector - optional custom selector.
   *
   * @returns {boolean}
   */
  function hasStyle(name, device = false, selector = false) {
    return typeof getStyle(name, device, selector) !== 'undefined';
  }

  /**
   * Set new styles.
   *
   * @param {String} name - style property name.
   * @param {String} device - responsive device.
   * @param {String} selector - optional custom selector.
   *
   * @returns {boolean}
   */
  function setStyles(newStyles, device = false, selector = false) {
    let result;

    const clonedGhostkitData = cloneDeep(ghostkitData);

    if (typeof clonedGhostkitData?.styles === 'undefined') {
      clonedGhostkitData.styles = {};
    }

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
      maybeDecode(clonedGhostkitData.styles),
      result
    );

    const cleanResult = compactObject(result);

    clonedGhostkitData.styles = maybeEncode(cleanResult);

    setAttributes({ ghostkit: clonedGhostkitData });
  }

  function resetStyles(resetProps, withResponsive = false, selectors = ['']) {
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

    setStyles(result);
  }

  return {
    styles,
    getStyles,
    getStyle,
    hasStyle,
    setStyles,
    resetStyles,
  };
}
