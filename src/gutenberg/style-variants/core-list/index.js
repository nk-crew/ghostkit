/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
/**
 * External dependencies
 */
import { throttle } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import ResponsiveTabPanel from '../../components/responsive-tab-panel';
import EditorStyles from '../../components/editor-styles';
import {
  getActiveClass,
  replaceClass,
  addClass,
  removeClass,
  hasClass,
} from '../../utils/classes-replacer';

/**
 * WordPress dependencies
 */
const { jQuery: $ } = window;

const { merge } = window.lodash;

const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { Component, Fragment } = wp.element;

const { registerBlockStyle } = wp.blocks;

const { createHigherOrderComponent } = wp.compose;

const { InspectorControls } = wp.blockEditor;

const { PanelBody, RangeControl } = wp.components;

const { ghostkitVariables } = window;

/**
 * Register additional list styles.
 */
registerBlockStyle('core/list', {
  name: 'styled',
  label: __('Styled', '@@text_domain'),
});
registerBlockStyle('core/list', {
  name: 'icon',
  label: __('Icon', '@@text_domain'),
});
registerBlockStyle('core/list', {
  name: 'none',
  label: __('None', '@@text_domain'),
});

/**
 * Icon Lists Extension.
 */

/**
 * Extend block attributes with unique id.
 *
 * @param {Object} blockSettings Original block settings.
 * @param {String} name Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute(blockSettings, name) {
  if (name === 'core/list') {
    if (!blockSettings.attributes.ghostkitListIcon) {
      blockSettings.attributes.ghostkitListIcon = {
        type: 'string',
      };
    }
    if (!blockSettings.attributes.ghostkitListIconColor) {
      blockSettings.attributes.ghostkitListIconColor = {
        type: 'string',
      };
    }
  }

  return blockSettings;
}

const COLUMNS_COUNT_MAX = 6;

/**
 * Get current columns count for selected screen size.
 *
 * @param {String} className - block className.
 * @param {String} screen - name of screen size.
 *
 * @returns {String} columns value.
 */
function getCurrentColumns(className, screen) {
  if (!screen || screen === 'all') {
    for (let k = 1; COLUMNS_COUNT_MAX >= k; k += 1) {
      if (hasClass(className, `ghostkit-list-columns-${k}`)) {
        return `${k}`;
      }
    }
  }

  return getActiveClass(className, `ghostkit-list-columns-${screen}`, true);
}

/**
 * List Columns
 */
class GhostKitListColumns extends Component {
  constructor(props) {
    super(props);

    this.updateColumns = this.updateColumns.bind(this);
  }

  /**
   * Update columns count class.
   *
   * @param {String} screen - name of screen size.
   * @param {String} val - value for columns count.
   */
  updateColumns(screen, val) {
    const { attributes, setAttributes } = this.props;

    const { className } = attributes;

    let newClassName = className;

    if (screen && screen !== 'all') {
      newClassName = replaceClass(newClassName, `ghostkit-list-columns-${screen}`, val);
    } else {
      for (let k = 1; COLUMNS_COUNT_MAX >= k; k += 1) {
        newClassName = removeClass(newClassName, `ghostkit-list-columns-${k}`);
      }

      if (val) {
        newClassName = addClass(newClassName, `ghostkit-list-columns-${val}`);
      }
    }

    setAttributes({
      className: newClassName,
    });
  }

  render() {
    const { attributes } = this.props;

    const { className } = attributes;

    const filledTabs = {};
    if (
      ghostkitVariables &&
      ghostkitVariables.media_sizes &&
      Object.keys(ghostkitVariables.media_sizes).length
    ) {
      ['all', ...Object.keys(ghostkitVariables.media_sizes)].forEach((media) => {
        filledTabs[media] = !!getCurrentColumns(className, media);
      });
    }

    // add new display controls.
    return (
      <InspectorControls>
        <PanelBody title={__('Columns Settings', '@@text_domain')} initialOpen>
          <ResponsiveTabPanel filledTabs={filledTabs}>
            {(tabData) => (
              <RangeControl
                label={__('Columns Count', '@@text_domain')}
                value={parseInt(getCurrentColumns(className, tabData.name), 10)}
                onChange={(value) => this.updateColumns(tabData.name, value)}
                min={1}
                max={COLUMNS_COUNT_MAX}
              />
            )}
          </ResponsiveTabPanel>
        </PanelBody>
      </InspectorControls>
    );
  }
}

/**
 * Custom Styles for Start and Reversed attributes of lists.
 */
class GhostKitListStartAndReversedCustomStyles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsCount: 0,
    };

    this.onUpdate = throttle(120, this.onUpdate.bind(this));
  }

  componentDidMount() {
    this.onUpdate(true);
  }

  componentDidUpdate() {
    this.onUpdate();
  }

  onUpdate() {
    const { clientId } = this.props;

    this.setState({
      itemsCount: $(`[data-block="${clientId}"]`).children().length,
    });
  }

  render() {
    const { attributes, clientId } = this.props;

    const { itemsCount } = this.state;

    const { start, reversed: isReversed } = attributes;

    let styles = '';

    if (isReversed) {
      styles += `counter-reset: li ${(start || itemsCount) + 1}`;
    } else if (start) {
      styles += `counter-reset: li ${start - 1}`;
    }

    if (!styles) {
      return null;
    }

    const customStylesRender = [{ css: `[data-block="${clientId}"].wp-block { ${styles} }` }];

    return <EditorStyles styles={customStylesRender} />;
  }
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom display if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent((OriginalComponent) => {
  class GhostKitIconListWrapper extends Component {
    render() {
      const { props } = this;

      const { setAttributes, attributes } = props;

      const { ghostkitListIcon, ghostkitListIconColor, className } = attributes;

      if (props.name !== 'core/list') {
        return <OriginalComponent {...props} />;
      }

      if (!hasClass(className, 'is-style-icon')) {
        return (
          <Fragment>
            <OriginalComponent {...props} />
            <GhostKitListColumns {...props} />
            <GhostKitListStartAndReversedCustomStyles {...props} />
          </Fragment>
        );
      }

      // add new display controls.
      return (
        <Fragment>
          <OriginalComponent {...props} setState={this.setState} />
          <GhostKitListColumns {...props} />
          <InspectorControls>
            <PanelBody title={__('Icon Settings', '@@text_domain')} initialOpen>
              <IconPicker
                label={__('Icon', '@@text_domain')}
                value={ghostkitListIcon}
                onChange={(value) => setAttributes({ ghostkitListIcon: value })}
              />
              <ColorPicker
                label={__('Color', '@@text_domain')}
                value={ghostkitListIconColor}
                onChange={(val) => setAttributes({ ghostkitListIconColor: val })}
                alpha
              />
            </PanelBody>
          </InspectorControls>
        </Fragment>
      );
    }
  }

  return GhostKitIconListWrapper;
}, 'withInspectorControl');

/**
 * Add custom styles to element in editor.
 *
 * @param {Object} customStyles Additional element styles object.
 * @param {Object} props Element props.
 *
 * @return {Object} Additional element styles object.
 */
function addEditorCustomStyles(customStyles, props) {
  const result = {};

  if (props.name !== 'core/list' || !hasClass(props.attributes.className, 'is-style-icon')) {
    return customStyles;
  }

  if (props.attributes.ghostkitListIcon) {
    result[
      '--gkt-icon-lists--decoration'
    ] = `url('data:image/svg+xml;utf8,${props.attributes.ghostkitListIcon}')`;
  }
  if (props.attributes.ghostkitListIconColor) {
    result['--gkt-icon-lists--decoration__color'] = props.attributes.ghostkitListIconColor;
  }

  if (props.attributes.ghostkitListIcon || props.attributes.ghostkitListIconColor) {
    customStyles = merge(customStyles, result);
  }

  return customStyles;
}

// Init filters.
addFilter('blocks.registerBlockType', 'ghostkit/icon-list/additional-attributes', addAttribute);
addFilter('editor.BlockEdit', 'ghostkit/icon-list/additional-attributes', withInspectorControl, 9);
addFilter(
  'ghostkit.blocks.customStyles',
  'ghostkit/icon-list/editor-custom-styles',
  addEditorCustomStyles
);
