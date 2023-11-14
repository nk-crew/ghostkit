/**
 * Internal dependencies
 */
import { EXTENSIONS } from '../constants';

import usePasteExtensions from './use-paste-extensions';

/**
 * WordPress dependencies
 */
const { __, _n, sprintf } = wp.i18n;

const { addFilter } = wp.hooks;

const { hasBlockSupport, serialize } = wp.blocks;

const { useSelect, useDispatch } = wp.data;

const { BlockSettingsMenuControls } = wp.blockEditor;

const { MenuGroup, MenuItem, Dropdown } = wp.components;

const { useCopyToClipboard } = wp.compose;

const { store: noticesStore } = wp.notices;

function CopyMenuItem({ blocks, onCopy, children }) {
  const ref = useCopyToClipboard(() => serialize(blocks), onCopy);

  return <MenuItem ref={ref}>{children}</MenuItem>;
}

function blocksHasSupport(blocks, support) {
  return blocks.every((block) => {
    return !!block && hasBlockSupport(block.name, support);
  });
}

/**
 * Add block action controls.
 */
function GhostKitExtensionCopyPaste(original, { props }) {
  const { name, clientId } = props;

  const hasExtensionsSupport = hasBlockSupport(name, ['ghostkit']);

  const { createSuccessNotice } = useDispatch(noticesStore);
  const { getBlocksByClientId } = useSelect((select) => {
    return select('core/block-editor');
  });

  const pasteExtensions = usePasteExtensions();

  if (!hasExtensionsSupport) {
    return original;
  }

  return (
    <>
      {original}
      <BlockSettingsMenuControls>
        {(menuProps) => {
          if (menuProps.firstBlockClientId !== clientId) {
            return null;
          }

          const blocks = getBlocksByClientId(menuProps.selectedClientIds);

          const canCopyExtensions = blocksHasSupport(blocks, 'ghostkit');

          if (!canCopyExtensions) {
            return null;
          }

          return (
            <MenuGroup
              className="ghostkit-block-actions-copy-paste"
              label={__('Ghost Kit', '@@text_domain')}
            >
              <CopyMenuItem
                blocks={blocks}
                onCopy={() => {
                  createSuccessNotice(
                    sprintf(
                      // Translators: %d: Number of blocks being copied.
                      _n(
                        'Copied %d block to clipboard.',
                        'Copied %d blocks to clipboard.',
                        blocks.length
                      ),
                      blocks.length
                    ),
                    {
                      type: 'snackbar',
                    }
                  );
                }}
              >
                {__('Copy extensions', '@@text_domain')}
              </CopyMenuItem>

              <Dropdown
                className="ghostkit-block-actions-dropdown-paste"
                popoverProps={{
                  placement: 'right-start',
                  offset: 36,
                  shift: true,
                }}
                renderToggle={({ isOpen, onToggle }) => (
                  <MenuItem
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    icon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.6 6.5L16 12L11.6 17.5L10.4 16.6L14 12L10.4 7.5L11.6 6.5Z"
                          fill="black"
                        />
                      </svg>
                    }
                  >
                    {__('Paste extensions', '@@text_domain')}
                  </MenuItem>
                )}
                renderContent={() => (
                  <MenuGroup className="ghostkit-block-actions-dropdown-paste-menu">
                    <MenuItem
                      onClick={() => {
                        pasteExtensions(blocks);
                      }}
                    >
                      {__('Paste All', '@@text_domain')}
                    </MenuItem>
                    {Object.keys(EXTENSIONS).map((extName) => {
                      if (!blocksHasSupport(blocks, ['ghostkit', extName])) {
                        return null;
                      }

                      return (
                        <MenuItem
                          key={extName}
                          onClick={() => {
                            pasteExtensions(blocks, extName);
                          }}
                        >
                          {EXTENSIONS[extName].label}
                        </MenuItem>
                      );
                    })}
                  </MenuGroup>
                )}
              />
            </MenuGroup>
          );
        }}
      </BlockSettingsMenuControls>
    </>
  );
}

// Init filters.
addFilter(
  'ghostkit.editor.extensions',
  'ghostkit/extension/copy-paste',
  GhostKitExtensionCopyPaste
);
