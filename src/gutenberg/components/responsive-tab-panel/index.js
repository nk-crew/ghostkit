import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ActiveIndicator from '../active-indicator';
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;

const { Tooltip, Button } = wp.components;

const { useSelect, useDispatch } = wp.data;

const { ghostkitVariables } = window;

/**
 * Component Class
 */
export default function ResponsiveTabPanel(props) {
  const { children } = props;

  // Fallback for deprecated filledTabs prop.
  const active = props?.active || props?.filledTabs || {};

  const { device } = useSelect((select) => {
    const { getDevice } = select('ghostkit/responsive');

    return {
      device: getDevice(),
    };
  });

  const { setDevice } = useDispatch('ghostkit/responsive');

  const tabs = [];
  const icons = [
    getIcon('tabs-mobile'),
    getIcon('tabs-tablet'),
    getIcon('tabs-laptop'),
    getIcon('tabs-desktop'),
    getIcon('tabs-tv'),
  ];

  [...Object.keys(ghostkitVariables.media_sizes), ''].forEach((mediaName, i) => {
    tabs.unshift({
      name: mediaName,
      title: (
        <Tooltip
          text={
            !mediaName
              ? __('All devices', '@@text_domain')
              : sprintf(
                  __('Devices with screen width <= %s', '@@text_domain'),
                  `${ghostkitVariables.media_sizes[mediaName]}px`
                )
          }
        >
          <span className="ghostkit-control-tabs-icon">
            {icons[i]}
            {active && active[mediaName] ? <ActiveIndicator /> : ''}
          </span>
        </Tooltip>
      ),
    });
  });

  return (
    <div className="ghostkit-control-tabs ghostkit-control-tabs-wide">
      <div className="components-tab-panel__tabs">
        {tabs.map((data) => {
          return (
            <Button
              key={data.name}
              className={classnames(
                'ghostkit-control-tabs-tab',
                data.name === device && 'is-active'
              )}
              onClick={() => {
                setDevice(data.name);
              }}
            >
              {data.title}
            </Button>
          );
        })}
      </div>
      {children({ name: device })}
    </div>
  );
}
