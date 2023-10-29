/**
 * Internal dependencies
 */
import './styles';
import './frame';
import './position';
import './spacings';
import './custom-css';
import './display';
import './effects';
import './toc-headings';
import './toolbar-templates';

import ApplyFilters from '../components/apply-filters';

/**
 * WordPress dependencies
 */
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { hasBlockSupport } = wp.blocks;

/**
 * Override the default edit UI to include GhostKit extensions
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withGhostKitExtensions = createHigherOrderComponent((OriginalComponent) => {
  function GhostKitExtensionsWrapper(props) {
    const hasExtensionsSupport = hasBlockSupport(props.name, ['ghostkit']);

    if (!hasExtensionsSupport) {
      return <OriginalComponent {...props} />;
    }

    return (
      <>
        <OriginalComponent {...props} />
        <ApplyFilters name="ghostkit.editor.extensions" props={props} />
      </>
    );
  }

  return GhostKitExtensionsWrapper;
}, 'withGhostKitExtensions');

addFilter('editor.BlockEdit', 'ghostkit/extensions', withGhostKitExtensions);
