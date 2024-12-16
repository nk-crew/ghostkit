import classnames from 'classnames/dedupe';
import { debounce } from 'throttle-debounce';

import apiFetch from '@wordpress/api-fetch';
import {
	BlockControls,
	InspectorControls,
	MediaUpload,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	Dropdown,
	ExternalLink,
	PanelBody,
	ResizableBox,
	TextareaControl,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import DropdownPicker from '../../components/dropdown-picker';
import ImagePicker from '../../components/image-picker';
import RangeControl from '../../components/range-control';
import { maybeDecode, maybeEncode } from '../../utils/encode-decode';
import getIcon from '../../utils/get-icon';
import { ReactComponent as IconMarker } from './icons/marker.svg';
import MapBlock from './map-block';
import styles from './map-styles';
import SearchBox from './search-box';

const { GHOSTKIT } = window;

const mapsUrl = `${GHOSTKIT.googleMapsAPIUrl}&libraries=geometry,drawing,places`;
let geocoder = false;

const MIN_MARKER_WIDTH = 10;
const MAX_MARKER_WIDTH = 100;

function getStyles(string) {
	let result = [];

	try {
		result = JSON.parse(maybeDecode(string));
	} catch (e) {
		return [];
	}

	return result;
}

function MarkerSettings(props) {
	const {
		googleMapURL,
		title,
		address,
		addresses,
		lat,
		lng,
		iconImageURL,
		iconImageCustomWidth,
		infoWindowText,
		onChange,
	} = props;

	const previewIcon = iconImageURL ? (
		<img src={iconImageURL} width={iconImageCustomWidth} alt="" />
	) : (
		<img
			src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi3_hdpi.png"
			width="27"
			alt=""
		/>
	);

	return (
		<>
			<TextControl
				label={__('Title', 'ghostkit')}
				value={title}
				onChange={(value) => {
					onChange({ title: value });
				}}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
			<SearchBox
				googleMapURL={googleMapURL}
				label={__('Address', 'ghostkit')}
				value={address || addresses[lat + lng] || ''}
				onChange={(value) => {
					if (value && value[0]) {
						onChange({
							address: value[0].formatted_address,
							lat: value[0].geometry.location.lat(),
							lng: value[0].geometry.location.lng(),
						});
					}
				}}
				className="ghostkit-google-maps-search-box"
			/>
			<div className="ghostkit-google-maps-marker-options-content-icon">
				{previewIcon}
				<MediaUpload
					onSelect={(media) => {
						if (!media || !media.url) {
							return;
						}

						onChange({
							iconImageID: media.id,
							iconImageURL: media.url,
							iconImageCustomWidth: Math.min(
								MAX_MARKER_WIDTH,
								media.width
							),
							iconImageWidth: media.width,
							iconImageHeight: media.height,
						});
					}}
					allowedTypes={['image']}
					value={iconImageURL || false}
					render={({ open }) => (
						<Button variant="secondary" onClick={open}>
							{__('Change Icon', 'ghostkit')}
						</Button>
					)}
				/>
			</div>
			{iconImageCustomWidth ? (
				<div>
					<Button
						className="ghostkit-google-maps-icon-reset"
						onClick={() => {
							onChange({
								iconImageID: '',
								iconImageURL: '',
								iconImageCustomWidth: '',
								iconImageWidth: '',
								iconImageHeight: '',
							});
						}}
					>
						{__('Reset Icon to Default', 'ghostkit')}
					</Button>
				</div>
			) : null}
			{iconImageCustomWidth ? (
				<div>
					<RangeControl
						label={__('Marker Width', 'ghostkit')}
						value={iconImageCustomWidth}
						onChange={(val) =>
							onChange({ iconImageCustomWidth: val })
						}
						min={MIN_MARKER_WIDTH}
						max={MAX_MARKER_WIDTH}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</div>
			) : null}
			<BaseControl
				label={__('Info Window Text', 'ghostkit')}
				className="ghostkit-google-maps-marker-options-content-info-window-text"
				id="ghostkit-google-maps-marker-content-info-window-text"
				__nextHasNoMarginBottom
			>
				<RichText
					value={infoWindowText}
					multiline
					placeholder={__('Write text…', 'ghostkit')}
					onChange={(val) => {
						onChange({ infoWindowText: val });
					}}
					onRemove={() => {
						onChange({ infoWindowText: '' });
					}}
				/>
			</BaseControl>
		</>
	);
}

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, isSelected, toggleSelection } = props;

	let { className = '' } = props;

	const {
		height,
		zoom,
		lat,
		lng,
		showZoomButtons,
		showMapTypeButtons,
		showStreetViewButton,
		showFullscreenButton,
		optionScrollWheel,
		optionDraggable,
		gestureHandling,
		markers,
		fullHeight,
		style,
		styleCustom,
	} = attributes;

	const [mapID, setMapID] = useState(attributes.apiKey);
	const [apiKey, setApiKey] = useState(GHOSTKIT.googleMapsAPIKey);
	const [addresses, setAddresses] = useState({});

	function updateMarkerAddress(latLng, address) {
		if (markers && markers.length > 0) {
			markers.forEach((marker, index) => {
				if (
					!marker.address &&
					latLng.lat === marker.lat &&
					latLng.lng === marker.lng
				) {
					markers[index].address = address;
					addresses[latLng.lat + latLng.lng] = address;
				}
			});

			setAddresses(addresses);
		}
	}

	// Updated.
	useEffect(() => {
		// find Address by lat and lng.
		if (
			geocoder ||
			(window.google && window.google.maps && window.google.maps.Geocoder)
		) {
			geocoder = new window.google.maps.Geocoder();
		}

		if (geocoder) {
			if (markers && markers.length > 0) {
				markers.forEach((marker) => {
					if (!marker.address) {
						if (addresses[marker.lat + marker.lng]) {
							updateMarkerAddress(
								{
									lat: marker.lat,
									lng: marker.lng,
								},
								addresses[marker.lat + marker.lng]
							);
						} else {
							geocoder.geocode(
								{
									location: {
										lat: marker.lat,
										lng: marker.lng,
									},
								},
								(results, status) => {
									if (status === 'OK' && results.length) {
										updateMarkerAddress(
											{
												lat: marker.lat,
												lng: marker.lng,
											},
											results[0].formatted_address
										);
									}
								}
							);
						}
					}
				});
			}
		}
	});

	const onChangeAPIKey = debounce(600, (newKey) => {
		GHOSTKIT.googleMapsAPIKey = newKey;

		setMapID(newKey);
	});

	const saveAPIKey = debounce(3000, (newKey) => {
		apiFetch({
			path: '/ghostkit/v1/update_google_maps_api_key',
			method: 'POST',
			data: {
				key: newKey,
			},
		});
	});

	function getStylesPicker() {
		return (
			<>
				<ImagePicker
					value={maybeDecode(style)}
					options={styles}
					onChange={(value) => {
						let customString = styleCustom;

						if (value === 'default') {
							customString = '';
						} else if (value !== 'custom') {
							styles.forEach((styleData) => {
								if (value === styleData.value) {
									customString = JSON.stringify(
										styleData.json
									);
								}
							});
						}

						setAttributes({
							style: value,
							styleCustom: maybeEncode(customString),
						});
					}}
				/>
				{style === 'custom' ? (
					<>
						<TextareaControl
							placeholder={__('Enter Style JSON', 'ghostkit')}
							value={maybeDecode(styleCustom)}
							onChange={(value) =>
								setAttributes({
									styleCustom: maybeEncode(value),
								})
							}
							__nextHasNoMarginBottom
						/>
						<p>
							<em>
								{__(
									'You can use custom styles presets from the',
									'ghostkit'
								)}{' '}
								<ExternalLink href="https://snazzymaps.com/">
									{__('Snazzy Maps', 'ghostkit')}
								</ExternalLink>
								.
							</em>
						</p>
					</>
				) : null}
			</>
		);
	}

	function getMapPreview() {
		return (
			<MapBlock
				key={mapID + markers.length}
				apiUrl={`${mapsUrl}&key=${maybeEncode(apiKey)}`}
				markers={markers}
				onChangeMarkers={(newMarkers) => {
					setAttributes({ markers: newMarkers });
				}}
				options={{
					styles: styleCustom ? getStyles(styleCustom) : [],
					zoom,
					center: { lat, lng },
					zoomControl: showZoomButtons,
					zoomControlOpt: {
						style: 'DEFAULT',
						position: 'RIGHT_BOTTOM',
					},
					mapTypeControl: showMapTypeButtons,
					streetViewControl: showStreetViewButton,
					fullscreenControl: showFullscreenButton,
					gestureHandling: 'cooperative',
					scrollwheel: false,
					draggable: optionDraggable,
					onZoomChange: debounce(500, (val) =>
						setAttributes({ zoom: val })
					),
					onCenterChange: debounce(500, (val) =>
						setAttributes({ lat: val.lat(), lng: val.lng() })
					),
				}}
			/>
		);
	}

	className = classnames('ghostkit-google-maps', className);

	// add full height classname.
	if (fullHeight) {
		className = classnames(className, 'ghostkit-google-maps-fullheight');
	}

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });

	return (
		<>
			{apiKey ? (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={getIcon('icon-fullheight')}
							title={__('Full Height', 'ghostkit')}
							onClick={() =>
								setAttributes({ fullHeight: !fullHeight })
							}
							isActive={fullHeight}
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						<ToolbarButton
							icon={getIcon('icon-marker')}
							title={__('Add Marker', 'ghostkit')}
							onClick={() => {
								setAttributes({
									markers: [
										...markers,
										...[
											{
												lat,
												lng,
											},
										],
									],
								});
							}}
						/>
						<Dropdown
							renderToggle={({ onToggle }) => (
								<Button
									label={__('Style', 'ghostkit')}
									icon={getIcon('icon-map')}
									className="components-toolbar__control"
									onClick={onToggle}
								/>
							)}
							renderContent={() => (
								<div
									style={{
										minWidth: 260,
									}}
								>
									{getStylesPicker()}
								</div>
							)}
						/>
					</ToolbarGroup>
				</BlockControls>
			) : null}
			<InspectorControls group="styles">
				<PanelBody title={__('Styles', 'ghostkit')}>
					{getStylesPicker()}
				</PanelBody>
			</InspectorControls>
			<InspectorControls>
				{apiKey ? (
					<>
						<PanelBody>
							<RangeControl
								label={
									fullHeight
										? __('Minimal Height', 'ghostkit')
										: __('Height', 'ghostkit')
								}
								value={height}
								onChange={(value) =>
									setAttributes({ height: value })
								}
								min={100}
								max={800}
								allowCustomMin
								allowCustomMax
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<RangeControl
								label={__('Zoom', 'ghostkit')}
								value={zoom}
								onChange={(value) =>
									setAttributes({ zoom: value })
								}
								min={1}
								max={18}
								allowCustomMax
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
						</PanelBody>
						<PanelBody title={__('Markers', 'ghostkit')}>
							{markers && markers.length > 0 ? (
								<ul className="ghostkit-google-maps-markers">
									{markers.map((marker, index) => (
										<DropdownPicker
											key={index}
											label={
												marker.title ||
												__('Marker', 'ghostkit')
											}
											contentClassName="ghostkit-component-google-maps-markers"
										>
											<MarkerSettings
												index={index}
												googleMapURL={`${mapsUrl}&key=${maybeEncode(apiKey)}`}
												address={marker.address}
												addresses={addresses}
												lat={marker.lat}
												lng={marker.lng}
												title={marker.title}
												iconImageURL={
													marker.iconImageURL
												}
												iconImageCustomWidth={
													marker.iconImageCustomWidth
												}
												infoWindowText={
													marker.infoWindowText
												}
												onChange={(newAttrs) => {
													const newMarkers =
														Object.assign(
															[],
															markers
														);

													newMarkers[index] = {
														...newMarkers[index],
														...newAttrs,
													};

													setAttributes({
														markers: newMarkers,
													});
												}}
											/>
											<Button
												onClick={() => {
													const newMarkers =
														Object.assign(
															[],
															markers
														);

													newMarkers.splice(index, 1);

													setAttributes({
														markers: newMarkers,
													});
												}}
												className="ghostkit-google-maps-marker-remove"
											>
												{__(
													'Remove Marker',
													'ghostkit'
												)}
											</Button>
										</DropdownPicker>
									))}
								</ul>
							) : null}
							<Button
								variant="secondary"
								onClick={() => {
									setAttributes({
										markers: [
											...markers,
											...[
												{
													lat,
													lng,
												},
											],
										],
									});
								}}
							>
								{__('+ Add Marker', 'ghostkit')}
							</Button>
						</PanelBody>
						<PanelBody title={__('Options', 'ghostkit')}>
							<ToggleControl
								label={__('Zoom Buttons', 'ghostkit')}
								checked={!!showZoomButtons}
								onChange={(val) =>
									setAttributes({ showZoomButtons: val })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Map Type Buttons', 'ghostkit')}
								checked={!!showMapTypeButtons}
								onChange={(val) =>
									setAttributes({ showMapTypeButtons: val })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Street View Button', 'ghostkit')}
								checked={!!showStreetViewButton}
								onChange={(val) =>
									setAttributes({ showStreetViewButton: val })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Fullscreen Button', 'ghostkit')}
								checked={!!showFullscreenButton}
								onChange={(val) =>
									setAttributes({ showFullscreenButton: val })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Scroll Wheel', 'ghostkit')}
								checked={!!optionScrollWheel}
								onChange={(val) =>
									setAttributes({ optionScrollWheel: val })
								}
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={__('Draggable', 'ghostkit')}
								checked={!!optionDraggable}
								onChange={(val) =>
									setAttributes({ optionDraggable: val })
								}
								__nextHasNoMarginBottom
							/>
							{optionScrollWheel || optionDraggable ? (
								<ToggleControl
									label={(() => {
										if (
											optionScrollWheel &&
											optionDraggable
										) {
											return __(
												'Better Scroll & Draggable',
												'ghostkit'
											);
										}
										if (optionScrollWheel) {
											return __(
												'Better Scroll',
												'ghostkit'
											);
										}
										if (optionDraggable) {
											return __(
												'Better Draggable',
												'ghostkit'
											);
										}
										return '';
									})()}
									help={(() => {
										if (
											optionScrollWheel &&
											optionDraggable
										) {
											return __(
												'Scroll with pressed Ctrl or ⌘ key to zoom. Draggable with two fingers.',
												'ghostkit'
											);
										}
										if (optionScrollWheel) {
											return __(
												'Scroll with pressed Ctrl or ⌘ key to zoom.',
												'ghostkit'
											);
										}
										if (optionDraggable) {
											return __(
												'Draggable with two fingers.',
												'ghostkit'
											);
										}
										return '';
									})()}
									checked={gestureHandling === 'cooperative'}
									onChange={() => {
										setAttributes({
											gestureHandling:
												gestureHandling === 'greedy'
													? 'cooperative'
													: 'greedy',
										});
									}}
									__nextHasNoMarginBottom
								/>
							) : null}
						</PanelBody>
					</>
				) : null}
				<PanelBody
					title={__('API Key', 'ghostkit')}
					initialOpen={!apiKey}
				>
					<TextControl
						placeholder={__('Enter API Key', 'ghostkit')}
						value={apiKey}
						onChange={(value) => {
							setApiKey(value);
							onChangeAPIKey(value);
							saveAPIKey(value);
						}}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<p>
						<em>
							{__(
								'A valid API key is required to use Google Maps. How to get API key',
								'ghostkit'
							)}{' '}
							<ExternalLink href="https://developers.google.com/maps/documentation/javascript/get-api-key">
								{__('read here', 'ghostkit')}
							</ExternalLink>
							.
						</em>
					</p>
					<p>
						<em>
							{__(
								'This key will be used in all Google Maps blocks on your site.',
								'ghostkit'
							)}
						</em>
					</p>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{apiKey ? (
					<>
						{fullHeight ? (
							getMapPreview()
						) : (
							<ResizableBox
								className={classnames({
									'is-selected': isSelected,
								})}
								size={{
									width: '100%',
									height,
								}}
								style={{ minHeight: height }}
								minHeight="100"
								enable={{ bottom: true }}
								onResizeStart={() => {
									toggleSelection(false);
								}}
								onResizeStop={(
									event,
									direction,
									elt,
									delta
								) => {
									setAttributes({
										height: parseInt(
											height + delta.height,
											10
										),
									});
									toggleSelection(true);
								}}
							>
								{getMapPreview()}
							</ResizableBox>
						)}
						{isSelected ? (
							<div className="ghostkit-google-maps-search">
								<SearchBox
									googleMapURL={`${mapsUrl}&key=${maybeEncode(
										apiKey
									)}`}
									label={__('Center Map', 'ghostkit')}
									placeholder={__(
										'Enter search query',
										'ghostkit'
									)}
									onChange={(value) => {
										if (value && value[0]) {
											setAttributes({
												lat: value[0].geometry.location.lat(),
												lng: value[0].geometry.location.lng(),
											});
										}
									}}
									className="ghostkit-google-maps-search-box"
								/>
								<div className="ghostkit-google-maps-search-note">
									<p>
										<small>
											{__(
												'You can also drag the map to change the center coordinates.',
												'ghostkit'
											)}
										</small>
									</p>
								</div>
							</div>
						) : null}
					</>
				) : (
					<div
						className="ghostkit-google-maps-placeholder"
						style={{ minHeight: height }}
					>
						<IconMarker />
						<div className="ghostkit-google-maps-placeholder-key">
							<div>
								<strong>
									{__(
										'Google Maps API Key Required',
										'ghostkit'
									)}
								</strong>
							</div>
							<div>
								<small>
									{__(
										'Add an API key in block settings.',
										'ghostkit'
									)}
								</small>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
