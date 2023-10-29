/**
 * Internal dependencies
 */
import ResponsiveToggle from '../../../components/responsive-toggle';
import useStyles from '../../../hooks/use-styles';
import useResponsive from '../../../hooks/use-responsive';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const {
  RangeControl,
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

function CustomCSSOpacityTools(props) {
  const { getStyle, hasStyle, setStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasOpacity = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasOpacity = hasOpacity || hasStyle('opacity', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Opacity', '@@text_domain')}
      hasValue={() => !!hasOpacity}
      onSelect={() => {
        if (!hasStyle('opacity')) {
          setStyles({ opacity: 1 });
        }
      }}
      onDeselect={() => {
        const propsToReset = {};

        ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
          if (thisDevice) {
            propsToReset[`media_${thisDevice}`] = {};
          }

          if (thisDevice) {
            propsToReset[`media_${thisDevice}`].opacity = undefined;
          } else {
            propsToReset.opacity = undefined;
          }
        });

        setStyles(propsToReset);
      }}
      isShownByDefault={false}
    >
      <RangeControl
        label={
          <>
            {__('Opacity', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('opacity', checkMedia);
              }}
            />
          </>
        }
        value={getStyle('opacity', device)}
        placeholder={1}
        onChange={(val) => setStyles({ opacity: val === '' ? undefined : parseFloat(val) }, device)}
        min={0}
        max={1}
        step={0.01}
        style={{ flex: 1 }}
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.customCSS.tools',
  'ghostkit/extension/customCSS/tools/opacity',
  (children, { props }) => {
    const hasOpacitySupport = hasBlockSupport(props.name, ['ghostkit', 'customCSS', 'opacity']);

    if (!hasOpacitySupport) {
      return children;
    }

    return (
      <>
        {children}
        <CustomCSSOpacityTools {...props} />
      </>
    );
  }
);
