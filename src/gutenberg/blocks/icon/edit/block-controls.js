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
const { ToolbarGroup, ToolbarButton } = wp.components;

export default function EditBlockControls({ attributes, setAttributes, isSelected }) {
  const { flipH, flipV } = attributes;

  return (
    <>
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
