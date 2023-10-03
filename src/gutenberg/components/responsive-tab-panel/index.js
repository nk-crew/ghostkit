/**
 * Internal dependencies
 */
import ActiveIndicator from '../active-indicator';
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;

const { Tooltip, TabPanel } = wp.components;

const { ghostkitVariables } = window;

/**
 * Component Class
 */
export default function ResponsiveTabPanel(props) {
  const {
    filledTabs = {},
    activeClass = 'is-active',
    instanceId,
    orientation = 'horizontal',
    children,
  } = props;

  if (
    !ghostkitVariables ||
    !ghostkitVariables.media_sizes ||
    !Object.keys(ghostkitVariables.media_sizes).length
  ) {
    return __('No media sizes found.', '@@text_domain');
  }

  const tabs = [];
  const icons = [
    getIcon('tabs-mobile'),
    getIcon('tabs-tablet'),
    getIcon('tabs-laptop'),
    getIcon('tabs-desktop'),
    getIcon('tabs-tv'),
  ];

  [...Object.keys(ghostkitVariables.media_sizes), 'all'].forEach((mediaName, i) => {
    tabs.unshift({
      name: mediaName,
      title: (
        <Tooltip
          text={
            mediaName === 'all'
              ? __('All devices', '@@text_domain')
              : sprintf(
                  __('Devices with screen width <= %s', '@@text_domain'),
                  `${ghostkitVariables.media_sizes[mediaName]}px`
                )
          }
        >
          <span className="ghostkit-control-tabs-icon">
            {icons[i]}
            {filledTabs && filledTabs[mediaName] ? <ActiveIndicator /> : ''}
          </span>
        </Tooltip>
      ),
      className: 'ghostkit-control-tabs-tab',
    });
  });

  return (
    <TabPanel
      className="ghostkit-control-tabs ghostkit-control-tabs-wide"
      tabs={tabs}
      activeClass={activeClass}
      instanceId={instanceId}
      orientation={orientation}
    >
      {children}
    </TabPanel>
  );
}
