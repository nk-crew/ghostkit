/**
 * Internal dependencies
 */
import ElementStateToggle from '../../../components/element-state-toggle';
import ResponsiveToggle from '../../../components/responsive-toggle';
import InputDrag from '../../../components/input-drag';
import InputGroup from '../../../components/input-group';
import ColorPicker from '../../../components/color-picker';
import useStyles from '../../../hooks/use-styles';
import useResponsive from '../../../hooks/use-responsive';
import { maybeDecode } from '../../../utils/encode-decode';
import arrayMove from '../../../utils/array-move';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { useState, useEffect } = wp.element;

const {
  BaseControl,
  Tooltip,
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

const hoverSelector = '&:hover';

/**
 * Add `px` suffix to number string.
 *
 * @param {String} str string.
 *
 * @return {String} string with pixels.
 */
function addPixelsToString(str) {
  // add pixels.
  if (typeof str === 'string' && str !== '0' && /^[0-9.-]*$/.test(str)) {
    str += 'px';
  }

  return str;
}

function parseShadowString(str) {
  if (str) {
    let parsedShadow = maybeDecode(str).split(/ (?![^(]*\))/);

    if (parsedShadow && parsedShadow.length === 5) {
      // Is first item color.
      if (/^(#|rgb|hsl)/.test(parsedShadow[0])) {
        parsedShadow = arrayMove(parsedShadow, 0, 5);
      }

      return parsedShadow;
    }
  }

  return false;
}

/**
 * Component
 */
function FrameShadowTools(props) {
  const [isHover, setIsHover] = useState(false);

  const { getStyle, hasStyle, setStyles } = useStyles(props);
  const { device, allDevices } = useResponsive();

  const [x, setX] = useState();
  const [y, setY] = useState();
  const [blur, setBlur] = useState();
  const [spread, setSpread] = useState();
  const [color, setColor] = useState();

  // Prepare current shadow state.
  useEffect(() => {
    const parsedShadow = parseShadowString(
      getStyle('box-shadow', device, isHover && hoverSelector)
    );

    if (parsedShadow && parsedShadow.length === 5) {
      setX(parsedShadow[0]);
      setY(parsedShadow[1]);
      setBlur(parsedShadow[2]);
      setSpread(parsedShadow[3]);
      setColor(parsedShadow[4]);
    } else {
      setX(undefined);
      setY(undefined);
      setBlur(undefined);
      setSpread(undefined);
      setColor(undefined);
    }
  }, [device, isHover]);

  let hasShadow = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasShadow =
      hasShadow ||
      hasStyle('box-shadow', thisDevice) ||
      hasStyle('box-shadow', thisDevice, hoverSelector);
  });

  return (
    <ToolsPanelItem
      label={__('Shadow', '@@text_domain')}
      hasValue={() => !!hasShadow}
      onDeselect={() => {
        const propsToReset = {
          [hoverSelector]: {},
        };

        ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
          if (thisDevice) {
            propsToReset[`media_${thisDevice}`] = {};
            propsToReset[`media_${thisDevice}`][hoverSelector] = {};
          }

          if (thisDevice) {
            propsToReset[`media_${thisDevice}`]['box-shadow'] = undefined;
            propsToReset[`media_${thisDevice}`][hoverSelector]['box-shadow'] = undefined;
          } else {
            propsToReset['box-shadow'] = undefined;
            propsToReset[hoverSelector]['box-shadow'] = undefined;
          }
        });

        setStyles(propsToReset);
      }}
      isShownByDefault={false}
    >
      <BaseControl
        label={
          <>
            {__('Shadow', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('box-shadow', checkMedia, isHover && hoverSelector);
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
        <div className="ghostkit-control-box-shadow">
          <Tooltip text={__('Color', '@@text_domain')}>
            <div>
              <ColorPicker
                value={color}
                onChange={(val) => {
                  if (!val) {
                    setStyles({ 'box-shadow': undefined }, device, isHover && hoverSelector);
                    setX(undefined);
                    setY(undefined);
                    setBlur(undefined);
                    setSpread(undefined);
                    setColor(undefined);
                  } else {
                    setStyles(
                      { 'box-shadow': `${x} ${y} ${blur} ${spread} ${val}` },
                      device,
                      isHover && hoverSelector
                    );
                    setColor(val);
                  }
                }}
                alpha
              />
            </div>
          </Tooltip>
          <InputGroup>
            <InputDrag
              help={__('X', '@@text_domain')}
              value={x}
              onChange={(val) => {
                setStyles(
                  {
                    'box-shadow': `${addPixelsToString(val || 0)} ${y} ${blur} ${spread} ${color}`,
                  },
                  device,
                  isHover && hoverSelector
                );
                setX(addPixelsToString(val || 0));
              }}
              startDistance={1}
              autoComplete="off"
            />
            <InputDrag
              help={__('Y', '@@text_domain')}
              value={y}
              onChange={(val) => {
                setStyles(
                  {
                    'box-shadow': `${x} ${addPixelsToString(val || 0)} ${blur} ${spread} ${color}`,
                  },
                  device,
                  isHover && hoverSelector
                );
                setY(addPixelsToString(val || 0));
              }}
              startDistance={1}
              autoComplete="off"
            />
            <InputDrag
              help={__('Blur', '@@text_domain')}
              value={blur}
              onChange={(val) => {
                setStyles(
                  { 'box-shadow': `${x} ${y} ${addPixelsToString(val || 0)} ${spread} ${color}` },
                  device,
                  isHover && hoverSelector
                );
                setBlur(addPixelsToString(val || 0));
              }}
              startDistance={1}
              autoComplete="off"
            />
            <InputDrag
              help={__('Spread', '@@text_domain')}
              value={spread}
              onChange={(val) => {
                setStyles(
                  { 'box-shadow': `${x} ${y} ${blur} ${addPixelsToString(val || 0)} ${color}` },
                  device,
                  isHover && hoverSelector
                );
                setSpread(addPixelsToString(val || 0));
              }}
              startDistance={1}
              autoComplete="off"
            />
          </InputGroup>
        </div>
      </BaseControl>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.frame.tools',
  'ghostkit/extension/frame/tools/shadow',
  (children, { props }) => {
    const hasShadowSupport = hasBlockSupport(props.name, ['ghostkit', 'frame', 'shadow']);

    if (!hasShadowSupport) {
      return children;
    }

    return (
      <>
        {children}
        <FrameShadowTools {...props} />
      </>
    );
  }
);
