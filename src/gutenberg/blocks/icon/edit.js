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

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const {
  useBlockProps,
  __experimentalUseBorderProps: useBorderProps,
  __experimentalUseColorProps: useColorProps,
  __experimentalGetSpacingClassesAndStyles: useSpacingProps,
} = wp.blockEditor;

export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected } = props;
  let { className = '' } = props;

  className = classnames(className, 'ghostkit-icon');
  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });

  return (
    <>
      <EditInspectorControls attributes={attributes} setAttributes={setAttributes} />
      <EditBlockControls
        attributes={attributes}
        setAttributes={setAttributes}
        isSelected={isSelected}
      />

      <span {...blockProps}>
        <Icon icon={attributes.icon} attributes={attributes} setAttributes={setAttributes} />
      </span>
    </>
  );
}

function Icon({ icon, attributes }) {
  const borderProps = useBorderProps(attributes);
  const colorProps = useColorProps(attributes);
  const spacingProps = useSpacingProps(attributes);

  const className = classnames(
    'ghostkit-icon-inner',
    borderProps.className,
    colorProps.className,
    spacingProps.className
  );

  return <IconPicker.Preview tag="div" name={icon} className={className} />;
}
