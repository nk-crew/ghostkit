/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import EditBlockControls from './edit/block-controls';
import EditInspectorControls from './edit/inspector-controls';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { useSelect } = wp.data;
const {
  useBlockProps,
  useInnerBlocksProps,
  InnerBlocks,
  __experimentalUseBorderProps: useBorderProps,
} = wp.blockEditor;

export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected, clientId } = props;
  let { className = '' } = props;

  const borderProps = useBorderProps(attributes);

  const hasChildBlocks = useSelect(
    (select) => {
      const blockEditor = select('core/block-editor');

      return blockEditor ? blockEditor.getBlockOrder(clientId).length > 0 : false;
    },
    [clientId]
  );

  className = classnames(className, 'ghostkit-card', borderProps.className);
  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });
  const innerBlockProps = useInnerBlocksProps(blockProps, {
    renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
    templateLock: false,
  });

  return (
    <>
      <EditBlockControls
        attributes={attributes}
        setAttributes={setAttributes}
        isSelected={isSelected}
      />
      <EditInspectorControls attributes={attributes} setAttributes={setAttributes} />

      <div {...innerBlockProps} />
    </>
  );
}
