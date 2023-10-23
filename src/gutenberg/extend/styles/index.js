/**
 * External dependencies
 */
import shorthash from 'shorthash';
import deepEqual from 'deep-equal';
import { throttle } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import './deprecated-styles';

import { replaceClass } from '../../utils/classes-replacer';
import { maybeEncode, maybeDecode } from '../../utils/encode-decode';
import EditorStyles from '../../components/editor-styles';

import getStyles from './get-styles';

/**
 * WordPress dependencies
 */
const { merge, cloneDeep } = window.lodash;

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

  const { ghostkit } = attributes;

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
    let { className } = attributes;

    const newAttrs = {};

    // prepare custom block styles.
    let blockCustomStyles = applyFilters(
      'ghostkit.blocks.customStyles',
      blockSettings.ghostkit && blockSettings.ghostkit.customStylesCallback
        ? blockSettings.ghostkit.customStylesCallback(attributes, props)
        : {},
      props
    );

    // We need to clean undefined and empty statements from custom styles list.
    blockCustomStyles = cleanBlockCustomStyles(blockCustomStyles);

    const withBlockCustomStyles = blockCustomStyles && Object.keys(blockCustomStyles).length;
    const withExtensionCustomStyles = ghostkit?.styles && Object.keys(ghostkit.styles).length;

    if (withBlockCustomStyles || withExtensionCustomStyles) {
      const ghostkitID = getGhostKitID(checkDuplicates);

      if (ghostkitID) {
        let updateAttrs = false;

        // TODO: add support for custom class selector.
        // let ghostkitClassName = `.ghostkit-custom-${ghostkitID}`;
        // if (blockSettings.ghostkit && blockSettings.ghostkit.customSelector) {
        //   ghostkitClassName = blockSettings.ghostkit.customSelector(ghostkitClassName, props);
        // }

        if (withBlockCustomStyles) {
          if (!newAttrs.ghostkit) {
            newAttrs.ghostkit = cloneDeep(attributes?.ghostkit || {});
          }

          newAttrs.ghostkit.styles = merge(
            newAttrs.ghostkit?.styles || {},
            maybeEncode(blockCustomStyles)
          );
        }

        if (ghostkitID !== attributes?.ghostkit?.id) {
          if (!newAttrs.ghostkit) {
            newAttrs.ghostkit = cloneDeep(attributes?.ghostkit || {});
          }

          newAttrs.ghostkit.id = ghostkitID;
          updateAttrs = true;
        }

        // Regenerate custom classname if it was removed or changed.
        const newClassName = replaceClass(className, 'ghostkit-custom', ghostkitID);
        if (newClassName !== className) {
          newAttrs.className = newClassName;
        }

        if (withBlockCustomStyles && !updateAttrs) {
          updateAttrs = !deepEqual(attributes?.ghostkit?.styles, newAttrs?.ghostkit?.styles);
        }

        if (updateAttrs) {
          setAttributes(newAttrs);
        }
      }
    } else if (attributes?.ghostkit?.styles) {
      className = replaceClass(className, 'ghostkit-custom', '');

      newAttrs.className = className;

      if (!newAttrs.ghostkit) {
        newAttrs.ghostkit = cloneDeep(attributes?.ghostkit || {});
      }

      if (newAttrs.ghostkit?.styles) {
        delete newAttrs.ghostkit.styles;
      }

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
