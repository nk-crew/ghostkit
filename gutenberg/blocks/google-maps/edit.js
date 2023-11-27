/* eslint-disable react/jsx-one-expression-per-line */
/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import { debounce } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';
import ImagePicker from '../../components/image-picker';
import RangeControl from '../../components/range-control';
import { maybeEncode, maybeDecode } from '../../utils/encode-decode';

import IconMarker from './icons/marker.svg';
import styles from './map-styles';
import MapBlock from './map-block';
import SearchBox from './search-box';

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';

import { Fragment, useEffect, useState } from '@wordpress/element';

import {
  PanelBody,
  TextControl,
  TextareaControl,
  ToggleControl,
  Button,
  ToolbarGroup,
  ToolbarButton,
  Dropdown,
  ResizableBox,
  ExternalLink,
} from '@wordpress/components';

import { InspectorControls, BlockControls, useBlockProps } from '@wordpress/block-editor';

import apiFetch from '@wordpress/api-fetch';

const { GHOSTKIT } = window;

const mapsUrl = `${GHOSTKIT.googleMapsAPIUrl}&libraries=geometry,drawing,places`;
let geocoder = false;

function getStyles(string) {
  let result = [];

  try {
    result = JSON.parse(maybeDecode(string));
  } catch (e) {
    return [];
  }

  return result;
}

/**
 * Block Edit Class.
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
        if (!marker.address && latLng.lat === marker.lat && latLng.lng === marker.lng) {
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
    if (geocoder || (window.google && window.google.maps && window.google.maps.Geocoder)) {
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
      <Fragment>
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
                  customString = JSON.stringify(styleData.json);
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
          <Fragment>
            <TextareaControl
              placeholder={__('Enter Style JSON', 'ghostkit')}
              value={maybeDecode(styleCustom)}
              onChange={(value) => setAttributes({ styleCustom: maybeEncode(value) })}
            />
            <p>
              <em>
                {__('You can use custom styles presets from the', 'ghostkit')}{' '}
                <ExternalLink href="https://snazzymaps.com/">
                  {__('Snazzy Maps', 'ghostkit')}
                </ExternalLink>
                .
              </em>
            </p>
          </Fragment>
        ) : null}
      </Fragment>
    );
  }

  function getMapPreview() {
    return (
      <MapBlock
        key={mapID + markers.length}
        googleMapURL={`${mapsUrl}&key=${maybeEncode(apiKey)}`}
        loadingElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
        containerElement={
          <div className="ghostkit-google-maps-wrap" style={{ minHeight: '100%' }} />
        }
        markers={markers}
        zoom={zoom}
        center={{ lat, lng }}
        options={{
          styles: styleCustom ? getStyles(styleCustom) : [],
          zoomControl: showZoomButtons,
          mapTypeControl: showMapTypeButtons,
          streetViewControl: showStreetViewButton,
          fullscreenControl: showFullscreenButton,
          gestureHandling: 'cooperative',
          draggable: optionDraggable,
        }}
        defaultZoom={zoom}
        defaultCenter={{ lat, lng }}
        defaultOptions={{
          styles: styleCustom ? getStyles(styleCustom) : [],
          zoomControl: showZoomButtons,
          mapTypeControl: showMapTypeButtons,
          streetViewControl: showStreetViewButton,
          fullscreenControl: showFullscreenButton,
          gestureHandling: 'cooperative',
          draggable: optionDraggable,
        }}
        onZoomChanged={debounce(500, (val) => setAttributes({ zoom: val }))}
        onCenterChanged={debounce(500, (val) => setAttributes({ lat: val.lat(), lng: val.lng() }))}
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
    <Fragment>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon={getIcon('icon-fullheight')}
            title={__('Full Height', 'ghostkit')}
            onClick={() => setAttributes({ fullHeight: !fullHeight })}
            isActive={fullHeight}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton
            icon={getIcon('icon-marker')}
            title={__('Add Marker', 'ghostkit')}
            onClick={() => () => {
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
      <InspectorControls>
        {apiKey ? (
          <Fragment>
            <PanelBody>
              <ToggleControl
                label={__('Full Height', 'ghostkit')}
                checked={!!fullHeight}
                onChange={(val) => setAttributes({ fullHeight: val })}
              />
              <RangeControl
                label={
                  fullHeight ? __('Minimal Height', 'ghostkit') : __('Height', 'ghostkit')
                }
                value={height}
                onChange={(value) => setAttributes({ height: value })}
                min={100}
                max={800}
                allowCustomMin
                allowCustomMax
              />
              <RangeControl
                label={__('Zoom', 'ghostkit')}
                value={zoom}
                onChange={(value) => setAttributes({ zoom: value })}
                min={1}
                max={18}
                allowCustomMax
              />
            </PanelBody>
            <PanelBody title={__('Markers', 'ghostkit')}>
              {markers && markers.length > 0 ? (
                <ul className="ghostkit-google-maps-markers">
                  {markers.map((marker, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={index}>
                      <SearchBox
                        googleMapURL={`${mapsUrl}&key=${maybeEncode(apiKey)}`}
                        placeholder={__('Enter address', 'ghostkit')}
                        value={marker.address || addresses[marker.lat + marker.lng] || ''}
                        onChange={(value) => {
                          if (value && value[0]) {
                            markers[index].address = value[0].formatted_address;
                            markers[index].lat = value[0].geometry.location.lat();
                            markers[index].lng = value[0].geometry.location.lng();

                            setAttributes({
                              markers: Object.assign([], markers),
                            });
                          }
                        }}
                        className="ghostkit-google-maps-search-box"
                      />
                      <ApplyFilters
                        name="ghostkit.editor.controls"
                        attribute="additionalMarkerOptions"
                        marker={marker}
                        props={props}
                        setMarkerOptions={(newMarkerOptions) => {
                          markers[index] = {
                            ...markers[index],
                            ...newMarkerOptions,
                          };

                          setAttributes({
                            markers: Object.assign([], markers),
                          });
                        }}
                      />
                      <Button
                        onClick={() => {
                          markers.splice(index, 1);

                          setAttributes({
                            markers: Object.assign([], markers),
                          });
                        }}
                        className="ghostkit-google-maps-marker-remove"
                      >
                        {__('Remove Marker', 'ghostkit')}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <Button
                isSecondary
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
            <PanelBody title={__('Style', 'ghostkit')}>{getStylesPicker()}</PanelBody>
            <PanelBody title={__('Options', 'ghostkit')}>
              <ToggleControl
                label={__('Zoom Buttons', 'ghostkit')}
                checked={!!showZoomButtons}
                onChange={(val) => setAttributes({ showZoomButtons: val })}
              />
              <ToggleControl
                label={__('Map Type Buttons', 'ghostkit')}
                checked={!!showMapTypeButtons}
                onChange={(val) => setAttributes({ showMapTypeButtons: val })}
              />
              <ToggleControl
                label={__('Street View Button', 'ghostkit')}
                checked={!!showStreetViewButton}
                onChange={(val) => setAttributes({ showStreetViewButton: val })}
              />
              <ToggleControl
                label={__('Fullscreen Button', 'ghostkit')}
                checked={!!showFullscreenButton}
                onChange={(val) => setAttributes({ showFullscreenButton: val })}
              />
              <ToggleControl
                label={__('Scroll Wheel', 'ghostkit')}
                checked={!!optionScrollWheel}
                onChange={(val) => setAttributes({ optionScrollWheel: val })}
              />
              <ToggleControl
                label={__('Draggable', 'ghostkit')}
                checked={!!optionDraggable}
                onChange={(val) => setAttributes({ optionDraggable: val })}
              />
              {optionScrollWheel || optionDraggable ? (
                <ToggleControl
                  label={(() => {
                    if (optionScrollWheel && optionDraggable) {
                      return __('Better Scroll & Draggable', 'ghostkit');
                    }
                    if (optionScrollWheel) {
                      return __('Better Scroll', 'ghostkit');
                    }
                    if (optionDraggable) {
                      return __('Better Draggable', 'ghostkit');
                    }
                    return '';
                  })()}
                  help={(() => {
                    if (optionScrollWheel && optionDraggable) {
                      return __(
                        'Scroll with pressed Ctrl or ⌘ key to zoom. Draggable with two fingers.',
                        'ghostkit'
                      );
                    }
                    if (optionScrollWheel) {
                      return __('Scroll with pressed Ctrl or ⌘ key to zoom.', 'ghostkit');
                    }
                    if (optionDraggable) {
                      return __('Draggable with two fingers.', 'ghostkit');
                    }
                    return '';
                  })()}
                  checked={gestureHandling === 'cooperative'}
                  onChange={() => {
                    setAttributes({
                      gestureHandling: gestureHandling === 'greedy' ? 'cooperative' : 'greedy',
                    });
                  }}
                />
              ) : null}
            </PanelBody>
          </Fragment>
        ) : null}
        <PanelBody title={__('API Key', 'ghostkit')} initialOpen={!apiKey}>
          <TextControl
            placeholder={__('Enter API Key', 'ghostkit')}
            value={apiKey}
            onChange={(value) => {
              setApiKey(value);
              onChangeAPIKey(value);
              saveAPIKey(value);
            }}
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
              {__('This key will be used in all Google Maps blocks on your site.', 'ghostkit')}
            </em>
          </p>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        {apiKey ? (
          <Fragment>
            {fullHeight ? (
              getMapPreview()
            ) : (
              <ResizableBox
                className={classnames({ 'is-selected': isSelected })}
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
                onResizeStop={(event, direction, elt, delta) => {
                  setAttributes({
                    height: parseInt(height + delta.height, 10),
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
                  googleMapURL={`${mapsUrl}&key=${maybeEncode(apiKey)}`}
                  label={__('Center Map', 'ghostkit')}
                  placeholder={__('Enter search query', 'ghostkit')}
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
          </Fragment>
        ) : (
          <div className="ghostkit-google-maps-placeholder" style={{ minHeight: height }}>
            <IconMarker />
            <div className="ghostkit-google-maps-placeholder-key">
              <div>
                <strong>{__('Google Maps API Key Required', 'ghostkit')}</strong>
              </div>
              <div>
                <small>{__('Add an API key in block settings.', 'ghostkit')}</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
