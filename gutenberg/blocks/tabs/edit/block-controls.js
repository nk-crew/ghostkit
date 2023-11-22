/**
 * Internal dependencies
 */
import getIcon from '../../../utils/get-icon';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';

export default function EditBlockControls({ attributes, setAttributes }) {
  const { buttonsAlign, buttonsVerticalAlign } = attributes;

  const alignConf = {
    start: {
      icon: getIcon('icon-horizontal-start'),
      label: __('Buttons Justify Start', '@@text_domain'),
    },
    center: {
      icon: getIcon('icon-horizontal-center'),
      label: __('Buttons Justify Center', '@@text_domain'),
    },
    end: {
      icon: getIcon('icon-horizontal-end'),
      label: __('Buttons Justify End', '@@text_domain'),
    },
    stretch: {
      icon: getIcon('icon-horizontal-stretch'),
      label: __('Buttons Justify Stretch', '@@text_domain'),
    },
  };

  if (buttonsVerticalAlign) {
    alignConf.start.icon = getIcon('icon-vertical-top');
    alignConf.start.label = __('Buttons Vertical Start', '@@text_domain');
    alignConf.center.icon = getIcon('icon-vertical-center');
    alignConf.center.label = __('Buttons Vertical Center', '@@text_domain');
    alignConf.end.icon = getIcon('icon-vertical-bottom');
    alignConf.end.label = __('Buttons Vertical End', '@@text_domain');
    alignConf.stretch = undefined;
  }

  const alignControls = [];
  Object.entries(alignConf).forEach((item) => {
    if (!item[1]) return;
    alignControls.push({
      title: item[1].label,
      icon: item[1].icon,
      isActive: buttonsAlign === item[0],
      onClick: () => setAttributes({ buttonsAlign: item[0] }),
    });
  });

  const alignLabel = buttonsVerticalAlign
    ? __('Buttons Vertical Align', '@@text_domain')
    : __('Buttons Justify Align', '@@text_domain');

  return (
    <BlockControls group="block">
      <ToolbarGroup>
        <ToolbarDropdownMenu
          icon={alignConf[buttonsAlign].icon}
          label={alignLabel}
          controls={alignControls}
        />
      </ToolbarGroup>
    </BlockControls>
  );
}
