import { __ } from '@wordpress/i18n';

import ImgStyleBright from './style-bright.png';
import ImgStyleCustom from './style-custom.png';
import ImgStyleDark from './style-dark.png';
import ImgStyleDefault from './style-default.png';
import ImgStyleLight from './style-light.png';
import ImgStylePaleDawn from './style-pale-dawn.png';

export default [
	{
		value: 'default',
		label: __('Default', 'ghostkit'),
		image: ImgStyleDefault,
		json: [],
	},
	{
		// https://snazzymaps.com/style/127403/no-label-bright-colors
		value: 'bright',
		label: __('Bright', 'ghostkit'),
		image: ImgStyleBright,
		json: [
			{
				featureType: 'all',
				elementType: 'all',
				stylers: [
					{
						saturation: '32',
					},
					{
						lightness: '-3',
					},
					{
						visibility: 'on',
					},
					{
						weight: '1.18',
					},
				],
			},
			{
				featureType: 'administrative',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'landscape',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'landscape.man_made',
				elementType: 'all',
				stylers: [
					{
						saturation: '-70',
					},
					{
						lightness: '14',
					},
				],
			},
			{
				featureType: 'poi',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'road',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'transit',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'all',
				stylers: [
					{
						saturation: '100',
					},
					{
						lightness: '-14',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
					{
						lightness: '12',
					},
				],
			},
		],
	},
	{
		// https://snazzymaps.com/style/102/clean-grey
		value: 'light',
		label: __('Light', 'ghostkit'),
		image: ImgStyleLight,
		json: [
			{
				featureType: 'administrative',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'administrative.country',
				elementType: 'geometry.stroke',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'administrative.province',
				elementType: 'geometry.stroke',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'landscape',
				elementType: 'geometry',
				stylers: [
					{
						visibility: 'on',
					},
					{
						color: '#e3e3e3',
					},
				],
			},
			{
				featureType: 'landscape.natural',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'poi',
				elementType: 'all',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'road',
				elementType: 'all',
				stylers: [
					{
						color: '#cccccc',
					},
				],
			},
			{
				featureType: 'road',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'transit',
				elementType: 'labels.icon',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'transit.line',
				elementType: 'geometry',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'transit.line',
				elementType: 'labels.text',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'transit.station.airport',
				elementType: 'geometry',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'transit.station.airport',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [
					{
						color: '#FFFFFF',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
		],
	},
	{
		// https://snazzymaps.com/style/35661/dark-with-better-contrast
		value: 'dark',
		label: __('Dark', 'ghostkit'),
		image: ImgStyleDark,
		json: [
			{
				featureType: 'all',
				elementType: 'labels.text.fill',
				stylers: [
					{
						saturation: 36,
					},
					{
						color: '#707070',
					},
					{
						lightness: 40,
					},
				],
			},
			{
				featureType: 'all',
				elementType: 'labels.text.stroke',
				stylers: [
					{
						visibility: 'on',
					},
					{
						color: '#000000',
					},
					{
						lightness: 16,
					},
				],
			},
			{
				featureType: 'all',
				elementType: 'labels.icon',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'administrative',
				elementType: 'geometry.fill',
				stylers: [
					{
						color: '#000000',
					},
					{
						lightness: 20,
					},
				],
			},
			{
				featureType: 'administrative',
				elementType: 'geometry.stroke',
				stylers: [
					{
						color: '#000000',
					},
					{
						lightness: 17,
					},
					{
						weight: 1.2,
					},
				],
			},
			{
				featureType: 'landscape',
				elementType: 'geometry',
				stylers: [
					{
						color: '#424242',
					},
				],
			},
			{
				featureType: 'poi',
				elementType: 'geometry',
				stylers: [
					{
						color: '#000000',
					},
					{
						lightness: 21,
					},
				],
			},
			{
				featureType: 'poi',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'poi',
				elementType: 'labels.icon',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry.fill',
				stylers: [
					{
						lightness: 17,
					},
					{
						color: '#484848',
					},
				],
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [
					{
						lightness: 29,
					},
					{
						weight: 0.2,
					},
					{
						color: '#ff0000',
					},
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'road.arterial',
				elementType: 'geometry',
				stylers: [
					{
						color: '#000000',
					},
					{
						lightness: 18,
					},
				],
			},
			{
				featureType: 'road.local',
				elementType: 'geometry',
				stylers: [
					{
						color: '#000000',
					},
					{
						lightness: 16,
					},
				],
			},
			{
				featureType: 'transit',
				elementType: 'geometry',
				stylers: [
					{
						color: '#000000',
					},
					{
						lightness: 19,
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [
					{
						color: '#000000',
					},
					{
						lightness: 17,
					},
				],
			},
		],
	},
	{
		// https://snazzymaps.com/style/1/pale-dawn
		value: 'pale_dawn',
		label: __('Pale Dawn', 'ghostkit'),
		image: ImgStylePaleDawn,
		json: [
			{
				featureType: 'administrative',
				elementType: 'all',
				stylers: [
					{
						visibility: 'on',
					},
					{
						lightness: 33,
					},
				],
			},
			{
				featureType: 'landscape',
				elementType: 'all',
				stylers: [
					{
						color: '#f2e5d4',
					},
				],
			},
			{
				featureType: 'poi.park',
				elementType: 'geometry',
				stylers: [
					{
						color: '#c5dac6',
					},
				],
			},
			{
				featureType: 'poi.park',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'on',
					},
					{
						lightness: 20,
					},
				],
			},
			{
				featureType: 'road',
				elementType: 'all',
				stylers: [
					{
						lightness: 20,
					},
				],
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [
					{
						color: '#c5c6c6',
					},
				],
			},
			{
				featureType: 'road.arterial',
				elementType: 'geometry',
				stylers: [
					{
						color: '#e4d7c6',
					},
				],
			},
			{
				featureType: 'road.local',
				elementType: 'geometry',
				stylers: [
					{
						color: '#fbfaf7',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'all',
				stylers: [
					{
						visibility: 'on',
					},
					{
						color: '#acbcc9',
					},
				],
			},
		],
	},
	{
		value: 'custom',
		label: __('Custom', 'ghostkit'),
		image: ImgStyleCustom,
	},
];
