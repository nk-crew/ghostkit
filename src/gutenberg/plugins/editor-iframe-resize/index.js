/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import useResponsive from '../../hooks/use-responsive';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { render } = wp.element;

const { DropdownMenu, MenuGroup, MenuItem } = wp.components;

const { useSelect } = wp.data;

const { PostPreviewButton } = wp.editor;

export const name = 'gkt-editor-iframe-resize';

/**
 * Resize editor iframe based on responsive size selected.
 */
function IframeResponsiveStyles() {
  const { device, allDevices } = useResponsive();

  if (!device) {
    return null;
  }

  let width = allDevices[device];
  let height = '100%';
  let marginVertical = '0px';

  if (device === 'sm') {
    // Set smaller width for mobile screen.
    if (width > 375) {
      width = 375;
    }

    height = `${(width * 16) / 7.5}px`;
    marginVertical = '36px';
  } else if (device === 'md' || device === 'lg') {
    height = `${(width * 3) / 4}px`;
    marginVertical = '36px';
  }

  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
          .edit-post-visual-editor__content-area > div {
            width: ${width}px !important;
            height: ${height} !important;
            margin: ${marginVertical} auto !important;
            border-radius: 2px !important;
            border: 1px solid rgb(221, 221, 221) !important;
            overflow-y: auto !important;
          }
        `,
      }}
    />
  );
}

function ResponsiveToggleDropdown() {
  const { device, setDevice, allDevices } = useResponsive();

  const { hasActiveMetaboxes, isViewable } = useSelect((select) => {
    const { getEditedPostAttribute } = select('core/editor');
    const { getPostType } = select('core');
    const postType = getPostType(getEditedPostAttribute('type'));

    return {
      hasActiveMetaboxes: select('core/edit-post').hasMetaBoxes(),
      isViewable: postType?.viewable ?? false,
    };
  }, []);

  const items = [];
  const icons = [
    getIcon('tabs-mobile'),
    getIcon('tabs-tablet'),
    getIcon('tabs-laptop'),
    getIcon('tabs-desktop'),
    getIcon('tabs-tv'),
  ];

  let selectedIcon = icons[icons.length - 1];

  [...Object.keys(allDevices), ''].forEach((deviceName, i) => {
    if (deviceName === device) {
      selectedIcon = icons[i];
    }

    let title = __('Desktop', '@@text_domain');

    switch (deviceName) {
      case 'sm':
        title = __('Mobile', '@@text_domain');
        break;
      case 'md':
        title = __('Mobile Landscape', '@@text_domain');
        break;
      case 'lg':
        title = __('Tablet', '@@text_domain');
        break;
      case 'xl':
        title = __('Laptop', '@@text_domain');
        break;
      // no default
    }

    items.unshift({
      name: deviceName,
      icon: icons[i],
      title,
    });
  });

  return (
    <>
      <DropdownMenu
        className="ghostkit-toolbar-responsive__dropdown"
        popoverProps={{
          className: 'ghostkit-toolbar-responsive__dropdown-content',
          placement: 'bottom-end',
        }}
        toggleProps={{
          className: 'ghostkit-toolbar-responsive__button-toggle',
        }}
        menuProps={{
          'aria-label': __('View options', '@@text_domain'),
        }}
        icon={selectedIcon}
        label={__('Responsive Preview', '@@text_domain')}
      >
        {({ onClose }) => (
          <>
            <MenuGroup>
              {items.map((data) => {
                return (
                  <MenuItem
                    key={data.name}
                    className={device === data.name && 'is-active'}
                    onClick={() => setDevice(data.name)}
                    icon={data.icon}
                  >
                    {data.title}
                  </MenuItem>
                );
              })}
            </MenuGroup>
            {isViewable && (
              <MenuGroup>
                <div className="edit-post-header-preview__grouping-external">
                  <PostPreviewButton
                    className="edit-post-header-preview__button-external"
                    role="menuitem"
                    forceIsAutosaveable={hasActiveMetaboxes}
                    textContent={
                      <>
                        {__('Preview in new tab')}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M19.5 4.5h-7V6h4.44l-5.97 5.97 1.06 1.06L18 7.06v4.44h1.5v-7Zm-13 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3H17v3a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h3V5.5h-3Z" />
                        </svg>
                      </>
                    }
                    onPreview={onClose}
                  />
                </div>
              </MenuGroup>
            )}
          </>
        )}
      </DropdownMenu>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
          .interface-interface-skeleton__header {
            z-index: 91;
          }
        `,
        }}
      />
    </>
  );
}

/**
 * Add dropdown toggle to toolbar.
 */
function ToolbarResponsiveToggle() {
  const checkElement = async (selector) => {
    while (document.querySelector(selector) === null) {
      // eslint-disable-next-line no-promise-executor-return, no-await-in-loop
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector);
  };

  checkElement('.edit-post-header__settings').then(($toolbar) => {
    if (!$toolbar.querySelector('.ghostkit-toolbar-responsive')) {
      const $toolbarPlace = document.createElement('div');
      $toolbarPlace.classList.add('ghostkit-toolbar-responsive');

      $toolbar.prepend($toolbarPlace);

      render(<ResponsiveToggleDropdown />, $toolbarPlace);
    }
  });

  return null;
}

export function Plugin() {
  return (
    <>
      <ToolbarResponsiveToggle />
      <IframeResponsiveStyles />
    </>
  );
}
