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
  componentDidMount() {
    const { insertBlocks } = this.props;

    const $toolbar = document.querySelector('.edit-post-header__toolbar');

    if ($toolbar) {
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 8.583a.75.75 0 000 1.5v-1.5zm16 1.5a.75.75 0 100-1.5v1.5zM8.583 20a.75.75 0 001.5 0h-1.5zm1.5-10.667a.75.75 0 10-1.5 0h1.5zM5.778 4.75h12.444v-1.5H5.778v1.5zm12.444 0c.568 0 1.028.46 1.028 1.028h1.5a2.528 2.528 0 00-2.528-2.528v1.5zm1.028 1.028v12.444h1.5V5.778h-1.5zm0 12.444c0 .568-.46 1.028-1.028 1.028v1.5a2.528 2.528 0 002.528-2.528h-1.5zm-1.028 1.028H5.778v1.5h12.444v-1.5zm-12.444 0c-.568 0-1.028-.46-1.028-1.028h-1.5a2.528 2.528 0 002.528 2.528v-1.5zM4.75 18.222V5.778h-1.5v12.444h1.5zm0-12.444c0-.568.46-1.028 1.028-1.028v-1.5A2.528 2.528 0 003.25 5.778h1.5zM4 10.083h16v-1.5H4v1.5zM10.083 20V9.333h-1.5V20h1.5z"
              fill="currentColor"
            />
          </svg>
          {__('Add Template', '@@text_domain')}
        </button>
      );

      const $toolbarPlace = document.createElement('div');
      $toolbarPlace.classList.add('ghostkit-toolbar-templates');

      $toolbar.appendChild($toolbarPlace);

      render(<LibraryButton />, $toolbarPlace);
    }
  }

  render() {
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
