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
  BaseControl,
  SelectControl,
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
  Grid: __stableGrid,
  __experimentalGrid,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;
const Grid = __stableGrid || __experimentalGrid;

const { hasBlockSupport } = wp.blocks;

function CustomCSSOverflowTools(props) {
  const { getStyle, hasStyle, setStyles } = useStyles(props);

  const hasOverflow = hasStyle('overflow-x') || hasStyle('overflow-y');

  return (
    <ToolsPanelItem
      label={__('Overflow', '@@text_domain')}
      hasValue={() => !!hasOverflow}
      onSelect={() => {
        if (!hasStyle('overflow-x') || !hasStyle('overflow-y')) {
          setStyles({
            'overflow-x': 'hidden',
            'overflow-y': 'hidden',
          });
        }
      }}
      onDeselect={() => {
        if (hasStyle('overflow-x') || hasStyle('overflow-x')) {
          setStyles({
            'overflow-x': undefined,
            'overflow-y': undefined,
          });
        }
      }}
      isShownByDefault={false}
    >
      <BaseControl label={__('Overflow', '@@text_domain')}>
        <Grid columns={2}>
          <SelectControl
            help={__('X', '@@text_domain')}
            value={getStyle('overflow-x')}
            onChange={(val) => {
              setStyles({ 'overflow-x': val });
            }}
            options={[
              {
                value: 'hidden',
                label: __('Hidden', '@@text_domain'),
              },
              {
                value: 'visible',
                label: __('Visible', '@@text_domain'),
              },
              {
                value: 'auto',
                label: __('Auto', '@@text_domain'),
              },
            ]}
          />
          <SelectControl
            help={__('Y', '@@text_domain')}
            value={getStyle('overflow-y')}
            onChange={(val) => {
              setStyles({ 'overflow-y': val });
            }}
            options={[
              {
                value: 'hidden',
                label: __('Hidden', '@@text_domain'),
              },
              {
                value: 'visible',
                label: __('Visible', '@@text_domain'),
              },
              {
                value: 'auto',
                label: __('Auto', '@@text_domain'),
              },
            ]}
          />
        </Grid>
      </BaseControl>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.customCSS.tools',
  'ghostkit/extension/customCSS/tools/overflow',
  (children, { props }) => {
    const hasOverflowSupport = hasBlockSupport(props.name, ['ghostkit', 'customCSS', 'overflow']);

    if (!hasOverflowSupport) {
      return children;
    }

    return (
      <>
        {children}
        <CustomCSSOverflowTools {...props} />
      </>
    );
  }
);
