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

  let easing = value?.easing;
  if (!easing || easing.length !== 4) {
    easing = DEFAULT.easing;
  }

  // Find default preset
  useEffect(() => {
    let newPreset = 'custom';

    Object.keys(PRESETS).forEach((slug) => {
      const presetData = PRESETS[slug].easing;

      if (JSON.stringify(easing) === JSON.stringify(presetData)) {
        newPreset = slug;
      }
    });

    setPreset(newPreset);
  }, [preset, easing]);

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
          if (PRESETS?.[newPreset]?.easing) {
            updateValue({ easing: PRESETS[newPreset].easing });
          }
        }}
        options={presetOptions}
        isSearchable={false}
      />
      <EasingBezierEditor
        value={easing}
        onChange={(val) => {
          const newEase = val.map((v) => {
            return round(v, 2);
          });

          updateValue({ easing: newEase });
        }}
      />
      <BaseControl
        label={__('Bezier', '@@text_domain')}
        className="ghostkit-component-easing-controls-bezier"
      >
        <NumberControl
          value={easing[0]}
          onChange={(val) =>
            updateValue({ easing: [round(parseFloat(val), 2), easing[1], easing[2], easing[3]] })
          }
          min={0}
          max={1}
          step={0.01}
        />
        <NumberControl
          value={easing[1]}
          onChange={(val) =>
            updateValue({ easing: [easing[0], round(parseFloat(val), 2), easing[2], easing[3]] })
          }
          min={-5}
          max={5}
          step={0.01}
        />
        <NumberControl
          value={easing[2]}
          onChange={(val) =>
            updateValue({ easing: [easing[0], easing[1], round(parseFloat(val), 2), easing[3]] })
          }
          min={0}
          max={1}
          step={0.01}
        />
        <NumberControl
          value={easing[3]}
          onChange={(val) =>
            updateValue({ easing: [easing[0], easing[1], easing[2], round(parseFloat(val), 2)] })
          }
          min={-5}
          max={5}
          step={0.01}
        />
      </BaseControl>
      <NumberControl
        label={__('Duration', '@@text_domain')}
        suffix={__('s', '@@text_domain')}
        value={value?.duration || 0}
        onChange={(val) => updateValue({ duration: parseFloat(val) })}
        labelPosition="edge"
        __unstableInputWidth="90px"
        min={0}
        max={10}
        step={0.01}
      />
      <NumberControl
        label={__('Delay', '@@text_domain')}
        suffix={__('s', '@@text_domain')}
        value={value?.delay || 0}
        onChange={(val) => updateValue({ delay: parseFloat(val) })}
        labelPosition="edge"
        __unstableInputWidth="90px"
        min={0}
        max={10}
        step={0.01}
      />
      <TransitionPreview
        label={__('Preview', '@@text_domain')}
        options={{
          type: 'easing',
          duration: value?.duration || 0,
          easing,
        }}
      />
    </>
  );
}
