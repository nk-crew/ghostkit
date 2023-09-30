/**
 * Internal dependencies
 */
import getIcon from '../../../utils/get-icon';

import UrlPicker from './url-picker';

/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { BlockControls } = wp.blockEditor;
const { ToolbarGroup, ToolbarButton, ToolbarDropdownMenu } = wp.components;

export default function EditBlockControls({ attributes, setAttributes, isSelected }) {
  const { justify, flipH, flipV } = attributes;

  const iconStart = getIcon('icon-horizontal-start');
  const iconCenter = getIcon('icon-horizontal-center');
  const iconEnd = getIcon('icon-horizontal-end');
  let iconAlign;

  if (justify === 'start') {
    iconAlign = iconStart;
  } else if (justify === 'center') {
    iconAlign = iconCenter;
  } else {
    iconAlign = iconEnd;
  }

  const aligns = {
    start: __('Start', '@@text_domain'),
    center: __('Center', '@@text_domain'),
    end: __('End', '@@text_domain'),
  };

  return (
    <>
      <UrlPicker attributes={attributes} setAttributes={setAttributes} isSelected={isSelected} />
      <BlockControls group="block">
        <ToolbarGroup>
          <ToolbarDropdownMenu
            icon={iconAlign}
            label={sprintf(__('Aligned to %s', '@@text_domain'), aligns[justify])}
            controls={[
              {
                title: __('Justify Start', '@@text_domain'),
                icon: iconStart,
                isActive: justify === 'start',
                onClick: () => setAttributes({ justify: 'start' }),
              },
              {
                title: __('Justify Center', '@@text_domain'),
                icon: iconCenter,
                isActive: justify === 'center',
                onClick: () => setAttributes({ justify: 'center' }),
              },
              {
                title: __('Justify End', '@@text_domain'),
                icon: iconEnd,
                isActive: justify === 'end',
                onClick: () => setAttributes({ justify: 'end' }),
              },
            ]}
          />
        </ToolbarGroup>
      </BlockControls>
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
