/**
 * Internal dependencies
 */
import getIcon from '../../../utils/get-icon';

import UrlPicker from './url-picker';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { BlockControls } = wp.blockEditor;
const { ToolbarGroup, ToolbarButton, ToolbarDropdownMenu } = wp.components;

export default function EditBlockControls({ attributes, setAttributes, isSelected }) {
  const { justify, flipH, flipV } = attributes;

  const iconStart = getIcon('icon-horizontal-start');
  const iconCenter = getIcon('icon-horizontal-center');
  const iconEnd = getIcon('icon-horizontal-end');

  const justifyControls = [
    {
      title: __('Justify Icon Start', '@@text_domain'),
      icon: iconStart,
      isActive: justify === 'start',
      onClick: () => setAttributes({ justify: 'start' }),
    },
    {
      title: __('Justify Icon Center', '@@text_domain'),
      icon: iconCenter,
      isActive: justify === 'center',
      onClick: () => setAttributes({ justify: 'center' }),
    },
    {
      title: __('Justify Icon End', '@@text_domain'),
      icon: iconEnd,
      isActive: justify === 'end',
      onClick: () => setAttributes({ justify: 'end' }),
    },
  ];

  let currentJustifyIcon;
  if (justify === 'start') {
    currentJustifyIcon = iconStart;
  } else if (justify === 'center') {
    currentJustifyIcon = iconCenter;
  } else {
    currentJustifyIcon = iconEnd;
  }

  return (
    <>
      <BlockControls group="block">
        <ToolbarGroup>
          <ToolbarDropdownMenu
            icon={currentJustifyIcon}
            label={__('Justify Icon', '@@text_domain')}
            controls={justifyControls}
          />
        </ToolbarGroup>
      </BlockControls>

      <UrlPicker attributes={attributes} setAttributes={setAttributes} isSelected={isSelected} />

      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon={getIcon('icon-flip-horizontal')}
            title={__('Flip Horizontal', '@@text_domain')}
            onClick={() => setAttributes({ flipH: !flipH })}
            isActive={flipH}
          />
          <ToolbarButton
            icon={getIcon('icon-flip-vertical')}
            title={__('Flip Vertical', '@@text_domain')}
            onClick={() => setAttributes({ flipV: !flipV })}
            isActive={flipV}
          />
        </ToolbarGroup>
      </BlockControls>
    </>
  );
}
