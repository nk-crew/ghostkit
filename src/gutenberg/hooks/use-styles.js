// We can't use lodash merge, because it skip the specified undefined value.
// We need it to remove styles.
import merge from '../utils/merge';
import { maybeEncode, maybeDecode } from '../utils/encode-decode';

const { cloneDeep } = window.lodash;

export default function useStyles(props) {
  const { attributes, setAttributes } = props;

  const ghostkitData = attributes?.ghostkit || {};
  const styles = ghostkitData?.styles || {};

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
    let processStyles = styles;

    if (device) {
      processStyles = processStyles?.[`media_${device}`];
    }

    if (selector) {
      processStyles = processStyles?.[selector];
    }

    if (typeof processStyles?.[name] !== 'undefined') {
      result = processStyles?.[name];
    }

    return result && maybeDecode(result);
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
      clonedGhostkitData.styles,
      result
    );

    const cleanResult = {};

    // Validate values and remove empty.
    Object.keys(result).forEach((key) => {
      if (result[key]) {
        // check if device object.
        if (typeof result[key] === 'object') {
          Object.keys(result[key]).forEach((keyDevice) => {
            // Skip undefined values to possibility to remove styles.
            if (typeof result[key][keyDevice] !== 'undefined') {
              if (!cleanResult[key]) {
                cleanResult[key] = {};
              }

              cleanResult[key][keyDevice] = result[key][keyDevice];
            }
          });

          // Skip undefined values to possibility to remove styles.
        } else if (typeof result[key] !== 'undefined') {
          cleanResult[key] = result[key];
        }
      }
    });

    clonedGhostkitData.styles = maybeEncode(cleanResult);

    setAttributes({ ghostkit: clonedGhostkitData });
  }

  return {
    styles,
    getStyle,
    hasStyle,
    setStyles,
  };
}
