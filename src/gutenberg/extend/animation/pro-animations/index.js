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
  mouseHover: {
    label: __('Mouse Hover', '@@text_domain'),
  },
  mousePress: {
    label: __('Mouse Press', '@@text_domain'),
  },
  mouseMove: {
    label: __('Mouse Move', '@@text_domain'),
  },
  scroll: {
    label: __('Scroll', '@@text_domain'),
  },
  loop: {
    label: __('Loop', '@@text_domain'),
  },
};

function AnimationProTools() {
  const [selected, setSelected] = useState(false);

  return (
    <>
      {selected && (
        <div style={{ gridColumn: '1 / -1' }}>
          <ProNote title={__('Advanced Animations', '@@text_domain')}>
            <p>
              {__(
                'Advanced animations are available in the Ghost Kit Pro plugin only.',
                '@@text_domain'
              )}
            </p>
            <ProNote.Button
              target="_blank"
              rel="noopener noreferrer"
              href="https://ghostkit.io/animations/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_animations&utm_content=@@plugin_version"
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
  'ghostkit.extension.animation.tools',
  'ghostkit/extension/animation/pro',
  (children, { props }) => {
    if (pro) {
      return children;
    }

    const hasOneOfProAnimationsSupport = Object.keys(PRESETS).some((k) =>
      hasBlockSupport(props.name, ['ghostkit', 'animation', k])
    );

    if (!hasOneOfProAnimationsSupport) {
      return children;
    }

    return (
      <>
        {children}
        <AnimationProTools {...props} />
      </>
    );
  }
);
