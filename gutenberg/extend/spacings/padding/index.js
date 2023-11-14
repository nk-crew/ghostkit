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

const allPaddings = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'];

function SpacingsPaddingTools(props) {
  const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasPadding = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    allPaddings.forEach((thisPadding) => {
      hasPadding = hasPadding || hasStyle(thisPadding, thisDevice);
    });
  });

  return (
    <ToolsPanelItem
      label={__('Padding', '@@text_domain')}
      hasValue={() => !!hasPadding}
      onDeselect={() => {
        resetStyles(allPaddings, true);
      }}
      isShownByDefault={false}
    >
      <BaseControl
        label={
          <>
            {__('Padding', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                let isActive = false;

                allPaddings.forEach((thisPadding) => {
                  isActive = isActive || hasStyle(thisPadding, checkMedia);
                });

                return isActive;
              }}
            />
          </>
        }
        className="ghostkit-tools-panel-spacings-row"
      >
        <div>
          {allPaddings.map((paddingName) => {
            let label = __('Top', '@@text_domain');

            switch (paddingName) {
              case 'padding-right':
                label = __('Right', '@@text_domain');
                break;
              case 'padding-bottom':
                label = __('Bottom', '@@text_domain');
                break;
              case 'padding-left':
                label = __('Left', '@@text_domain');
                break;
              // no default
            }

            let value = getStyle(paddingName, device);

            const withImportant = / !important$/.test(value);
            if (withImportant) {
              value = value.replace(/ !important$/, '');
            }

            return (
              <div key={paddingName} className="ghostkit-tools-panel-spacings-item">
                <InputDrag
                  help={label}
                  value={value}
                  placeholder="-"
                  onChange={(val) => {
                    const newValue = val
                      ? `${val}${withImportant ? ' !important' : ''}`
                      : undefined;

                    setStyles({ [paddingName]: newValue }, device);
                  }}
                  autoComplete="off"
                />
                <ImportantToggle
                  onClick={(newWithImportant) => {
                    if (value) {
                      const newValue = `${value}${newWithImportant ? ' !important' : ''}`;

                      setStyles({ [paddingName]: newValue }, device);
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
  'ghostkit/extension/spacings/tools/padding',
  (children, { props }) => {
    const hasPaddingSupport = hasBlockSupport(props.name, ['ghostkit', 'spacings', 'padding']);

    if (!hasPaddingSupport) {
      return children;
    }

    return (
      <>
        {children}
        <SpacingsPaddingTools {...props} />
      </>
    );
  }
);
