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

const { render } = wp.element;

const { useDispatch } = wp.data;

/**
 * Add templates button to Gutenberg toolbar
 */
function ToolbarTemplates() {
  const { insertBlocks } = useDispatch('core/block-editor');

  // eslint-disable-next-line react/no-unstable-nested-components
  function LibraryButton() {
    return (
      <button
        type="button"
        className="components-button components-icon-button"
        aria-label={__('Add Template', '@@text_domain')}
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
  }

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

registerPlugin('gkt-toolbar-templates', {
  render: ToolbarTemplates,
});
