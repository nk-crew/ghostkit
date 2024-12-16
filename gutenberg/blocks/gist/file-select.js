import $ from 'jquery';

import { DropdownMenu, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const cache = {};

/**
 * Component Class.
 *
 * @param props
 */
export default function GistFilesSelect(props) {
	const { url, label, value, onChange, isToolbar, className } = props;

	const [items, setItems] = useState(['']);

	function updateStateItems(newItems) {
		if (items.toString() !== newItems.toString()) {
			setItems(newItems);
		}
	}

	// Mounted and updated
	useEffect(() => {
		let checkUrl = url;

		const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec(checkUrl);

		if (match && typeof match[1] !== 'undefined') {
			checkUrl = `https://gist.github.com/${match[1].split('#')[0]}.json`;
		} else {
			return;
		}

		// request the json version of this gist
		$.ajax({
			url: checkUrl,
			// data: data,
			dataType: 'jsonp',
			timeout: 20000,
			beforeSend() {
				if (cache[checkUrl]) {
					// loading the response from cache and preventing the ajax call
					cache[checkUrl].then(
						(response) => {
							updateStateItems([''].concat(response.files));
						},
						() => {
							updateStateItems(['']);
						}
					);
					return false;
				}

				// saving the promise for the requested json as a proxy for the actual response
				cache[checkUrl] = $.Deferred();
			},
			success(response) {
				if (cache[checkUrl]) {
					cache[checkUrl].resolve(response);
				}
				updateStateItems([''].concat(response.files));
			},
			error() {
				updateStateItems(['']);
			},
		});
	});

	return isToolbar ? (
		<DropdownMenu
			icon="media-default"
			label={label}
			controls={items.map((item) => ({
				title: item || __('Show all files', 'ghostkit'),
				isActive: item === value,
				onClick: () => onChange(item),
			}))}
			className={className}
		/>
	) : (
		<SelectControl
			label={label}
			value={value}
			options={items.map((item) => ({
				value: item,
				label: item || __('Show all files', 'ghostkit'),
			}))}
			onChange={onChange}
			className={className}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>
	);
}
