/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { createBlock } from '@wordpress/blocks';

import { registerPlugin } from '@wordpress/plugins';

import { render } from '@wordpress/element';

import { useDispatch } from '@wordpress/data';

import { ToolbarButton } from '@wordpress/components';

const { GHOSTKIT } = window;

/**
 * Add templates button to Gutenberg toolbar
 */
function ToolbarTemplates() {
  const { insertBlocks } = useDispatch('core/block-editor');

  if (!GHOSTKIT.allowTemplates) {
    return null;
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  function LibraryButton() {
    return (
      <ToolbarButton
        className="components-button components-icon-button"
        aria-label={__('Add Template', 'ghostkit')}
        onClick={() => {
          insertBlocks(
            createBlock('ghostkit/grid', {
              isTemplatesModalOnly: true,
            })
          );
        }}
      >
        {getIcon('plugin-templates')}
        {__('Templates Library', 'ghostkit')}
      </ToolbarButton>
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
