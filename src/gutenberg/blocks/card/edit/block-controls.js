/**
 * Internal dependencies
 */
import UrlPicker from './url-picker';

export default function EditBlockControls({ attributes, setAttributes, isSelected }) {
  return (
    <UrlPicker attributes={attributes} setAttributes={setAttributes} isSelected={isSelected} />
  );
}
