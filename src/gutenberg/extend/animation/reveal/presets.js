/**
 * Internal dependencies
 */
import getIcon from '../../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

export default {
  fade: {
    label: __('Fade In', '@@text_domain'),
    icon: getIcon('sr-fade'),
    data: {
      opacity: 0.15,
    },
  },
  zoom: {
    label: __('Zoom In', '@@text_domain'),
    icon: getIcon('sr-zoom'),
    data: {
      scale: 0.9,
    },
  },
  'zoom-up': {
    label: __('Zoom In From Bottom', '@@text_domain'),
    icon: getIcon('sr-zoom-from-bottom'),
    data: {
      y: '50px',
      scale: 0.9,
    },
  },
  'zoom-left': {
    label: __('Zoom In From Left', '@@text_domain'),
    icon: getIcon('sr-zoom-from-left'),
    data: {
      x: '-50px',
      scale: 0.9,
    },
  },
  'zoom-right': {
    label: __('Zoom In From Right', '@@text_domain'),
    icon: getIcon('sr-zoom-from-right'),
    data: {
      x: '50px',
      scale: 0.9,
    },
  },
};
