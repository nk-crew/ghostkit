/**
 * WordPress dependencies
 */
const { cloneDeep } = window.lodash;

const { applyFilters, addFilter } = wp.hooks;

const { Fragment, useEffect } = wp.element;

const { createHigherOrderComponent } = wp.compose;

const { GHOSTKIT } = window;

/**
 * Custom Styles Component.
 */
function DeprecatedStyles(props) {
  const { setAttributes, attributes } = props;
  const { ghostkitId, ghostkitClassname, ghostkitStyles } = attributes;

  useEffect(() => {
    // Migration to new attribute.
    if (ghostkitId || ghostkitClassname || ghostkitStyles) {
      const newAttributes = {
        ghostkitId: undefined,
        ghostkitClassname: undefined,
        ghostkitStyles: undefined,
      };

      const ghostkitData = cloneDeep(attributes?.ghostkit || {});

      if (ghostkitId && !ghostkitData?.id) {
        ghostkitData.id = ghostkitId;

        newAttributes.ghostkit = ghostkitData;
      }

      // Update attributes.
      setAttributes(newAttributes);
    }
  }, []);

  return null;
}

/**
 * Extend block attributes with styles.
 *
 * @param {Object} blockSettings Original block settings.
 * @param {String} name Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute(blockSettings, name) {
  let allow = false;

  // prepare settings of block + deprecated blocks.
  const eachSettings = [blockSettings];
  if (blockSettings.deprecated && blockSettings.deprecated.length) {
    blockSettings.deprecated.forEach((item) => {
      eachSettings.push(item);
    });
  }

  eachSettings.forEach((settings) => {
    allow = false;

    if (settings && settings.attributes) {
      if (GHOSTKIT.hasBlockSupport(settings || blockSettings, 'styles', false)) {
        allow = true;
      } else {
        allow = applyFilters(
          'ghostkit.blocks.allowCustomStyles',
          false,
          settings,
          settings.name || blockSettings.name
        );
      }
    }

    if (allow) {
      if (!settings.attributes.ghostkitStyles) {
        settings.attributes.ghostkitStyles = {
          type: 'object',
          default: '',
        };
      }
      if (!settings.attributes.ghostkitClassname) {
        settings.attributes.ghostkitClassname = {
          type: 'string',
          default: '',
        };
      }
      if (!settings.attributes.ghostkitId) {
        settings.attributes.ghostkitId = {
          type: 'string',
          default: '',
        };
      }

      settings = applyFilters('ghostkit.blocks.withCustomStyles', settings, name);
    }
  });

  return blockSettings;
}

/**
 * Extend block attributes with styles after block transformation
 *
 * @param {Object} transformedBlock Original transformed block.
 * @param {Object} blocks           Blocks on which transform was applied.
 *
 * @return {Object} Modified transformed block, with layout preserved.
 */
function addAttributeTransform(transformedBlock, blocks) {
  if (
    blocks &&
    blocks[0] &&
    blocks[0].clientId === transformedBlock.clientId &&
    blocks[0].attributes &&
    blocks[0].attributes.ghostkitStyles &&
    Object.keys(blocks[0].attributes.ghostkitStyles).length
  ) {
    Object.keys(blocks[0].attributes).forEach((attrName) => {
      if (/^ghostkit/.test(attrName)) {
        transformedBlock.attributes[attrName] = blocks[0].attributes[attrName];
      }
    });
  }

  return transformedBlock;
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
          <DeprecatedStyles {...props} />
        </>
      );
    },
  'withNewAttrs'
);

// Init filters.
addFilter(
  'blocks.registerBlockType',
  'ghostkit/deprecated-styles/additional-attributes',
  addAttribute
);
addFilter(
  'blocks.switchToBlockType.transformedBlock',
  'ghostkit/deprecated-styles/additional-attributes',
  addAttributeTransform
);
addFilter('editor.BlockEdit', 'ghostkit/styles/additional-attributes', withNewAttrs);
