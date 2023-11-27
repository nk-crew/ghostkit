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
  SelectControl,
  __stableToolsPanelItem as StableToolsPanelItem,
  __experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableGrid as StableGrid,
  __experimentalGrid as ExperimentalGrid,
} from '@wordpress/components';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;
const Grid = StableGrid || ExperimentalGrid;

import { hasBlockSupport } from '@wordpress/blocks';

function CustomCSSOverflowTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasOverflow = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasOverflow =
      hasOverflow || hasStyle('overflow-x', thisDevice) || hasStyle('overflow-y', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Overflow', 'ghostkit')}
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
        resetStyles(['overflow-x', 'overflow-y'], true);
      }}
      isShownByDefault={false}
    >
      <BaseControl
        label={
          <>
            {__('Overflow', 'ghostkit')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('overflow-x', checkMedia) || hasStyle('overflow-y', checkMedia);
              }}
            />
          </>
        }
      >
        <Grid columns={2}>
          <SelectControl
            help={__('X', 'ghostkit')}
            value={getStyle('overflow-x', device)}
            onChange={(val) => {
              setStyles({ 'overflow-x': val }, device);
            }}
            options={[
              {
                value: 'hidden',
                label: __('Hidden', 'ghostkit'),
              },
              {
                value: 'visible',
                label: __('Visible', 'ghostkit'),
              },
              {
                value: 'clip',
                label: __('Clip', 'ghostkit'),
              },
              {
                value: 'scroll',
                label: __('Scroll', 'ghostkit'),
              },
              {
                value: 'auto',
                label: __('Auto', 'ghostkit'),
              },
            ]}
          />
          <SelectControl
            help={__('Y', 'ghostkit')}
            value={getStyle('overflow-y', device)}
            onChange={(val) => {
              setStyles({ 'overflow-y': val }, device);
            }}
            options={[
              {
                value: 'hidden',
                label: __('Hidden', 'ghostkit'),
              },
              {
                value: 'visible',
                label: __('Visible', 'ghostkit'),
              },
              {
                value: 'clip',
                label: __('Clip', 'ghostkit'),
              },
              {
                value: 'scroll',
                label: __('Scroll', 'ghostkit'),
              },
              {
                value: 'auto',
                label: __('Auto', 'ghostkit'),
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
