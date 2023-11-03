/**
 * Internal dependencies
 */
import ProNote from '../../../components/pro-note';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { useState } = wp.element;

const { hasBlockSupport } = wp.blocks;

const { ToolsPanelItem: __stableToolsPanelItem, __experimentalToolsPanelItem } = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { pro } = window.GHOSTKIT;

const PRESETS = {
  translate: {
    label: __('Translate', '@@text_domain'),
  },
  scale: {
    label: __('Scale', '@@text_domain'),
  },
  rotate: {
    label: __('Rotate', '@@text_domain'),
  },
  skew: {
    label: __('Skew', '@@text_domain'),
  },
  perspective: {
    label: __('Perspective', '@@text_domain'),
  },
  origin: {
    label: __('Origin', '@@text_domain'),
  },
};

function TransformProTools() {
  const [selected, setSelected] = useState(false);

  return (
    <>
      {selected && (
        <div style={{ gridColumn: '1 / -1' }}>
          <ProNote title={__('Pro Transformations', '@@text_domain')}>
            <p>
              {__(
                'Adding transformations for normal and hover state are available in the Ghost Kit Pro plugin only.',
                '@@text_domain'
              )}
            </p>
            <ProNote.Button
              target="_blank"
              rel="noopener noreferrer"
              href="https://ghostkit.io/extensions/transform/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_transform&utm_content=@@plugin_version"
            >
              {__('Read More', '@@text_domain')}
            </ProNote.Button>
          </ProNote>
        </div>
      )}
      {Object.keys(PRESETS).map((k) => (
        <ToolsPanelItem
          key={k}
          label={PRESETS[k].label}
          hasValue={() => false}
          onDeselect={() => {}}
          onSelect={() => {
            setSelected(true);
          }}
          isShownByDefault={false}
        />
      ))}
    </>
  );
}

addFilter(
  'ghostkit.extension.transform.tools',
  'ghostkit/extension/transform/pro',
  (children, { props }) => {
    if (pro) {
      return children;
    }

    const hasTransformSupport = hasBlockSupport(props.name, ['ghostkit', 'transform']);

    if (!hasTransformSupport) {
      return children;
    }

    return (
      <>
        {children}
        <TransformProTools {...props} />
      </>
    );
  }
);
