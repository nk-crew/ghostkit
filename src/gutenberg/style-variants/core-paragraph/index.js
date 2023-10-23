/* eslint-disable max-classes-per-file */
/**
 * Internal dependencies
 */
import ResponsiveTabPanel from '../../components/responsive-tab-panel';
import RangeControl from '../../components/range-control';
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
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { Fragment } = wp.element;

const { createHigherOrderComponent } = wp.compose;

const { InspectorControls } = wp.blockEditor;

const { PanelBody } = wp.components;

const { ghostkitVariables } = window;

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
  if (!screen) {
    for (let k = 1; COLUMNS_COUNT_MAX >= k; k += 1) {
      if (hasClass(className, `ghostkit-paragraph-columns-${k}`)) {
        return `${k}`;
      }
    }
  }

  return getActiveClass(className, `ghostkit-paragraph-columns-${screen}`, true);
}

/**
 * Paragraph Columns
 */
function GhostKitParagraphColumns(props) {
  const { attributes, setAttributes } = props;
  const { className } = attributes;

  /**
   * Update columns count class.
   *
   * @param {String} screen - name of screen size.
   * @param {String} val - value for columns count.
   */
  function updateColumns(screen, val) {
    let newClassName = className;

    if (screen) {
      newClassName = replaceClass(newClassName, `ghostkit-paragraph-columns-${screen}`, val);
    } else {
      for (let k = 1; COLUMNS_COUNT_MAX >= k; k += 1) {
        newClassName = removeClass(newClassName, `ghostkit-paragraph-columns-${k}`);
      }

      if (val) {
        newClassName = addClass(newClassName, `ghostkit-paragraph-columns-${val}`);
      }
    }

    setAttributes({
      className: newClassName,
    });
  }

  const filledTabs = {};
  if (
    ghostkitVariables &&
    ghostkitVariables.media_sizes &&
    Object.keys(ghostkitVariables.media_sizes).length
  ) {
    ['', ...Object.keys(ghostkitVariables.media_sizes)].forEach((media) => {
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
              onChange={(value) => updateColumns(tabData.name, value)}
              min={1}
              max={COLUMNS_COUNT_MAX}
            />
          )}
        </ResponsiveTabPanel>
      </PanelBody>
    </InspectorControls>
  );
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
  function GhostKitParagraphWrapper(props) {
    const { name } = props;

    if (name !== 'core/paragraph') {
      return <OriginalComponent {...props} />;
    }

    // add new display controls.
    return (
      <Fragment>
        <OriginalComponent {...props} />
        <GhostKitParagraphColumns {...props} />
      </Fragment>
    );
  }

  return GhostKitParagraphWrapper;
}, 'withInspectorControl');

// Init filters.
addFilter(
  'editor.BlockEdit',
  'ghostkit/core-paragraph/additional-attributes',
  withInspectorControl,
  9
);
