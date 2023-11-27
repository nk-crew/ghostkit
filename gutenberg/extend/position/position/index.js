/**
 * Internal dependencies
 */
import ResponsiveToggle from '../../../components/responsive-toggle';
import Notice from '../../../components/notice';
import useStyles from '../../../hooks/use-styles';
import useResponsive from '../../../hooks/use-responsive';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { addFilter } from '@wordpress/hooks';

import {
	SelectControl,
  __stableToolsPanelItem as StableToolsPanelItem,
  __experimentalToolsPanelItem as ExperimentalToolsPanelItem,
} from '@wordpress/components';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { hasBlockSupport } from '@wordpress/blocks';

function PositionPositionTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasPosition = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasPosition = hasPosition || hasStyle('position', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Position', 'ghostkit')}
      hasValue={() => !!hasPosition}
      onSelect={() => {
        if (!hasStyle('position')) {
          setStyles({ position: 'default' });
        }
      }}
      onDeselect={() => {
        resetStyles(['position'], true);
      }}
      isShownByDefault={false}
    >
      {['absolute', 'fixed'].includes(getStyle('position', device)) ? (
        <>
          <Notice status="info" isDismissible={false}>
            {__(
              'Please note! Custom positioning is not considered best practice for responsive web design and should not be used too frequently.',
              'ghostkit'
            )}
          </Notice>
          <br />
        </>
      ) : null}
      <SelectControl
        label={
          <>
            {__('Position', 'ghostkit')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('position', checkMedia);
              }}
            />
          </>
        }
        value={getStyle('position', device)}
        onChange={(val) => {
          setStyles({ position: val || undefined }, device);
        }}
        options={[
          {
            value: '',
            label: __('Default', 'ghostkit'),
          },
          {
            value: 'absolute',
            label: __('Absolute', 'ghostkit'),
          },
          {
            value: 'fixed',
            label: __('Fixed', 'ghostkit'),
          },
          {
            value: 'relative',
            label: __('Relative', 'ghostkit'),
          },
          {
            value: 'sticky',
            label: __('Sticky', 'ghostkit'),
          },
        ]}
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.position.tools',
  'ghostkit/extension/position/tools/position',
  (children, { props }) => {
    const hasPositionSupport = hasBlockSupport(props.name, ['ghostkit', 'position', 'position']);

    if (!hasPositionSupport) {
      return children;
    }

    return (
      <>
        {children}
        <PositionPositionTools {...props} />
      </>
    );
  }
);
