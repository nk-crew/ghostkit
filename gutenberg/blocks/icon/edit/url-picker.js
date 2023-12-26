import URLPicker from '../../../components/url-picker';

export default function UrlPicker(props) {
	const { attributes, setAttributes, isSelected } = props;
	const { url, rel, ariaLabel, target } = attributes;

	return (
		<URLPicker
			url={url}
			rel={rel}
			ariaLabel={ariaLabel}
			target={target}
			onChange={(data) => setAttributes(data)}
			isSelected={isSelected}
			toolbarSettings
			inspectorSettings
		/>
	);
}
