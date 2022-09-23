/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import ColorIndicator from '../../components/color-indicator';
import ApplyFilters from '../../components/apply-filters';
import URLPicker from '../../components/url-picker';
import ToggleGroup from '../../components/toggle-group';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Fragment, useEffect, useState } = wp.element;

const { SelectControl, PanelBody, RangeControl, TabPanel, ToggleControl } = wp.components;

const { InspectorControls, useBlockProps, RichText } = wp.blockEditor;

const SIZES = [
  {
    label: 'XS',
    value: 'xs',
  },
  {
    label: 'S',
    value: 'sm',
  },
  {
    label: 'M',
    value: 'md',
  },
  {
    label: 'L',
    value: 'lg',
  },
  {
    label: 'XL',
    value: 'xl',
  },
];

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected } = props;

  const {
    tagName,
    text,
    icon,
    iconPosition,
    hideText,
    url,
    ariaLabel,
    target,
    rel,
    size,
    color,
    textColor,
    borderRadius,
    borderWeight,
    borderColor,
    focusOutlineWeight,
    focusOutlineColor,
    hoverColor,
    hoverTextColor,
    hoverBorderColor,
  } = attributes;

  let { className = '' } = attributes;

  const [selectedColorState, setSelectedColorState] = useState('normal');

  // Reset selected color state when block is not selected.
  useEffect(() => {
    if (!isSelected) {
      setSelectedColorState('normal');
    }
  }, [isSelected]);

  let isNormalState = false;
  let isHoveredState = false;
  let isFocusedState = false;

  if (isSelected) {
    isNormalState = true;

    if ('hover' === selectedColorState) {
      isNormalState = false;
      isHoveredState = true;
    } else if ('focus' === selectedColorState) {
      isNormalState = false;
      isFocusedState = true;
    }
  }

  className = classnames(
    'ghostkit-button',
    size ? `ghostkit-button-${size}` : '',
    hideText ? 'ghostkit-button-icon-only' : '',
    isNormalState ? 'ghostkit-button-is-normal-state' : '',
    isHoveredState ? 'ghostkit-button-is-hover-state' : '',
    isFocusedState ? 'ghostkit-button-is-focus-state' : '',
    className
  );

  // focus outline
  if (focusOutlineWeight && focusOutlineColor) {
    className = classnames(className, 'ghostkit-button-with-outline');
  }

  className = applyFilters('ghostkit.editor.className', className, props);

  const colorsTabs = [
    {
      name: 'normal',
      title: __('Normal', '@@text_domain'),
      className: 'ghostkit-control-tabs-tab',
    },
    {
      name: 'hover',
      title: __('Hover', '@@text_domain'),
      className: 'ghostkit-control-tabs-tab',
    },
  ];

  if (focusOutlineWeight && focusOutlineColor) {
    colorsTabs.push({
      name: 'focus',
      title: __('Focus', '@@text_domain'),
      className: 'ghostkit-control-tabs-tab',
    });
  }

  const blockProps = useBlockProps({
    className,
  });

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody>
          <div className="blocks-size__main">
            <ToggleGroup
              value={size}
              options={SIZES}
              onChange={(value) => {
                setAttributes({ size: value });
              }}
            />
          </div>
        </PanelBody>
        <PanelBody>
          <RangeControl
            label={__('Corner Radius', '@@text_domain')}
            value={borderRadius}
            min="0"
            max="50"
            onChange={(value) => setAttributes({ borderRadius: value })}
          />
          <RangeControl
            label={__('Border Size', '@@text_domain')}
            value={borderWeight}
            min="0"
            max="6"
            onChange={(value) => setAttributes({ borderWeight: value })}
          />
          <RangeControl
            label={__('Focus Outline Size', '@@text_domain')}
            value={focusOutlineWeight}
            min="0"
            max="6"
            onChange={(value) => setAttributes({ focusOutlineWeight: value })}
          />
        </PanelBody>
        <PanelBody>
          <IconPicker
            label={__('Icon', '@@text_domain')}
            value={icon}
            onChange={(value) => setAttributes({ icon: value })}
          />
          {icon ? (
            <ToggleControl
              label={__('Show Icon Only', '@@text_domain')}
              checked={!!hideText}
              onChange={(val) => setAttributes({ hideText: val })}
            />
          ) : (
            ''
          )}
          {icon && !hideText ? (
            <SelectControl
              label={__('Icon Position', '@@text_domain')}
              value={iconPosition}
              options={[
                {
                  value: 'left',
                  label: __('Left', '@@text_domain'),
                },
                {
                  value: 'right',
                  label: __('Right', '@@text_domain'),
                },
              ]}
              onChange={(value) => setAttributes({ iconPosition: value })}
            />
          ) : (
            ''
          )}
        </PanelBody>
        <PanelBody
          title={
            <Fragment>
              {__('Colors', '@@text_domain')}
              <ColorIndicator colorValue={color} />
              <ColorIndicator colorValue={textColor} />
              {borderWeight ? <ColorIndicator colorValue={borderColor} /> : ''}
              {focusOutlineWeight && focusOutlineColor ? (
                <ColorIndicator colorValue={focusOutlineColor} />
              ) : (
                ''
              )}
            </Fragment>
          }
          initialOpen={false}
        >
          <TabPanel
            className="ghostkit-control-tabs ghostkit-control-tabs-wide"
            tabs={colorsTabs}
            onSelect={(state) => {
              setSelectedColorState(state);
            }}
          >
            {(tabData) => {
              const isHover = 'hover' === tabData.name;

              // focus tab
              if ('focus' === tabData.name) {
                return (
                  <ApplyFilters
                    name="ghostkit.editor.controls"
                    attribute="focusOutlineColor"
                    props={props}
                  >
                    <ColorPicker
                      label={__('Outline', '@@text_domain')}
                      value={focusOutlineColor}
                      onChange={(val) => setAttributes({ focusOutlineColor: val })}
                      alpha
                    />
                  </ApplyFilters>
                );
              }

              return (
                <Fragment>
                  <ApplyFilters
                    name="ghostkit.editor.controls"
                    attribute={isHover ? 'hoverColor' : 'color'}
                    props={props}
                  >
                    <ColorPicker
                      label={__('Background', '@@text_domain')}
                      value={isHover ? hoverColor : color}
                      onChange={(val) =>
                        setAttributes(isHover ? { hoverColor: val } : { color: val })
                      }
                      alpha
                    />
                  </ApplyFilters>
                  <ApplyFilters
                    name="ghostkit.editor.controls"
                    attribute={isHover ? 'hoverTextColor' : 'textColor'}
                    props={props}
                  >
                    <ColorPicker
                      label={__('Text', '@@text_domain')}
                      value={isHover ? hoverTextColor : textColor}
                      onChange={(val) =>
                        setAttributes(isHover ? { hoverTextColor: val } : { textColor: val })
                      }
                      alpha
                    />
                  </ApplyFilters>
                  {borderWeight ? (
                    <ApplyFilters
                      name="ghostkit.editor.controls"
                      attribute={isHover ? 'hoverBorderColor' : 'borderColor'}
                      props={props}
                    >
                      <ColorPicker
                        label={__('Border', '@@text_domain')}
                        value={isHover ? hoverBorderColor : borderColor}
                        onChange={(val) =>
                          setAttributes(isHover ? { hoverBorderColor: val } : { borderColor: val })
                        }
                        alpha
                      />
                    </ApplyFilters>
                  ) : (
                    ''
                  )}
                </Fragment>
              );
            }}
          </TabPanel>
        </PanelBody>
      </InspectorControls>
      {!tagName || 'a' === tagName ? (
        <URLPicker
          url={url}
          rel={rel}
          ariaLabel={ariaLabel}
          target={target}
          onChange={(data) => {
            setAttributes(data);
          }}
          isSelected={isSelected}
          toolbarSettings
          inspectorSettings
        />
      ) : null}
      {icon ? (
        <div
          className={`ghostkit-button-icon ghostkit-button-icon-${
            'right' === iconPosition ? 'right' : 'left'
          }`}
        >
          <IconPicker.Dropdown
            onChange={(value) => setAttributes({ icon: value })}
            value={icon}
            renderToggle={({ onToggle }) => <IconPicker.Preview onClick={onToggle} name={icon} />}
          />
        </div>
      ) : null}
      {!hideText ? (
        <RichText
          placeholder={__('Write text…', '@@text_domain')}
          value={text}
          onChange={(value) => setAttributes({ text: value })}
          isSelected={isSelected}
          withoutInteractiveFormatting
        />
      ) : null}
    </div>
  );
}
