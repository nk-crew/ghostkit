/**
 * External dependencies
 */
// TODO: check for better implementation - https://codepen.io/osublake/pen/OyPGEo
import BezierEditor from 'bezier-easing-editor';
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import Select from '../select';
import TransitionPreview from '../transition-preview';
import round from '../../utils/round';

import PRESETS from './presets';
import DEFAULT from './default';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { useState, useEffect } = wp.element;

const {
  BaseControl,
  NumberControl: __stableNumberControl,
  __experimentalNumberControl,
} = wp.components;

const NumberControl = __stableNumberControl || __experimentalNumberControl;

export function EasingBezierEditor(props) {
  const { value, onChange, variant = '' } = props;

  let options = {
    value,
    width: 228,
    height: 140,
    padding: [25, 55, 25, 55],
    background: 'transparent',
    color: '#ccc',
    gridColor: 'transparent',
    curveColor: '#bfbfbf',
    progressColor: '#ccc',
    handleColor: 'var(--wp-admin-theme-color)',
    curveWidth: 2,
    handleRadius: 6,
    handleStroke: 2,
    textStyle: {
      display: 'none',
    },
    onChange,
  };

  if (variant === 'preview') {
    options = {
      ...options,
      readOnly: true,
      width: 20,
      height: 20,
      padding: [3, 3, 3, 3],
      curveColor: '#fff',
      curveWidth: 1.5,
    };
  }

  return (
    <div
      className={classnames(
        'ghostkit-component-bezier-editor',
        variant && `ghostkit-component-bezier-editor-${variant}`
      )}
    >
      <BezierEditor {...options} />
    </div>
  );
}

export function EasingControls(props) {
  const { value, onChange } = props;

  const [preset, setPreset] = useState();

  function updateValue(val) {
    onChange({ ...value, ...val });
  }

  let ease = value?.ease;
  if (!ease || ease.length !== 4) {
    ease = DEFAULT.ease;
  }

  // Find default preset
  useEffect(() => {
    let newPreset = 'custom';

    Object.keys(PRESETS).forEach((slug) => {
      const presetData = PRESETS[slug].ease;

      if (JSON.stringify(ease) === JSON.stringify(presetData)) {
        newPreset = slug;
      }
    });

    setPreset(newPreset);
  }, [preset, ease]);

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
    <>
      <Select
        value={presetValue}
        onChange={({ value: newPreset }) => {
          if (PRESETS?.[newPreset]?.ease) {
            updateValue({ ease: PRESETS[newPreset].ease });
          }
        }}
        options={presetOptions}
        isSearchable={false}
      />
      <EasingBezierEditor
        value={ease}
        onChange={(val) => {
          const newEase = val.map((v) => {
            return round(v, 2);
          });

          updateValue({ ease: newEase });
        }}
      />
      <BaseControl
        label={__('Bezier', '@@text_domain')}
        className="ghostkit-component-easing-controls-bezier"
      >
        <NumberControl
          value={ease[0]}
          onChange={(val) =>
            updateValue({ ease: [round(parseFloat(val), 2), ease[1], ease[2], ease[3]] })
          }
          min={0}
          max={1}
          step={0.01}
        />
        <NumberControl
          value={ease[1]}
          onChange={(val) =>
            updateValue({ ease: [ease[0], round(parseFloat(val), 2), ease[2], ease[3]] })
          }
          min={-5}
          max={5}
          step={0.01}
        />
        <NumberControl
          value={ease[2]}
          onChange={(val) =>
            updateValue({ ease: [ease[0], ease[1], round(parseFloat(val), 2), ease[3]] })
          }
          min={0}
          max={1}
          step={0.01}
        />
        <NumberControl
          value={ease[3]}
          onChange={(val) =>
            updateValue({ ease: [ease[0], ease[1], ease[2], round(parseFloat(val), 2)] })
          }
          min={-5}
          max={5}
          step={0.01}
        />
      </BaseControl>
      <NumberControl
        label={__('Duration', '@@text_domain')}
        suffix={__('ms', '@@text_domain')}
        value={value?.duration || 0}
        onChange={(val) => updateValue({ duration: parseFloat(val) })}
        labelPosition="edge"
        __unstableInputWidth="90px"
        min={0}
        max={10000}
        step={10}
      />
      <NumberControl
        label={__('Delay', '@@text_domain')}
        suffix={__('ms', '@@text_domain')}
        value={value?.delay || 0}
        onChange={(val) => updateValue({ delay: parseFloat(val) })}
        labelPosition="edge"
        __unstableInputWidth="90px"
        min={0}
        max={10000}
        step={10}
      />
      <TransitionPreview
        label={__('Preview', '@@text_domain')}
        options={{
          type: 'easing',
          duration: value?.duration || 0,
          ease,
        }}
      />
    </>
  );
}
