/**
 * Internal dependencies
 */
import Select from '../../../components/select';
import DropdownPicker from '../../../components/dropdown-picker';
import EditorStyles from '../../../components/editor-styles';
import TransitionSelector from '../../../components/transition-selector';
import sortObject from '../../../utils/sort-object';

import DEFAULTS from './defaults';
import PRESETS from './presets';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { useState, useEffect } = wp.element;

const {
  __experimentalToolsPanelItem: ToolsPanelItem,
  UnitControl: __stableUnitControl,
  __experimentalUnitControl,
  NumberControl: __stableNumberControl,
  __experimentalNumberControl,
  Grid: __stableGrid,
  __experimentalGrid,
} = wp.components;

const UnitControl = __stableUnitControl || __experimentalUnitControl;
const NumberControl = __stableNumberControl || __experimentalNumberControl;
const Grid = __stableGrid || __experimentalGrid;

const { hasBlockSupport } = wp.blocks;

function AnimationRevealTools(props) {
  const { attributes, setAttributes, clientId } = props;

  const [preset, setPreset] = useState();

  const hasReveal = attributes?.ghostkit?.animation?.reveal;

  // Find default preset
  useEffect(() => {
    let newPreset = 'custom';

    const currentReveal = sortObject({
      ...DEFAULTS,
      ...(hasReveal || {}),
    });

    // Remove transition from the comparison.
    if (currentReveal?.transition) {
      delete currentReveal.transition;
    }

    Object.keys(PRESETS).forEach((slug) => {
      const presetData = sortObject({
        ...DEFAULTS,
        ...PRESETS[slug].data,
      });

      // Remove transition from the comparison.
      if (presetData?.transition) {
        delete presetData.transition;
      }

      if (JSON.stringify(currentReveal) === JSON.stringify(presetData)) {
        newPreset = slug;
      }
    });

    setPreset(newPreset);
  }, [preset, hasReveal]);

  function getValue(prop, def) {
    if (typeof attributes?.ghostkit?.animation?.reveal?.[prop] === 'undefined') {
      return typeof DEFAULTS[prop] !== 'undefined' ? DEFAULTS[prop] : def;
    }

    return attributes.ghostkit.animation.reveal[prop];
  }

  function updateValue(newData, reset = false) {
    const ghostkitData = {
      ...(attributes?.ghostkit || {}),
    };

    if (typeof ghostkitData?.animation === 'undefined') {
      ghostkitData.animation = {};
    }

    // Reset all values except transition.
    if (reset || typeof ghostkitData?.animation?.reveal === 'undefined') {
      if (ghostkitData.animation.reveal?.transition) {
        ghostkitData.animation.reveal = {
          transition: ghostkitData.animation.reveal.transition,
        };
      } else {
        ghostkitData.animation.reveal = {};
      }
    }

    // Create the new object instead of using existing one.
    ghostkitData.animation.reveal = { ...ghostkitData.animation.reveal };

    Object.keys(newData).forEach((prop) => {
      ghostkitData.animation.reveal[prop] = newData[prop];
    });

    setAttributes({ ghostkit: ghostkitData });
  }

  const presetOptions = [
    ...(preset === 'custom'
      ? [
          {
            value: 'custom',
            label: __('-- Presets --', '@@text_domain'),
          },
        ]
      : []),
    ...Object.keys(PRESETS).map((name) => {
      return {
        value: name,
        label: PRESETS[name].label,
        icon: PRESETS[name].icon,
      };
    }),
  ];

  const presetValue = {
    value: preset,
    label: preset,
  };

  // Find actual label.
  if (presetValue.value) {
    presetOptions.forEach((presetData) => {
      if (presetValue.value === presetData.value) {
        presetValue.label = presetData.label;
      }
    });
  }

  return (
    <ToolsPanelItem
      label={__('Reveal', '@@text_domain')}
      hasValue={() => !!hasReveal}
      onDeselect={() => {
        const ghostkitData = {
          ...(attributes?.ghostkit || {}),
        };

        if (typeof ghostkitData?.animation?.reveal !== 'undefined') {
          delete ghostkitData?.animation?.reveal;

          setAttributes({ ghostkit: ghostkitData });
        }
      }}
      isShownByDefault={false}
    >
      <DropdownPicker
        label={__('Reveal', '@@text_domain')}
        contentClassName="ghostkit-component-animation-reveal"
      >
        <EditorStyles
          styles={`
              [data-block="${clientId}"] {
                transform: translateX(${getValue('x')}) translateY(${getValue(
            'y'
          )}) scale(${getValue('scale')}) rotate(${getValue('rotate')});
                opacity: ${getValue('opacity')};
              }
            `}
        />
        <Select
          value={presetValue}
          onChange={({ value }) => {
            if (PRESETS?.[value]?.data) {
              updateValue(PRESETS[value].data, true);
            }
          }}
          options={presetOptions}
          isSearchable={false}
        />
        <Grid columns={2}>
          <UnitControl
            label={__('X', '@@text_domain')}
            value={getValue('x')}
            onChange={(val) => updateValue({ x: val })}
            units={[
              { value: 'px', label: 'px' },
              { value: '%', label: '%' },
            ]}
          />
          <UnitControl
            label={__('Y', '@@text_domain')}
            value={getValue('y')}
            onChange={(val) => updateValue({ y: val })}
            units={[
              { value: 'px', label: 'px' },
              { value: '%', label: '%' },
            ]}
          />
        </Grid>
        <Grid columns={3}>
          <NumberControl
            label={__('Opacity', '@@text_domain')}
            value={getValue('opacity')}
            onChange={(val) => updateValue({ opacity: parseFloat(val) })}
            min={0}
            max={1}
            step={0.05}
            style={{ flex: 1 }}
          />
          <NumberControl
            label={__('Scale', '@@text_domain')}
            value={getValue('scale')}
            onChange={(val) => updateValue({ scale: parseFloat(val) })}
            min={0}
            max={10}
            step={0.1}
            style={{ flex: 1 }}
          />
          <UnitControl
            label={__('Rotate', '@@text_domain')}
            value={getValue('rotate')}
            onChange={(val) => updateValue({ rotate: val })}
            units={[{ value: 'deg', label: 'deg' }]}
            style={{ flex: 1 }}
          />
        </Grid>
        <TransitionSelector
          label={__('Transition', '@@text_domain')}
          value={getValue('transition')}
          onChange={(val) => updateValue({ transition: val })}
        />
      </DropdownPicker>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.animation.tools',
  'ghostkit/extension/animation/reveal',
  (children, { props }) => {
    const hasRevealSupport = hasBlockSupport(props.name, ['ghostkit', 'animation', 'reveal']);

    if (!hasRevealSupport) {
      return children;
    }

    return (
      <>
        {children}
        <AnimationRevealTools {...props} />
      </>
    );
  }
);
