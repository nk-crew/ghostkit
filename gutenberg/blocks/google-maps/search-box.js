import { TextControl } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';

/*
 * Search Box Component.
 */
export default function SearchBox(props) {
	const { label, placeholder, className, onChange } = props;

	const inputRef = useRef(null);
	const [value, setValue] = useState('');

	useEffect(() => {
		if (!inputRef?.current || !window?.google?.maps?.places) {
			return;
		}

		const searchBox = new window.google.maps.places.SearchBox(
			inputRef.current
		);

		searchBox.addListener('places_changed', () => {
			const places = searchBox.getPlaces();

			if (onChange) {
				onChange(places);

				if (places && places[0]) {
					setValue(places[0].formatted_address);
				}
			}
		});
	}, [inputRef, onChange]);

	return (
		<div className={className}>
			<TextControl
				ref={inputRef}
				label={label}
				placeholder={placeholder}
				value={value}
				onChange={(val) => {
					setValue(val);
				}}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</div>
	);
}
