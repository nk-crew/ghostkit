/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { createBlock } = wp.blocks;

const { registerPlugin } = wp.plugins;

const { Component, render } = wp.element;

const { compose } = wp.compose;

const { withDispatch } = wp.data;

/**
 * Add templates button to Gutenberg toolbar
 */
class ToolbarTemplates extends Component {
  render() {
    const { insertBlocks } = this.props;

    // eslint-disable-next-line react/no-unstable-nested-components
    const LibraryButton = () => (
      <button
        type="button"
        className="components-button components-icon-button"
        ariaLabel={__('Add Template', '@@text_domain')}
        onClick={(e) => {
          e.preventDefault();

          insertBlocks(
            createBlock('ghostkit/grid', {
              isTemplatesModalOnly: true,
            })
          );
        }}
      >
        {getIcon('plugin-templates')}
        {__('Templates Library', '@@text_domain')}
      </button>
    );

    const checkElement = async (selector) => {
      while (document.querySelector(selector) === null) {
        // eslint-disable-next-line no-promise-executor-return, no-await-in-loop
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      return document.querySelector(selector);
    };

    checkElement('.edit-post-header-toolbar').then(($toolbar) => {
      if (!$toolbar.querySelector('.ghostkit-toolbar-templates')) {
        const $toolbarPlace = document.createElement('div');
        $toolbarPlace.classList.add('ghostkit-toolbar-templates');

        $toolbar.appendChild($toolbarPlace);

        render(<LibraryButton />, $toolbarPlace);
      }
    });

    return null;
  }
}

registerPlugin('gkt-toolbar-templates', {
  render: compose(
    withDispatch((dispatch) => {
      const { insertBlocks } = dispatch('core/block-editor');

      return {
        insertBlocks,
      };
    })
  )(ToolbarTemplates),
});
