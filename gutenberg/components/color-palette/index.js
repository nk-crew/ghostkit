import ApplyFilters from '../apply-filters';

const { ColorPalette: WPColorPalette } = wp.components;

const { __experimentalUseMultipleOriginColorsAndGradients: useMultipleOriginColorsAndGradients } =
  wp.blockEditor;

const { useSelect } = wp.data;

function useColors() {
  // New way to get colors and gradients.
  if (useMultipleOriginColorsAndGradients && useMultipleOriginColorsAndGradients()) {
    return useMultipleOriginColorsAndGradients().colors;
  }

  // Old way.
  const { themeColors } = useSelect((select) => {
    const settings = select('core/block-editor').getSettings();

    return {
      themeColors: settings.colors,
    };
  });

  const colors = [];

  if (themeColors && themeColors.length) {
    colors.push({ name: 'Theme', colors: themeColors });
  }

  return colors;
}

export default function ColorPalette(props) {
  const { value, alpha = false, palette = true, onChange = () => {} } = props;

  const colors = palette ? useColors() : false;

  return (
    <ApplyFilters name="ghostkit.component.color-palette" props={props}>
      <WPColorPalette
        colors={colors}
        value={value}
        enableAlpha={alpha}
        onChange={(val) => {
          onChange(val);
        }}
        __experimentalHasMultipleOrigins
        __experimentalIsRenderedInSidebar
      />
    </ApplyFilters>
  );
}
