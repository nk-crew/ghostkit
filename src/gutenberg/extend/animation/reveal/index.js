/**
 * Internal dependencies
 */
import Select from '../../../components/select';
import DropdownPicker from '../../../components/dropdown-picker';
import EditorStyles from '../../../components/editor-styles';
import getIcon from '../../../utils/get-icon';
import sortObject from '../../../utils/sort-object';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { useState, useEffect } = wp.element;

const {
  BaseControl,
  __experimentalToolsPanelItem: ToolsPanelItem,
  UnitControl: __stableUnitControl,
  __experimentalUnitControl,
  NumberControl: __stableNumberControl,
  __experimentalNumberControl,
} = wp.components;

const UnitControl = __stableUnitControl || __experimentalUnitControl;
const NumberControl = __stableNumberControl || __experimentalNumberControl;

const { hasBlockSupport } = wp.blocks;

const DEFAULTS = {
  x: '0px',
  y: '0px',
  opacity: 1,
  scale: 1,
  rotate: '0deg',
  easing: [0.5, 0, 0, 1],
};

const PRESETS = {
  fade: {
    label: __('Fade in', '@@text_domain'),
    icon: getIcon('sr-fade'),
    data: {
      opacity: 0,
    },
  },
  zoom: {
    label: __('Zoom in', '@@text_domain'),
    icon: getIcon('sr-zoom'),
    data: {
      scale: 0.9,
    },
  },
  'zoom-up': {
    label: __('Zoom in from Bottom', '@@text_domain'),
    icon: getIcon('sr-zoom-from-bottom'),
    data: {
      y: '50px',
      scale: 0.9,
    },
  },
  'zoom-left': {
    label: __('Zoom in from Left', '@@text_domain'),
    icon: getIcon('sr-zoom-from-left'),
    data: {
      x: '-50px',
      scale: 0.9,
    },
  },
  'zoom-right': {
    label: __('Zoom in from Right', '@@text_domain'),
    icon: getIcon('sr-zoom-from-right'),
    data: {
      x: '50px',
      scale: 0.9,
    },
  },
};

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

    Object.keys(PRESETS).forEach((slug) => {
      const presetData = sortObject({
        ...DEFAULTS,
        ...PRESETS[slug].data,
      });

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

  function updateValue(newData, clear = false) {
    const ghostkitData = {
      ...(attributes?.ghostkit || {}),
    };

    if (typeof ghostkitData?.animation === 'undefined') {
      ghostkitData.animation = {};
    }

    if (clear || typeof ghostkitData?.animation?.reveal === 'undefined') {
      ghostkitData.animation.reveal = {};
    }

    // Create the new object instead of using existing one.
    ghostkitData.animation.reveal = { ...ghostkitData.animation.reveal };

    Object.keys(newData).forEach((prop) => {
      ghostkitData.animation.reveal[prop] = newData[prop];
    });

    setAttributes({ ghostkit: ghostkitData });
  }

  const presetOptions = [
    ...Object.keys(PRESETS).map((name) => {
      return {
        value: name,
        label: PRESETS[name].label,
        icon: PRESETS[name].icon,
      };
    }),
    ...(preset === 'custom'
      ? [
          {
            value: 'custom',
            label: __('Custom', '@@text_domain'),
          },
        ]
      : []),
  ];

  const presetValue = {
    value: preset,
    label: preset,
  };

  // Find actual label.
  if (presetValue.value) {
    presetOptions.forEach((familyData) => {
      if (presetValue.value === familyData.value) {
        presetValue.label = familyData.label;
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
        <BaseControl label={__('Presets', '@@text_domain')}>
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
        </BaseControl>
        <UnitControl
          label={__('Translate X', '@@text_domain')}
          value={getValue('x')}
          onChange={(val) => updateValue({ x: val })}
          labelPosition="edge"
          __unstableInputWidth="70px"
          units={[
            { value: 'px', label: 'px' },
            { value: '%', label: '%' },
          ]}
        />
        <UnitControl
          label={__('Translate Y', '@@text_domain')}
          value={getValue('y')}
          onChange={(val) => updateValue({ y: val })}
          labelPosition="edge"
          __unstableInputWidth="70px"
          units={[
            { value: 'px', label: 'px' },
            { value: '%', label: '%' },
          ]}
        />
        <NumberControl
          label={__('Opacity', '@@text_domain')}
          value={getValue('opacity')}
          onChange={(val) => updateValue({ opacity: parseFloat(val) })}
          labelPosition="edge"
          __unstableInputWidth="70px"
          min={0}
          max={1}
          step={0.05}
        />
        <NumberControl
          label={__('Scale', '@@text_domain')}
          value={getValue('scale')}
          onChange={(val) => updateValue({ scale: parseFloat(val) })}
          labelPosition="edge"
          __unstableInputWidth="70px"
          min={0}
          max={10}
          step={0.1}
        />
        <UnitControl
          label={__('Rotate', '@@text_domain')}
          value={getValue('rotate')}
          onChange={(val) => updateValue({ rotate: val })}
          labelPosition="edge"
          __unstableInputWidth="70px"
          units={[{ value: 'deg', label: 'deg' }]}
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
