/**
 * Internal dependencies
 */
import ElementStateToggle from '../../../components/element-state-toggle';
import ResponsiveToggle from '../../../components/responsive-toggle';
import InputDrag from '../../../components/input-drag';
import InputGroup from '../../../components/input-group';
import useStyles from '../../../hooks/use-styles';
import useResponsive from '../../../hooks/use-responsive';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { useState } = wp.element;

const { ToolsPanelItem: __stableToolsPanelItem, __experimentalToolsPanelItem } = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

const hoverSelector = '&:hover';

const allRadiusProps = [
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
];

function FrameBorderRadiusTools(props) {
  const [isHover, setIsHover] = useState(false);

  const { getStyle, hasStyle, setStyles } = useStyles(props);
  const { device, allDevices } = useResponsive();

  let hasBorderRadius = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    allRadiusProps.forEach((thisProp) => {
      hasBorderRadius =
        hasBorderRadius ||
        hasStyle(thisProp, thisDevice) ||
        hasStyle(thisProp, thisDevice, hoverSelector);
    });
  });

  return (
    <ToolsPanelItem
      label={__('Border Radius', '@@text_domain')}
      hasValue={() => !!hasBorderRadius}
      onDeselect={() => {
        const propsToReset = {
          [hoverSelector]: {},
        };

        ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
          if (thisDevice) {
            propsToReset[`media_${thisDevice}`] = {};
            propsToReset[`media_${thisDevice}`][hoverSelector] = {};
          }

          allRadiusProps.forEach((thisProp) => {
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
      <InputGroup
        label={
          <>
            {__('Border Radius', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return (
                  hasStyle('border-top-left-radius', checkMedia, isHover && hoverSelector) ||
                  hasStyle('border-top-right-radius', checkMedia, isHover && hoverSelector) ||
                  hasStyle('border-bottom-left-radius', checkMedia, isHover && hoverSelector) ||
                  hasStyle('border-bottom-right-radius', checkMedia, isHover && hoverSelector)
                );
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
        <InputDrag
          help={__('TL', '@@text_domain')}
          value={getStyle('border-top-left-radius', device, isHover && hoverSelector)}
          placeholder="-"
          onChange={(val) =>
            setStyles({ 'border-top-left-radius': val }, device, isHover && hoverSelector)
          }
          autoComplete="off"
        />
        <InputDrag
          help={__('TR', '@@text_domain')}
          value={getStyle('border-top-right-radius', device, isHover && hoverSelector)}
          placeholder="-"
          onChange={(val) =>
            setStyles({ 'border-top-right-radius': val }, device, isHover && hoverSelector)
          }
          autoComplete="off"
        />
        <InputDrag
          help={__('BR', '@@text_domain')}
          value={getStyle('border-bottom-right-radius', device, isHover && hoverSelector)}
          placeholder="-"
          onChange={(val) =>
            setStyles({ 'border-bottom-right-radius': val }, device, isHover && hoverSelector)
          }
          autoComplete="off"
        />
        <InputDrag
          help={__('BL', '@@text_domain')}
          value={getStyle('border-bottom-left-radius', device, isHover && hoverSelector)}
          placeholder="-"
          onChange={(val) =>
            setStyles({ 'border-bottom-left-radius': val }, device, isHover && hoverSelector)
          }
          autoComplete="off"
        />
      </InputGroup>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.frame.tools',
  'ghostkit/extension/frame/tools/borderRadius',
  (children, { props }) => {
    const hasBorderRadiusSupport = hasBlockSupport(props.name, [
      'ghostkit',
      'frame',
      'borderRadius',
    ]);

    if (!hasBorderRadiusSupport) {
      return children;
    }

    return (
      <>
        {children}
        <FrameBorderRadiusTools {...props} />
      </>
    );
  }
);
