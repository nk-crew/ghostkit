// We can't use lodash merge, because it skip the specified undefined value.
// We need it to remove styles.
import merge from '../utils/merge';

const { cloneDeep } = window.lodash;

export default function useStyles(props) {
  const { attributes, setAttributes } = props;

  const ghostkitData = attributes?.ghostkit || {};
  const styles = ghostkitData?.styles || {};

  function getStyle(name, device) {
    let result;

    if (device) {
      if (typeof styles?.[`media_${device}`]?.[name] !== 'undefined') {
        result = styles?.[`media_${device}`]?.[name];
      }
    } else if (typeof styles?.[name] !== 'undefined') {
      result = styles?.[name];
    }

    return result;
  }

  function hasStyle(name, device) {
    return typeof getStyle(name, device) !== 'undefined';
  }

  function setStyles(newStyles, device) {
    let result;

    const clonedGhostkitData = cloneDeep(ghostkitData);

    if (typeof clonedGhostkitData?.styles === 'undefined') {
      clonedGhostkitData.styles = {};
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

    clonedGhostkitData.styles = cleanResult;

    setAttributes({ ghostkit: clonedGhostkitData });
  }

  return {
    styles,
    getStyle,
    hasStyle,
    setStyles,
  };
}
