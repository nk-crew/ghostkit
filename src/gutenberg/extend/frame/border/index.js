/**
 * Internal dependencies
 */
import ElementStateToggle from '../../../components/element-state-toggle';
import ResponsiveToggle from '../../../components/responsive-toggle';
import ToggleGroup from '../../../components/toggle-group';
import InputDrag from '../../../components/input-drag';
import ColorPicker from '../../../components/color-picker';
import { maybeDecode } from '../../../utils/encode-decode';
import useStyles from '../../../hooks/use-styles';
import useResponsive from '../../../hooks/use-responsive';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { useState } = wp.element;

const {
  BaseControl,
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

const hoverSelector = '&:hover';

const allBorderProps = ['border-style', 'border-width', 'border-color'];

const borderStyles = [
  {
    value: 'solid',
    label: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 11.25H19V12.75H5V11.25Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'dashed',
    label: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5 11.25H8V12.75H5V11.25ZM10.5 11.25H13.5V12.75H10.5V11.25ZM19 11.25H16V12.75H19V11.25Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    value: 'dotted',
    label: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.25 11.25H6.75V12.75H5.25V11.25ZM8.25 11.25H9.75V12.75H8.25V11.25ZM12.75 11.25H11.25V12.75H12.75V11.25ZM14.25 11.25H15.75V12.75H14.25V11.25ZM18.75 11.25H17.25V12.75H18.75V11.25Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    value: 'double',
    label: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 9.25H19V10.75H5V9.25Z" fill="currentColor" />
        <path d="M5 13H19V14.5H5V13Z" fill="currentColor" />
      </svg>
    ),
  },
];

function FrameBorderTools(props) {
  const [isHover, setIsHover] = useState(false);

  const { getStyle, hasStyle, setStyles } = useStyles(props);
  const { device, allDevices } = useResponsive();

  let hasBorder = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    allBorderProps.forEach((thisProp) => {
      hasBorder =
        hasBorder ||
        hasStyle(thisProp, thisDevice) ||
        hasStyle(thisProp, thisDevice, hoverSelector);
    });
  });

  const borderStyle = getStyle('border-style', device, isHover && hoverSelector);

  return (
    <ToolsPanelItem
      label={__('Border', '@@text_domain')}
      hasValue={() => !!hasBorder}
      onSelect={() => {
        setStyles({
          'border-style': 'solid',
          'border-width': '1px',
          'border-color': '#000',
        });
      }}
      onDeselect={() => {
        const propsToReset = {
          [hoverSelector]: {},
        };

        ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
          if (thisDevice) {
            propsToReset[`media_${thisDevice}`] = {};
            propsToReset[`media_${thisDevice}`][hoverSelector] = {};
          }

          allBorderProps.forEach((thisProp) => {
            if (thisDevice) {
              propsToReset[`media_${thisDevice}`][thisProp] = undefined;
              propsToReset[`media_${thisDevice}`][hoverSelector][thisProp] = undefined;
            } else {
              propsToReset[thisProp] = undefined;
              propsToReset[hoverSelector][thisProp] = undefined;
            }
          });
        });

        setStyles(propsToReset);
      }}
      isShownByDefault={false}
    >
      <BaseControl
        label={
          <>
            {__('Border', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('border-style', checkMedia, isHover && hoverSelector);
              }}
            />
            <ElementStateToggle
              isHover={isHover}
              onChange={() => {
                setIsHover(!isHover);
              }}
            />
          </>
        }
      >
        <div className="ghostkit-control-border-row">
          <ColorPicker
            value={maybeDecode(getStyle('border-color', device, isHover && hoverSelector))}
            onChange={(value) =>
              setStyles({ 'border-color': value }, device, isHover && hoverSelector)
            }
            alpha
          />
          <ToggleGroup
            value={borderStyle}
            options={borderStyles}
            onChange={(value) => {
              setStyles(
                { 'border-style': value === 'none' ? '' : value },
                device,
                isHover && hoverSelector
              );
            }}
            isBlock
          />
          <InputDrag
            value={getStyle('border-width', device, isHover && hoverSelector)}
            placeholder={__('Width', '@@text_domain')}
            onChange={(value) =>
              setStyles({ 'border-width': value }, device, isHover && hoverSelector)
            }
            startDistance={1}
            autoComplete="off"
          />
        </div>
      </BaseControl>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.frame.tools',
  'ghostkit/extension/frame/tools/border',
  (children, { props }) => {
    const hasBorderSupport = hasBlockSupport(props.name, ['ghostkit', 'frame', 'border']);

    if (!hasBorderSupport) {
      return children;
    }

    return (
      <>
        {children}
        <FrameBorderTools {...props} />
      </>
    );
  }
);
