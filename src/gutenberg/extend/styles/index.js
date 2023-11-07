/**
 * External dependencies
 */
import shorthash from 'shorthash';
import deepEqual from 'deep-equal';
import { throttle } from 'throttle-debounce';

/**
 * Internal dependencies
 */
// We can't use lodash merge, because it skip the specified undefined value
// which we use to reset styles.
import merge from '../../utils/merge';
import { replaceClass } from '../../utils/classes-replacer';
import { maybeEncode, maybeDecode } from '../../utils/encode-decode';
import EditorStyles from '../../components/editor-styles';

import getStyles from './get-styles';

/**
 * WordPress dependencies
 */
const { cloneDeep } = window.lodash;

const { applyFilters, addFilter } = wp.hooks;

const { getBlockType } = wp.blocks;

const { useRef, useEffect } = wp.element;

const { useSelect } = wp.data;

const { createHigherOrderComponent } = wp.compose;

/**
 * Custom Styles Component.
 */
function CustomStylesComponent(props) {
  const { setAttributes, attributes, clientId, name } = props;

  const { ghostkit, className } = attributes;

  const { blockSettings } = useSelect(
    () => ({
      blockSettings: getBlockType(name),
    }),
    [name]
  );

  function cleanBlockCustomStyles(styles) {
    const newStyles = {};

    Object.keys(styles).forEach((key) => {
      if (typeof styles[key] !== 'undefined') {
        if (
          typeof styles[key] === 'object' &&
          !Array.isArray(styles[key]) &&
          styles[key] !== null
        ) {
          const innerStyles = cleanBlockCustomStyles(styles[key]);

          if (innerStyles && Object.keys(innerStyles).length) {
            newStyles[key] = innerStyles;
          }
        } else {
          newStyles[key] = styles[key];
        }
      }
    });

    return newStyles;
  }

  /**
   * Get recursive all blocks of the current page
   *
   * @param {boolean} blocks - block list
   *
   * @return {array} block list
   */
  function getAllBlocks(blocks = false) {
    let result = [];

    if (!blocks) {
      blocks = wp.data.select('core/block-editor').getBlocks();
    }

    if (!blocks) {
      return result;
    }

    blocks.forEach((data) => {
      result.push(data);

      if (data.innerBlocks && data.innerBlocks.length) {
        result = [...result, ...getAllBlocks(data.innerBlocks)];
      }
    });

    return result;
  }

  function getGhostKitID(checkDuplicates) {
    let id = ghostkit?.id;

    // create block ID.
    if (!id || checkDuplicates) {
      const usedIds = {};

      // prevent unique ID duplication after block duplicated.
      if (checkDuplicates) {
        const allBlocks = getAllBlocks();
        allBlocks.forEach((data) => {
          if (data.clientId && data?.attributes?.ghostkit?.id) {
            usedIds[data.attributes.ghostkit.id] = data.clientId;

            if (data.clientId !== clientId && data.attributes.ghostkit.id === ghostkit?.id) {
              id = '';
            }
          }
        });
      }

      // prepare new block id.
      if (clientId && !id) {
        let newID = id || '';

        // check if id already exist.
        let tryCount = 10;
        while (
          !newID ||
          (typeof usedIds[newID] !== 'undefined' && usedIds[newID] !== clientId && tryCount > 0)
        ) {
          newID = shorthash.unique(clientId);
          tryCount -= 1;
        }

        if (newID && typeof usedIds[newID] === 'undefined') {
          usedIds[newID] = clientId;
        }

        if (newID !== id) {
          id = newID;
        }
      }
    }

    return id || false;
  }

  function onUpdate(checkDuplicates) {
    const newAttrs = {};

    // prepare custom block styles.
    const blockCustomStyles = applyFilters(
      'ghostkit.blocks.customStyles',
      blockSettings.ghostkit && blockSettings.ghostkit.customStylesCallback
        ? blockSettings.ghostkit.customStylesCallback(attributes, props)
        : {},
      props
    );

    const withBlockCustomStyles = blockCustomStyles && Object.keys(blockCustomStyles).length;
    const withExtensionCustomStyles = ghostkit?.styles && Object.keys(ghostkit.styles).length;

    let reset = !withBlockCustomStyles && !withExtensionCustomStyles;

    if (withBlockCustomStyles || withExtensionCustomStyles) {
      let newStyles = cloneDeep(ghostkit?.styles || {});

      if (withBlockCustomStyles) {
        newStyles = merge(newStyles, maybeEncode(blockCustomStyles));
      }

      // Clean undefined and empty statements from custom styles list.
      if (newStyles) {
        newStyles = cleanBlockCustomStyles(newStyles);
      }

      const hasCustomStyles = Object.keys(newStyles).length;
      const ghostkitID = hasCustomStyles && getGhostKitID(checkDuplicates);

      if (!ghostkitID) {
        reset = true;
      } else {
        // TODO: add support for custom class selector.
        // let ghostkitClassName = `.ghostkit-custom-${ghostkitID}`;
        // if (blockSettings.ghostkit && blockSettings.ghostkit.customSelector) {
        //   ghostkitClassName = blockSettings.ghostkit.customSelector(ghostkitClassName, props);
        // }

        if (ghostkitID !== ghostkit?.id) {
          if (!newAttrs.ghostkit) {
            newAttrs.ghostkit = cloneDeep(ghostkit || {});
          }

          newAttrs.ghostkit.id = ghostkitID;
        }

        // Regenerate custom classname if it was removed or changed.
        const newClassName = replaceClass(className, 'ghostkit-custom', ghostkitID);
        if (newClassName !== className) {
          newAttrs.className = newClassName;
        }

        // Check if styles changes and update it.
        if (!deepEqual(ghostkit?.styles, newStyles)) {
          if (!newAttrs.ghostkit) {
            newAttrs.ghostkit = cloneDeep(ghostkit || {});
          }

          newAttrs.ghostkit.styles = newStyles;
        }
      }
    }

    // Reset unused styles and ID.
    if (reset) {
      const newClassName = replaceClass(className, 'ghostkit-custom', '');

      if (newClassName !== className) {
        newAttrs.className = !newClassName ? undefined : newClassName;
      }

      if (ghostkit?.styles || ghostkit?.id) {
        if (!newAttrs.ghostkit) {
          newAttrs.ghostkit = cloneDeep(ghostkit || {});
        }

        if (newAttrs?.ghostkit?.styles) {
          delete newAttrs.ghostkit.styles;
        }

        if (newAttrs?.ghostkit?.id) {
          delete newAttrs.ghostkit.id;
        }
      }

      // Reset ghostkit attribute if empty.
      if (newAttrs?.ghostkit && !Object.keys(newAttrs.ghostkit).length) {
        newAttrs.ghostkit = undefined;
      }
    }

    // Update attributes.
    if (Object.keys(newAttrs).length) {
      setAttributes(newAttrs);
    }
  }

  const onUpdateThrottle = throttle(60, onUpdate);

  const didMountRef = useRef(false);

  useEffect(() => {
    // Did update.
    if (didMountRef.current) {
      onUpdateThrottle();

      // Did mount.
    } else {
      didMountRef.current = true;

      onUpdate(true);
    }
  }, [attributes]);

  let styles = '';

  // generate custom styles.
  if (ghostkit?.id) {
    // New custom styles.
    if (ghostkit?.styles && Object.keys(ghostkit?.styles).length) {
      styles +=
        (styles ? ' ' : '') +
        getStyles(
          maybeDecode({
            [`.ghostkit-custom-${ghostkit?.id}`]: ghostkit?.styles,
          }),
          '',
          false
        );
    }

    if (
      styles &&
      blockSettings &&
      blockSettings.ghostkit &&
      blockSettings.ghostkit.customStylesFilter
    ) {
      styles = blockSettings.ghostkit.customStylesFilter(
        styles,
        maybeDecode(attributes?.ghostkit?.styles),
        true,
        attributes
      );
    }
  }

  // filter custom styles.
  styles = applyFilters('ghostkit.editor.customStylesOutput', styles, props);

  if (!styles) {
    return null;
  }

  return <EditorStyles styles={window.GHOSTKIT.replaceVars(styles)} />;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom styles if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withNewAttrs = createHigherOrderComponent(
  (BlockEdit) =>
    function (props) {
      return (
        <>
          <BlockEdit {...props} />
          <CustomStylesComponent {...props} />
        </>
      );
    },
  'withNewAttrs'
);

// Init filters.
addFilter('editor.BlockEdit', 'ghostkit/styles/additional-attributes', withNewAttrs);
