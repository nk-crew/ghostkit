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
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const {
  BaseControl,
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const { hasBlockSupport } = wp.blocks;

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
      label={__('Margin', '@@text_domain')}
      hasValue={() => !!hasMargin}
      onDeselect={() => {
        resetStyles(allMargins, true);
      }}
      isShownByDefault={false}
    >
      <BaseControl
        label={
          <>
            {__('Margin', '@@text_domain')}
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
            let label = __('Top', '@@text_domain');

            switch (marginName) {
              case 'margin-right':
                label = __('Right', '@@text_domain');
                break;
              case 'margin-bottom':
                label = __('Bottom', '@@text_domain');
                break;
              case 'margin-left':
                label = __('Left', '@@text_domain');
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
