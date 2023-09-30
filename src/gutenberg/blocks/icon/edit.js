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
      <EditBlockControls
        attributes={attributes}
        setAttributes={setAttributes}
        isSelected={isSelected}
      />
      <EditInspectorControls attributes={attributes} setAttributes={setAttributes} />

      <span {...blockProps}>
        <Icon attributes={attributes} setAttributes={setAttributes} />
      </span>
    </>
  );
}

function Icon({ attributes, setAttributes }) {
  const { icon } = attributes;
  const defaultIcon = `<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.1853 20C7.11763 19.5961 3.94075 16.1642 3.94075 11.9902C3.94075 7.54462 7.54463 3.94073 11.9902 3.94073C16.1642 3.94073 19.5962 7.11764 20 11.1853H16.9571C16.5719 8.78944 14.4948 6.95931 11.9902 6.95931C9.21174 6.95931 6.95931 9.21174 6.95931 11.9902C6.95931 14.4948 8.78943 16.5719 11.1853 16.9571V20ZM16.9571 12.7952H20C19.8392 14.4142 19.1988 15.892 18.2229 17.0846L16.0713 14.9329C16.5199 14.3118 16.8303 13.5842 16.9571 12.7952ZM14.9329 16.0713C14.3118 16.5199 13.5842 16.8303 12.7952 16.9571V20C14.4141 19.8392 15.8919 19.1989 17.0845 18.2229L14.9329 16.0713Z" fill="currentColor"/></svg>`;

  const borderProps = useBorderProps(attributes);
  const colorProps = useColorProps(attributes);
  const spacingProps = useSpacingProps(attributes);

  return (
    <span
      className={classnames(
        'ghostkit-icon-inline',
        borderProps.className,
        colorProps.className,
        spacingProps.className
      )}
    >
      <IconPicker.Dropdown
        onChange={(val) => setAttributes({ icon: val })}
        value={icon || defaultIcon}
        renderToggle={({ onToggle }) => (
          <IconPicker.Preview onClick={onToggle} name={icon || defaultIcon} />
        )}
      />
    </span>
  );
}
