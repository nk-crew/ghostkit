"use strict";
globalThis["webpackHotUpdateghostkit"]("gutenberg/index",{

/***/ "./gutenberg/blocks/google-maps/edit.js":
/*!**********************************************!*\
  !*** ./gutenberg/blocks/google-maps/edit.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlockEdit)
/* harmony export */ });
/* harmony import */ var classnames_dedupe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames/dedupe */ "./node_modules/classnames/dedupe.js");
/* harmony import */ var classnames_dedupe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames_dedupe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var throttle_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! throttle-debounce */ "./node_modules/throttle-debounce/esm/index.js");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_dropdown_picker__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../components/dropdown-picker */ "./gutenberg/components/dropdown-picker/index.js");
/* harmony import */ var _components_image_picker__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../components/image-picker */ "./gutenberg/components/image-picker/index.js");
/* harmony import */ var _components_range_control__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../components/range-control */ "./gutenberg/components/range-control/index.js");
/* harmony import */ var _utils_encode_decode__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/encode-decode */ "./gutenberg/utils/encode-decode/index.js");
/* harmony import */ var _utils_get_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../utils/get-icon */ "./gutenberg/utils/get-icon/index.js");
/* harmony import */ var _icons_marker_svg__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./icons/marker.svg */ "./gutenberg/blocks/google-maps/icons/marker.svg");
/* harmony import */ var _map_block__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./map-block */ "./gutenberg/blocks/google-maps/map-block.js");
/* harmony import */ var _map_styles__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./map-styles */ "./gutenberg/blocks/google-maps/map-styles/index.js");
/* harmony import */ var _search_box__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./search-box */ "./gutenberg/blocks/google-maps/search-box.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/* eslint-disable react/jsx-one-expression-per-line */


















var _window = window,
  GHOSTKIT = _window.GHOSTKIT;
var mapsUrl = "".concat(GHOSTKIT.googleMapsAPIUrl, "&libraries=geometry,drawing,places");
var geocoder = false;
var MIN_MARKER_WIDTH = 10;
var MAX_MARKER_WIDTH = 100;
function getStyles(string) {
  var result = [];
  try {
    result = JSON.parse((0,_utils_encode_decode__WEBPACK_IMPORTED_MODULE_11__.maybeDecode)(string));
  } catch (e) {
    return [];
  }
  return result;
}
function MarkerSettings(props) {
  var googleMapURL = props.googleMapURL,
    title = props.title,
    address = props.address,
    addresses = props.addresses,
    lat = props.lat,
    lng = props.lng,
    iconImageURL = props.iconImageURL,
    iconImageCustomWidth = props.iconImageCustomWidth,
    infoWindowText = props.infoWindowText,
    _onChange = props.onChange;
  var previewIcon = iconImageURL ? wp.element.createElement("img", {
    src: iconImageURL,
    width: iconImageCustomWidth,
    alt: ""
  }) : wp.element.createElement("img", {
    src: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi3_hdpi.png",
    width: "27",
    alt: ""
  });
  return wp.element.createElement(React.Fragment, null, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Title', 'ghostkit'),
    value: title,
    onChange: function onChange(value) {
      _onChange({
        title: value
      });
    }
  }), wp.element.createElement(_search_box__WEBPACK_IMPORTED_MODULE_16__["default"], {
    googleMapURL: googleMapURL,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Address', 'ghostkit'),
    value: address || addresses[lat + lng] || '',
    onChange: function onChange(value) {
      if (value && value[0]) {
        _onChange({
          address: value[0].formatted_address,
          lat: value[0].geometry.location.lat(),
          lng: value[0].geometry.location.lng()
        });
      }
    },
    className: "ghostkit-google-maps-search-box"
  }), wp.element.createElement("div", {
    className: "ghostkit-google-maps-marker-options-content-icon"
  }, previewIcon, wp.element.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaUpload, {
    onSelect: function onSelect(media) {
      if (!media || !media.url) {
        return;
      }
      _onChange({
        iconImageID: media.id,
        iconImageURL: media.url,
        iconImageCustomWidth: Math.min(MAX_MARKER_WIDTH, media.width),
        iconImageWidth: media.width,
        iconImageHeight: media.height
      });
    },
    allowedTypes: ['image'],
    value: iconImageURL || false,
    render: function render(_ref) {
      var open = _ref.open;
      return wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
        variant: "secondary",
        onClick: open
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Change Icon', 'ghostkit'));
    }
  })), iconImageCustomWidth ? wp.element.createElement("div", null, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    className: "ghostkit-google-maps-icon-reset",
    isSmall: true,
    onClick: function onClick() {
      _onChange({
        iconImageID: '',
        iconImageURL: '',
        iconImageCustomWidth: '',
        iconImageWidth: '',
        iconImageHeight: ''
      });
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Reset Icon to Default', 'ghostkit'))) : null, iconImageCustomWidth ? wp.element.createElement("div", null, wp.element.createElement(_components_range_control__WEBPACK_IMPORTED_MODULE_10__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Marker Width', 'ghostkit'),
    value: iconImageCustomWidth,
    onChange: function onChange(val) {
      return _onChange({
        iconImageCustomWidth: val
      });
    },
    min: MIN_MARKER_WIDTH,
    max: MAX_MARKER_WIDTH
  })) : null, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.BaseControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Info Window Text', 'ghostkit'),
    className: "ghostkit-google-maps-marker-options-content-info-window-text",
    id: "ghostkit-google-maps-marker-content-info-window-text"
  }, wp.element.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText, {
    value: infoWindowText,
    multiline: true,
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Write text…', 'ghostkit'),
    onChange: function onChange(val) {
      _onChange({
        infoWindowText: val
      });
    },
    onRemove: function onRemove() {
      _onChange({
        infoWindowText: ''
      });
    },
    keepPlaceholderOnFocus: true
  })));
}

/**
 * Block Edit Class.
 *
 * @param props
 */
function BlockEdit(props) {
  var attributes = props.attributes,
    setAttributes = props.setAttributes,
    isSelected = props.isSelected,
    toggleSelection = props.toggleSelection;
  var _props$className = props.className,
    className = _props$className === void 0 ? '' : _props$className;
  var height = attributes.height,
    zoom = attributes.zoom,
    lat = attributes.lat,
    lng = attributes.lng,
    showZoomButtons = attributes.showZoomButtons,
    showMapTypeButtons = attributes.showMapTypeButtons,
    showStreetViewButton = attributes.showStreetViewButton,
    showFullscreenButton = attributes.showFullscreenButton,
    optionScrollWheel = attributes.optionScrollWheel,
    optionDraggable = attributes.optionDraggable,
    gestureHandling = attributes.gestureHandling,
    markers = attributes.markers,
    fullHeight = attributes.fullHeight,
    style = attributes.style,
    styleCustom = attributes.styleCustom;
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(attributes.apiKey),
    _useState2 = _slicedToArray(_useState, 2),
    mapID = _useState2[0],
    setMapID = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(GHOSTKIT.googleMapsAPIKey),
    _useState4 = _slicedToArray(_useState3, 2),
    apiKey = _useState4[0],
    setApiKey = _useState4[1];
  var _useState5 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)({}),
    _useState6 = _slicedToArray(_useState5, 2),
    addresses = _useState6[0],
    setAddresses = _useState6[1];
  function updateMarkerAddress(latLng, address) {
    if (markers && markers.length > 0) {
      markers.forEach(function (marker, index) {
        if (!marker.address && latLng.lat === marker.lat && latLng.lng === marker.lng) {
          markers[index].address = address;
          addresses[latLng.lat + latLng.lng] = address;
        }
      });
      setAddresses(addresses);
    }
  }

  // Updated.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(function () {
    // find Address by lat and lng.
    if (geocoder || window.google && window.google.maps && window.google.maps.Geocoder) {
      geocoder = new window.google.maps.Geocoder();
    }
    if (geocoder) {
      if (markers && markers.length > 0) {
        markers.forEach(function (marker) {
          if (!marker.address) {
            if (addresses[marker.lat + marker.lng]) {
              updateMarkerAddress({
                lat: marker.lat,
                lng: marker.lng
              }, addresses[marker.lat + marker.lng]);
            } else {
              geocoder.geocode({
                location: {
                  lat: marker.lat,
                  lng: marker.lng
                }
              }, function (results, status) {
                if (status === 'OK' && results.length) {
                  updateMarkerAddress({
                    lat: marker.lat,
                    lng: marker.lng
                  }, results[0].formatted_address);
                }
              });
            }
          }
        });
      }
    }
  });
  var onChangeAPIKey = (0,throttle_debounce__WEBPACK_IMPORTED_MODULE_1__.debounce)(600, function (newKey) {
    GHOSTKIT.googleMapsAPIKey = newKey;
    setMapID(newKey);
  });
  var saveAPIKey = (0,throttle_debounce__WEBPACK_IMPORTED_MODULE_1__.debounce)(3000, function (newKey) {
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
      path: '/ghostkit/v1/update_google_maps_api_key',
      method: 'POST',
      data: {
        key: newKey
      }
    });
  });
  function getStylesPicker() {
    return wp.element.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, wp.element.createElement(_components_image_picker__WEBPACK_IMPORTED_MODULE_9__["default"], {
      value: (0,_utils_encode_decode__WEBPACK_IMPORTED_MODULE_11__.maybeDecode)(style),
      options: _map_styles__WEBPACK_IMPORTED_MODULE_15__["default"],
      onChange: function onChange(value) {
        var customString = styleCustom;
        if (value === 'default') {
          customString = '';
        } else if (value !== 'custom') {
          _map_styles__WEBPACK_IMPORTED_MODULE_15__["default"].forEach(function (styleData) {
            if (value === styleData.value) {
              customString = JSON.stringify(styleData.json);
            }
          });
        }
        setAttributes({
          style: value,
          styleCustom: (0,_utils_encode_decode__WEBPACK_IMPORTED_MODULE_11__.maybeEncode)(customString)
        });
      }
    }), style === 'custom' ? wp.element.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextareaControl, {
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Enter Style JSON', 'ghostkit'),
      value: (0,_utils_encode_decode__WEBPACK_IMPORTED_MODULE_11__.maybeDecode)(styleCustom),
      onChange: function onChange(value) {
        return setAttributes({
          styleCustom: (0,_utils_encode_decode__WEBPACK_IMPORTED_MODULE_11__.maybeEncode)(value)
        });
      }
    }), wp.element.createElement("p", null, wp.element.createElement("em", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('You can use custom styles presets from the', 'ghostkit'), ' ', wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ExternalLink, {
      href: "https://snazzymaps.com/"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Snazzy Maps', 'ghostkit')), "."))) : null);
  }
  function getMapPreview() {
    return wp.element.createElement(_map_block__WEBPACK_IMPORTED_MODULE_14__["default"], {
      key: mapID + markers.length,
      apiUrl: "".concat(mapsUrl, "&key=").concat((0,_utils_encode_decode__WEBPACK_IMPORTED_MODULE_11__.maybeEncode)(apiKey)),
      markers: markers,
      onChangeMarkers: function onChangeMarkers(newMarkers) {
        setAttributes({
          markers: newMarkers
        });
      },
      options: {
        styles: styleCustom ? getStyles(styleCustom) : [],
        zoom: zoom,
        center: {
          lat: lat,
          lng: lng
        },
        zoomControl: showZoomButtons,
        zoomControlOpt: {
          style: 'DEFAULT',
          position: 'RIGHT_BOTTOM'
        },
        mapTypeControl: showMapTypeButtons,
        streetViewControl: showStreetViewButton,
        fullscreenControl: showFullscreenButton,
        gestureHandling: 'cooperative',
        scrollwheel: false,
        draggable: optionDraggable,
        onZoomChange: (0,throttle_debounce__WEBPACK_IMPORTED_MODULE_1__.debounce)(500, function (val) {
          return setAttributes({
            zoom: val
          });
        }),
        onCenterChange: (0,throttle_debounce__WEBPACK_IMPORTED_MODULE_1__.debounce)(500, function (val) {
          return setAttributes({
            lat: val.lat(),
            lng: val.lng()
          });
        })
      }
    });
  }
  className = classnames_dedupe__WEBPACK_IMPORTED_MODULE_0___default()('ghostkit-google-maps', className);

  // add full height classname.
  if (fullHeight) {
    className = classnames_dedupe__WEBPACK_IMPORTED_MODULE_0___default()(className, 'ghostkit-google-maps-fullheight');
  }
  className = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_6__.applyFilters)('ghostkit.editor.className', className, props);
  var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)({
    className: className
  });
  return wp.element.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, apiKey ? wp.element.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, null, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarGroup, null, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarButton, {
    icon: (0,_utils_get_icon__WEBPACK_IMPORTED_MODULE_12__["default"])('icon-fullheight'),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Full Height', 'ghostkit'),
    onClick: function onClick() {
      return setAttributes({
        fullHeight: !fullHeight
      });
    },
    isActive: fullHeight
  })), wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarGroup, null, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarButton, {
    icon: (0,_utils_get_icon__WEBPACK_IMPORTED_MODULE_12__["default"])('icon-marker'),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Add Marker', 'ghostkit'),
    onClick: function onClick() {
      setAttributes({
        markers: [].concat(_toConsumableArray(markers), [{
          lat: lat,
          lng: lng
        }])
      });
    }
  }), wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Dropdown, {
    renderToggle: function renderToggle(_ref2) {
      var onToggle = _ref2.onToggle;
      return wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Style', 'ghostkit'),
        icon: (0,_utils_get_icon__WEBPACK_IMPORTED_MODULE_12__["default"])('icon-map'),
        className: "components-toolbar__control",
        onClick: onToggle
      });
    },
    renderContent: function renderContent() {
      return wp.element.createElement("div", {
        style: {
          minWidth: 260
        }
      }, getStylesPicker());
    }
  }))) : null, wp.element.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, {
    group: "styles"
  }, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Styles', 'ghostkit')
  }, getStylesPicker())), wp.element.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, null, apiKey ? wp.element.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, null, wp.element.createElement(_components_range_control__WEBPACK_IMPORTED_MODULE_10__["default"], {
    label: fullHeight ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Minimal Height', 'ghostkit') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Height', 'ghostkit'),
    value: height,
    onChange: function onChange(value) {
      return setAttributes({
        height: value
      });
    },
    min: 100,
    max: 800,
    allowCustomMin: true,
    allowCustomMax: true
  }), wp.element.createElement(_components_range_control__WEBPACK_IMPORTED_MODULE_10__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Zoom', 'ghostkit'),
    value: zoom,
    onChange: function onChange(value) {
      return setAttributes({
        zoom: value
      });
    },
    min: 1,
    max: 18,
    allowCustomMax: true
  })), wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Markers', 'ghostkit')
  }, markers && markers.length > 0 ? wp.element.createElement("ul", {
    className: "ghostkit-google-maps-markers"
  }, markers.map(function (marker, index) {
    return wp.element.createElement(_components_dropdown_picker__WEBPACK_IMPORTED_MODULE_8__["default"], {
      key: index,
      label: marker.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Marker', 'ghostkit'),
      contentClassName: "ghostkit-component-google-maps-markers"
    }, wp.element.createElement(MarkerSettings, {
      index: index,
      googleMapURL: "".concat(mapsUrl, "&key=").concat((0,_utils_encode_decode__WEBPACK_IMPORTED_MODULE_11__.maybeEncode)(apiKey)),
      address: marker.address,
      addresses: addresses,
      lat: marker.lat,
      lng: marker.lng,
      title: marker.title,
      iconImageURL: marker.iconImageURL,
      iconImageCustomWidth: marker.iconImageCustomWidth,
      infoWindowText: marker.infoWindowText,
      onChange: function onChange(newAttrs) {
        var newMarkers = Object.assign([], markers);
        newMarkers[index] = _objectSpread(_objectSpread({}, newMarkers[index]), newAttrs);
        setAttributes({
          markers: newMarkers
        });
      }
    }), wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
      onClick: function onClick() {
        var newMarkers = Object.assign([], markers);
        newMarkers.splice(index, 1);
        setAttributes({
          markers: newMarkers
        });
      },
      className: "ghostkit-google-maps-marker-remove"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Remove Marker', 'ghostkit')));
  })) : null, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    isSecondary: true,
    onClick: function onClick() {
      setAttributes({
        markers: [].concat(_toConsumableArray(markers), [{
          lat: lat,
          lng: lng
        }])
      });
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('+ Add Marker', 'ghostkit'))), wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Options', 'ghostkit')
  }, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Zoom Buttons', 'ghostkit'),
    checked: !!showZoomButtons,
    onChange: function onChange(val) {
      return setAttributes({
        showZoomButtons: val
      });
    }
  }), wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Map Type Buttons', 'ghostkit'),
    checked: !!showMapTypeButtons,
    onChange: function onChange(val) {
      return setAttributes({
        showMapTypeButtons: val
      });
    }
  }), wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Street View Button', 'ghostkit'),
    checked: !!showStreetViewButton,
    onChange: function onChange(val) {
      return setAttributes({
        showStreetViewButton: val
      });
    }
  }), wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Fullscreen Button', 'ghostkit'),
    checked: !!showFullscreenButton,
    onChange: function onChange(val) {
      return setAttributes({
        showFullscreenButton: val
      });
    }
  }), wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Scroll Wheel', 'ghostkit'),
    checked: !!optionScrollWheel,
    onChange: function onChange(val) {
      return setAttributes({
        optionScrollWheel: val
      });
    }
  }), wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Draggable', 'ghostkit'),
    checked: !!optionDraggable,
    onChange: function onChange(val) {
      return setAttributes({
        optionDraggable: val
      });
    }
  }), optionScrollWheel || optionDraggable ? wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: function () {
      if (optionScrollWheel && optionDraggable) {
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Better Scroll & Draggable', 'ghostkit');
      }
      if (optionScrollWheel) {
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Better Scroll', 'ghostkit');
      }
      if (optionDraggable) {
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Better Draggable', 'ghostkit');
      }
      return '';
    }(),
    help: function () {
      if (optionScrollWheel && optionDraggable) {
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Scroll with pressed Ctrl or ⌘ key to zoom. Draggable with two fingers.', 'ghostkit');
      }
      if (optionScrollWheel) {
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Scroll with pressed Ctrl or ⌘ key to zoom.', 'ghostkit');
      }
      if (optionDraggable) {
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Draggable with two fingers.', 'ghostkit');
      }
      return '';
    }(),
    checked: gestureHandling === 'cooperative',
    onChange: function onChange() {
      setAttributes({
        gestureHandling: gestureHandling === 'greedy' ? 'cooperative' : 'greedy'
      });
    }
  }) : null)) : null, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('API Key', 'ghostkit'),
    initialOpen: !apiKey
  }, wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Enter API Key', 'ghostkit'),
    value: apiKey,
    onChange: function onChange(value) {
      setApiKey(value);
      onChangeAPIKey(value);
      saveAPIKey(value);
    }
  }), wp.element.createElement("p", null, wp.element.createElement("em", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('A valid API key is required to use Google Maps. How to get API key', 'ghostkit'), ' ', wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ExternalLink, {
    href: "https://developers.google.com/maps/documentation/javascript/get-api-key"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('read here', 'ghostkit')), ".")), wp.element.createElement("p", null, wp.element.createElement("em", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('This key will be used in all Google Maps blocks on your site.', 'ghostkit'))))), wp.element.createElement("div", blockProps, apiKey ? wp.element.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.Fragment, null, fullHeight ? getMapPreview() : wp.element.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ResizableBox, {
    className: classnames_dedupe__WEBPACK_IMPORTED_MODULE_0___default()({
      'is-selected': isSelected
    }),
    size: {
      width: '100%',
      height: height
    },
    style: {
      minHeight: height
    },
    minHeight: "100",
    enable: {
      bottom: true
    },
    onResizeStart: function onResizeStart() {
      toggleSelection(false);
    },
    onResizeStop: function onResizeStop(event, direction, elt, delta) {
      setAttributes({
        height: parseInt(height + delta.height, 10)
      });
      toggleSelection(true);
    }
  }, getMapPreview()), isSelected ? wp.element.createElement("div", {
    className: "ghostkit-google-maps-search"
  }, wp.element.createElement(_search_box__WEBPACK_IMPORTED_MODULE_16__["default"], {
    googleMapURL: "".concat(mapsUrl, "&key=").concat((0,_utils_encode_decode__WEBPACK_IMPORTED_MODULE_11__.maybeEncode)(apiKey)),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Center Map', 'ghostkit'),
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Enter search query', 'ghostkit'),
    onChange: function onChange(value) {
      if (value && value[0]) {
        setAttributes({
          lat: value[0].geometry.location.lat(),
          lng: value[0].geometry.location.lng()
        });
      }
    },
    className: "ghostkit-google-maps-search-box"
  }), wp.element.createElement("div", {
    className: "ghostkit-google-maps-search-note"
  }, wp.element.createElement("p", null, wp.element.createElement("small", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('You can also drag the map to change the center coordinates.', 'ghostkit'))))) : null) : wp.element.createElement("div", {
    className: "ghostkit-google-maps-placeholder",
    style: {
      minHeight: height
    }
  }, wp.element.createElement(_icons_marker_svg__WEBPACK_IMPORTED_MODULE_13__.ReactComponent, null), wp.element.createElement("div", {
    className: "ghostkit-google-maps-placeholder-key"
  }, wp.element.createElement("div", null, wp.element.createElement("strong", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Google Maps API Key Required', 'ghostkit'))), wp.element.createElement("div", null, wp.element.createElement("small", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Add an API key in block settings.', 'ghostkit')))))));
}

/***/ })

});
//# sourceMappingURL=index.17df6d96248c9b31eba0.hot-update.js.map