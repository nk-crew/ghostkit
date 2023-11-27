/**
 * Internal dependencies
 */
import ResponsiveToggle from '../../../components/responsive-toggle';
import useStyles from '../../../hooks/use-styles';
import useResponsive from '../../../hooks/use-responsive';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { addFilter } from '@wordpress/hooks';

import {
  BaseControl,
  __stableToolsPanelItem as StableToolsPanelItem,
  __experimentalToolsPanelItem as ExperimentalToolsPanelItem,
} from '@wordpress/components';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { hasBlockSupport } from '@wordpress/blocks';

function CustomCSSOpacityTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasOpacity = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasOpacity = hasOpacity || hasStyle('opacity', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Opacity', 'ghostkit')}
      hasValue={() => !!hasOpacity}
      onSelect={() => {
        if (!hasStyle('opacity')) {
          setStyles({ opacity: 1 });
        }
      }}
      onDeselect={() => {
        resetStyles(['opacity'], true);
      }}
      isShownByDefault={false}
    >
      <RangeControl
        label={
          <>
            {__('Opacity', 'ghostkit')}
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
