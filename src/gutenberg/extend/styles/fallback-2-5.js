/**
 * Fallback for plugin version <= 2.5.
 * We changed styles output in 2.6 update.
 */

/**
 * Internal dependencies
 */
import { replaceClass, hasClass, removeClass } from '../../utils/classes-replacer';

import getStyles from './get-styles';

/**
 * WordPress dependencies
 */
const { addFilter } = wp.hooks;

const { Component } = wp.element;

const { getBlockType } = wp.blocks;

const { withSelect } = wp.data;

const { createHigherOrderComponent } = wp.compose;

/**
 * Check if classname is old.
 *
 * @param {String} className classname.
 * @returns {Boolean} is old classname.
 */
function isOldClassName(className) {
  return !/^ghostkit-custom-/g.test(className);
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom styles if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withNewAttrs = createHigherOrderComponent((BlockEdit) => {
  class newEdit extends Component {
    constructor(props) {
      super(props);

      const { attributes } = this.props;

      const { ghostkitId, ghostkitClassname } = attributes;

      let { className } = attributes;

      // Run fallback.
      if (ghostkitId && ghostkitClassname && isOldClassName(ghostkitClassname)) {
        // remove old class.
        if (hasClass(className, ghostkitClassname)) {
          className = removeClass(className, ghostkitClassname);
        }

        // add new class.
        className = replaceClass(className, 'ghostkit-custom', ghostkitId);

        // update attributes.
        this.props.attributes.ghostkitClassname = `ghostkit-custom-${ghostkitId}`;
        this.props.attributes.className = className;
      }
    }

    render() {
      return <BlockEdit {...this.props} />;
    }
  }

  return withSelect((select, ownProps) => ({
    blockSettings: getBlockType(ownProps.name),
  }))(newEdit);
}, 'withNewAttrs');

/**
 * Fallback for custom styles from 2.5.0 version.
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 *
 * @return {Object} Filtered props applied to save element.
 */
function addSaveProps(extraProps, blockType, attributes) {
  if (!attributes.ghostkitClassname || !isOldClassName(attributes.ghostkitClassname)) {
    return extraProps;
  }

  const customStyles = attributes.ghostkitStyles ? { ...attributes.ghostkitStyles } : false;

  if (customStyles && 0 !== Object.keys(customStyles).length) {
    let styles = getStyles(customStyles);

    if (blockType.ghostkit && blockType.ghostkit.customStylesFilter) {
      styles = blockType.ghostkit.customStylesFilter(styles, customStyles, false, attributes);
    }

    extraProps['data-ghostkit-styles'] = styles;
  }

  return extraProps;
}

// Init filters.
addFilter('editor.BlockEdit', 'ghostkit/fallback-styles/additional-attributes', withNewAttrs);
addFilter('blocks.getSaveContent.extraProps', 'ghostkit/fallback-styles/save-props', addSaveProps);
