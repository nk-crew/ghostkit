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
	__stableUnitControl as StableUnitControl,
	__experimentalUnitControl as ExperimentalUnitControl,
} from '@wordpress/components';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;
const UnitControl = StableUnitControl || ExperimentalUnitControl;

import { hasBlockSupport } from '@wordpress/blocks';

function PositionWidthTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasWidth = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasWidth = hasWidth || hasStyle('width', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Width', '@@text_domain')}
      hasValue={() => !!hasWidth}
      onDeselect={() => {
        resetStyles(['width'], true);
      }}
      isShownByDefault={false}
    >
      <UnitControl
        label={
          <>
            {__('Width', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('width', checkMedia);
              }}
            />
          </>
        }
        value={getStyle('width', device)}
        onChange={(val) => {
          setStyles({ width: val }, device);
        }}
        labelPosition="edge"
        __unstableInputWidth="70px"
        units={[
          { value: 'px', label: 'px' },
          { value: '%', label: '%' },
          { value: 'em', label: 'em' },
          { value: 'rem', label: 'rem' },
          { value: 'vw', label: 'vw' },
          { value: 'vh', label: 'vh' },
        ]}
        min={0}
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.position.tools',
  'ghostkit/extension/position/tools/width',
  (children, { props }) => {
    const hasWidthSupport = hasBlockSupport(props.name, ['ghostkit', 'position', 'width']);

    if (!hasWidthSupport) {
      return children;
    }

    return (
      <>
        {children}
        <PositionWidthTools {...props} />
      </>
    );
  }
);
