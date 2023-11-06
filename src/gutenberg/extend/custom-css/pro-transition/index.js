/**
 * Internal dependencies
 */
import ProNote from '../../../components/pro-note';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { ToolsPanelItem: __stableToolsPanelItem, __experimentalToolsPanelItem } = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

const { pro } = window.GHOSTKIT;

function ProTransitionTools() {
  return (
    <ToolsPanelItem
      label={__('Transition', '@@text_domain')}
      hasValue={() => false}
      onSelect={() => {}}
      onDeselect={() => {}}
      isShownByDefault={false}
    >
      <div style={{ gridColumn: '1 / -1' }}>
        <ProNote title={__('Transition', '@@text_domain')}>
          <p>
            {__(
              'Transition and transform configurations are available in the Ghost Kit Pro plugin only.',
              '@@text_domain'
            )}
          </p>
          <ProNote.Button
            target="_blank"
            rel="noopener noreferrer"
            href="https://ghostkit.io/extensions/custom-css/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_transition&utm_content=@@plugin_version"
          >
            {__('Read More', '@@text_domain')}
          </ProNote.Button>
        </ProNote>
      </div>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.customCSS.tools',
  'ghostkit/extension/customCSS/tools/transition',
  (children, { props }) => {
    if (pro) {
      return children;
    }

    const hasTransitionSupport = hasBlockSupport(props.name, [
      'ghostkit',
      'customCSS',
      'transition',
    ]);

    if (!hasTransitionSupport) {
      return children;
    }

    return (
      <>
        {children}
        <ProTransitionTools {...props} />
      </>
    );
  }
);
