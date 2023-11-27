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
  __stableToolsPanelItem as StableToolsPanelItem,
  __experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableNumberControl as StableNumberControl,
	__experimentalNumberControl as ExperimentalNumberControl,
} from '@wordpress/components';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;
const NumberControl = StableNumberControl || ExperimentalNumberControl;

import { hasBlockSupport } from '@wordpress/blocks';

function PositionZIndexTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasZIndex = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasZIndex = hasZIndex || hasStyle('z-index', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('zIndex', 'ghostkit')}
      hasValue={() => !!hasZIndex}
      onDeselect={() => {
        resetStyles(['z-index'], true);
      }}
      isShownByDefault={false}
    >
      <NumberControl
        label={
          <>
            {__('zIndex', 'ghostkit')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('z-index', checkMedia);
              }}
            />
          </>
        }
        value={getStyle('z-index', device)}
        onChange={(val) => {
          setStyles({ 'z-index': val }, device);
        }}
        labelPosition="edge"
        __unstableInputWidth="70px"
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.position.tools',
  'ghostkit/extension/position/tools/zIndex',
  (children, { props }) => {
    const hasZIndexSupport = hasBlockSupport(props.name, ['ghostkit', 'position', 'zIndex']);

    if (!hasZIndexSupport) {
      return children;
    }

    return (
      <>
        {children}
        <PositionZIndexTools {...props} />
      </>
    );
  }
);
