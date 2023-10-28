/**
 * Internal dependencies
 */
import useStyles from '../../../hooks/use-styles';

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

  const hasOpacity = hasStyle('opacity');

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
        if (hasStyle('opacity')) {
          setStyles({ opacity: undefined });
        }
      }}
      isShownByDefault={false}
    >
      <RangeControl
        label={__('Opacity', '@@text_domain')}
        value={getStyle('opacity')}
        placeholder={1}
        onChange={(val) => setStyles({ opacity: val === '' ? undefined : parseFloat(val) })}
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
