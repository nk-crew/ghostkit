/**
 * Internal dependencies
 */
import ProNote from '../../../components/pro-note';
import DropdownPicker from '../../../components/dropdown-picker';
import EditorStyles from '../../../components/editor-styles';
import TransitionSelector from '../../../components/transition-selector';
import TransitionPresetsControl from '../../../components/transition-presets-control';

import DEFAULTS from './defaults';

/**
 * WordPress dependencies
 */
const { cloneDeep } = window.lodash;

const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const {
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
  NumberControl: __stableNumberControl,
  __experimentalNumberControl,
  Grid: __stableGrid,
  __experimentalGrid,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;
const NumberControl = __stableNumberControl || __experimentalNumberControl;
const Grid = __stableGrid || __experimentalGrid;

const { hasBlockSupport } = wp.blocks;

function EffectsRevealTools(props) {
  const { attributes, setAttributes, clientId } = props;

  const hasReveal = attributes?.ghostkit?.effects?.reveal;

  function getValue(prop, defaultValue) {
    if (typeof attributes?.ghostkit?.effects?.reveal?.[prop] === 'undefined') {
      return defaultValue;
    }

    return attributes.ghostkit.effects.reveal[prop];
  }

  function updateValue(newData, reset = false) {
    const ghostkitData = cloneDeep(attributes?.ghostkit || {});

    if (typeof ghostkitData?.effects === 'undefined') {
      ghostkitData.effects = {};
    }

    // Reset all values except transition.
    if (reset || typeof ghostkitData?.effects?.reveal === 'undefined') {
      if (ghostkitData.effects.reveal?.transition) {
        ghostkitData.effects.reveal = {
          transition: ghostkitData.effects.reveal.transition,
        };
      } else {
        ghostkitData.effects.reveal = {};
      }
    }

    Object.keys(newData).forEach((prop) => {
      ghostkitData.effects.reveal[prop] = newData[prop];
    });

    setAttributes({ ghostkit: ghostkitData });
  }

  return (
    <ToolsPanelItem
      label={__('Reveal', '@@text_domain')}
      hasValue={() => !!hasReveal}
      onSelect={() => {
        if (typeof attributes?.ghostkit?.effects?.reveal === 'undefined') {
          const ghostkitData = cloneDeep(attributes?.ghostkit || {});

          ghostkitData.effects = {
            ...ghostkitData.effects,
            reveal: {
              opacity: 0,
            },
          };

          setAttributes({ ghostkit: ghostkitData });
        }
      }}
      onDeselect={() => {
        if (typeof attributes?.ghostkit?.effects?.reveal !== 'undefined') {
          const ghostkitData = cloneDeep(attributes?.ghostkit || {});

          delete ghostkitData?.effects?.reveal;

          setAttributes({ ghostkit: ghostkitData });
        }
      }}
      isShownByDefault={false}
    >
      <DropdownPicker
        label={__('Reveal', '@@text_domain')}
        contentClassName="ghostkit-component-effects-reveal"
      >
        <EditorStyles
          styles={`
              [data-block="${clientId}"] {
                transform: translateX(${getValue('x', DEFAULTS.x)}px) translateY(${getValue(
            'y',
            DEFAULTS.y
          )}px) scale(${getValue('scale', DEFAULTS.scale)}) rotate(${getValue(
            'rotate',
            DEFAULTS.rotate
          )}deg);
                opacity: ${Math.max(0.1, getValue('opacity', DEFAULTS.opacity))};
              }
            `}
        />
        <TransitionPresetsControl
          value={hasReveal}
          onChange={(data) => {
            updateValue(data, true);
          }}
        />
        <Grid columns={2}>
          <NumberControl
            label={__('X', '@@text_domain')}
            value={getValue('x')}
            placeholder={DEFAULTS.x}
            onChange={(val) => {
              updateValue({ x: val === '' ? undefined : parseFloat(val) });
            }}
            suffix="px&nbsp;"
            style={{ flex: 1 }}
          />
          <NumberControl
            label={__('Y', '@@text_domain')}
            value={getValue('y')}
            placeholder={DEFAULTS.y}
            onChange={(val) => updateValue({ y: val === '' ? undefined : parseFloat(val) })}
            suffix="px&nbsp;"
            style={{ flex: 1 }}
          />
        </Grid>
        <Grid columns={3}>
          <NumberControl
            label={__('Opacity', '@@text_domain')}
            value={getValue('opacity')}
            placeholder={DEFAULTS.opacity}
            onChange={(val) => updateValue({ opacity: val === '' ? undefined : parseFloat(val) })}
            min={0}
            max={1}
            step={0.01}
            style={{ flex: 1 }}
          />
          <NumberControl
            label={__('Scale', '@@text_domain')}
            value={getValue('scale')}
            placeholder={DEFAULTS.scale}
            onChange={(val) => updateValue({ scale: val === '' ? undefined : parseFloat(val) })}
            min={0}
            max={10}
            step={0.01}
            style={{ flex: 1 }}
          />
          <NumberControl
            label={__('Rotate', '@@text_domain')}
            value={getValue('rotate')}
            placeholder={DEFAULTS.rotate}
            onChange={(val) => updateValue({ rotate: val === '' ? undefined : parseFloat(val) })}
            suffix="deg&nbsp;"
            style={{ flex: 1 }}
          />
        </Grid>
        <TransitionSelector
          label={__('Transition', '@@text_domain')}
          value={getValue('transition', DEFAULTS.transition)}
          onChange={(val) => updateValue({ transition: val })}
        />
        <ProNote title={__('Pro Settings', '@@text_domain')}>
          <p>
            {__(
              'Advanced reveal settings are available in the Ghost Kit Pro plugin only:',
              '@@text_domain'
            )}
          </p>
          <ul>
            <li>{__('3D Rotation', '@@text_domain')}</li>
            <li>{__('Custom Viewport', '@@text_domain')}</li>
            <li>{__('Replay Animation', '@@text_domain')}</li>
          </ul>
          <ProNote.Button
            target="_blank"
            rel="noopener noreferrer"
            href="https://ghostkit.io/extensions/effects/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_effects&utm_content=@@plugin_version"
          >
            {__('Read More', '@@text_domain')}
          </ProNote.Button>
        </ProNote>
      </DropdownPicker>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.effects.tools',
  'ghostkit/extension/effects/reveal',
  (children, { props }) => {
    const hasRevealSupport = hasBlockSupport(props.name, ['ghostkit', 'effects', 'reveal']);

    if (!hasRevealSupport) {
      return children;
    }

    return (
      <>
        {children}
        <EffectsRevealTools {...props} />
      </>
    );
  }
);
