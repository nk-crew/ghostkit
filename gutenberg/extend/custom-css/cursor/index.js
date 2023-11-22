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
  SelectControl,
  __stableToolsPanelItem as StableToolsPanelItem,
  __experimentalToolsPanelItem as ExperimentalToolsPanelItem,
} from '@wordpress/components';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { hasBlockSupport } from '@wordpress/blocks';

function CustomCSSCursorTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasCursor = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasCursor = hasCursor || hasStyle('cursor', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Cursor', '@@text_domain')}
      hasValue={() => !!hasCursor}
      onSelect={() => {
        if (!hasStyle('cursor')) {
          setStyles({ cursor: 'default' });
        }
      }}
      onDeselect={() => {
        resetStyles(['cursor'], true);
      }}
      isShownByDefault={false}
    >
      <SelectControl
        label={
          <>
            {__('Cursor', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('cursor', checkMedia);
              }}
            />
          </>
        }
        value={getStyle('cursor', device)}
        onChange={(val) => {
          setStyles({ cursor: val }, device);
        }}
        options={[
          {
            value: 'default',
            label: __('Default', '@@text_domain'),
          },
          {
            value: 'pointer',
            label: __('Pointer', '@@text_domain'),
          },
          {
            value: 'not-allowed',
            label: __('Not Allowed', '@@text_domain'),
          },
          {
            value: 'progress',
            label: __('Progress', '@@text_domain'),
          },
          {
            value: 'move',
            label: __('Move', '@@text_domain'),
          },
          {
            value: 'grab',
            label: __('Grab', '@@text_domain'),
          },
          {
            value: 'grabbing',
            label: __('Grabbing', '@@text_domain'),
          },
          {
            value: 'zoom-in',
            label: __('Zoom In', '@@text_domain'),
          },
          {
            value: 'zoom-out',
            label: __('Zoom Out', '@@text_domain'),
          },
          {
            value: 'copy',
            label: __('Copy', '@@text_domain'),
          },
          {
            value: 'no-drop',
            label: __('No Drop', '@@text_domain'),
          },
          {
            value: 'context-menu',
            label: __('Context Menu', '@@text_domain'),
          },
          {
            value: 'help',
            label: __('Help', '@@text_domain'),
          },
          {
            value: 'wait',
            label: __('Wait', '@@text_domain'),
          },
          {
            value: 'cell',
            label: __('Cell', '@@text_domain'),
          },
          {
            value: 'crosshair',
            label: __('Crosshair', '@@text_domain'),
          },
          {
            value: 'alias',
            label: __('Alias', '@@text_domain'),
          },
          {
            value: 'text',
            label: __('Text', '@@text_domain'),
          },
          {
            value: 'vertical-text',
            label: __('Vertical Text', '@@text_domain'),
          },
          {
            value: 'copy',
            label: __('Copy', '@@text_domain'),
          },
          {
            value: 'nw-resize',
            label: __('NW Resize', '@@text_domain'),
          },
          {
            value: 'n-resize',
            label: __('N Resize', '@@text_domain'),
          },
          {
            value: 'e-resize',
            label: __('E Resize', '@@text_domain'),
          },
          {
            value: 'se-resize',
            label: __('SE Resize', '@@text_domain'),
          },
          {
            value: 's-resize',
            label: __('S Resize', '@@text_domain'),
          },
          {
            value: 'sw-resize',
            label: __('SW Resize', '@@text_domain'),
          },
          {
            value: 'w-resize',
            label: __('W Resize', '@@text_domain'),
          },
          {
            value: 'ew-resize',
            label: __('EW Resize', '@@text_domain'),
          },
          {
            value: 'ns-resize',
            label: __('NS Resize', '@@text_domain'),
          },
          {
            value: 'nwse-resize',
            label: __('NWSE Resize', '@@text_domain'),
          },
          {
            value: 'nesw-resize',
            label: __('NESW Resize', '@@text_domain'),
          },
          {
            value: 'col-resize',
            label: __('Col Resize', '@@text_domain'),
          },
          {
            value: 'row-resize',
            label: __('Row Resize', '@@text_domain'),
          },
          {
            value: 'none',
            label: __('None', '@@text_domain'),
          },
        ]}
      />
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.customCSS.tools',
  'ghostkit/extension/customCSS/tools/cursor',
  (children, { props }) => {
    const hasCursorSupport = hasBlockSupport(props.name, ['ghostkit', 'customCSS', 'cursor']);

    if (!hasCursorSupport) {
      return children;
    }

    return (
      <>
        {children}
        <CustomCSSCursorTools {...props} />
      </>
    );
  }
);
