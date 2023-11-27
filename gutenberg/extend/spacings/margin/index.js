/**
 * Internal dependencies
 */
import InputDrag from '../../../components/input-drag';
import ResponsiveToggle from '../../../components/responsive-toggle';
import ImportantToggle from '../../../components/important-toggle';
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
} from '@wordpress/components';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { hasBlockSupport } from '@wordpress/blocks';

const allMargins = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'];

function SpacingsMarginTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasMargin = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    allMargins.forEach((thisMargin) => {
      hasMargin = hasMargin || hasStyle(thisMargin, thisDevice);
    });
  });

  return (
    <ToolsPanelItem
      label={__('Margin', 'ghostkit')}
      hasValue={() => !!hasMargin}
      onDeselect={() => {
        resetStyles(allMargins, true);
      }}
      isShownByDefault={false}
    >
      <BaseControl
        label={
          <>
            {__('Margin', 'ghostkit')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                let isActive = false;

                allMargins.forEach((thisMargin) => {
                  isActive = isActive || hasStyle(thisMargin, checkMedia);
                });

                return isActive;
              }}
            />
          </>
        }
        className="ghostkit-tools-panel-spacings-row"
      >
        <div>
          {allMargins.map((marginName) => {
            let label = __('Top', 'ghostkit');

            switch (marginName) {
              case 'margin-right':
                label = __('Right', 'ghostkit');
                break;
              case 'margin-bottom':
                label = __('Bottom', 'ghostkit');
                break;
              case 'margin-left':
                label = __('Left', 'ghostkit');
                break;
              // no default
            }

            let value = getStyle(marginName, device);

            const withImportant = / !important$/.test(value);
            if (withImportant) {
              value = value.replace(/ !important$/, '');
            }

            return (
              <div key={marginName} className="ghostkit-tools-panel-spacings-item">
                <InputDrag
                  help={label}
                  value={value}
                  placeholder="-"
                  onChange={(val) => {
                    const newValue = val
                      ? `${val}${withImportant ? ' !important' : ''}`
                      : undefined;

                    setStyles({ [marginName]: newValue }, device);
                  }}
                  autoComplete="off"
                />
                <ImportantToggle
                  onClick={(newWithImportant) => {
                    if (value) {
                      const newValue = `${value}${newWithImportant ? ' !important' : ''}`;

                      setStyles({ [marginName]: newValue }, device);
                    }
                  }}
                  isActive={withImportant}
                />
              </div>
            );
          })}
        </div>
      </BaseControl>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.spacings.tools',
  'ghostkit/extension/spacings/tools/margin',
  (children, { props }) => {
    const hasMarginSupport = hasBlockSupport(props.name, ['ghostkit', 'spacings', 'margin']);

    if (!hasMarginSupport) {
      return children;
    }

    return (
      <>
        {children}
        <SpacingsMarginTools {...props} />
      </>
    );
  }
);
