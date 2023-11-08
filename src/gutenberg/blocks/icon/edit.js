/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';

import EditBlockControls from './edit/block-controls';
import EditInspectorControls from './edit/inspector-controls';
import ColorControls from './edit/color-controls';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { useBlockProps } = wp.blockEditor;

export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected, clientId } = props;
  const { flipV, flipH } = attributes;

  let { className = '' } = props;

  className = classnames(
    'ghostkit-icon',
    {
      'ghostkit-icon-flip-vertical': flipV,
      'ghostkit-icon-flip-horizontal': flipH,
    },
    className
  );

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });

  return (
    <>
      <EditInspectorControls attributes={attributes} setAttributes={setAttributes} />
      <ColorControls attributes={attributes} setAttributes={setAttributes} clientId={clientId} />
      <EditBlockControls
        attributes={attributes}
        setAttributes={setAttributes}
        isSelected={isSelected}
      />

      <span {...blockProps}>
        <IconPicker.Preview tag="div" name={attributes.icon} className="ghostkit-icon-inner" />
      </span>
    </>
  );
}
