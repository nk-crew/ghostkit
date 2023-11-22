/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name } = metadata;
export { metadata, name };

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const settings = {
  icon: getIcon('block-video', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/video/',
    customStylesCallback(attributes) {
      const { videoBackgroundColor, videoBackgroundGradient } = attributes;

      const styles = {
        video: {
          'background-color': videoBackgroundColor || undefined,
          'background-image': videoBackgroundGradient || undefined,
        },
      };

      return styles;
    },
  },
  example: {
    attributes: {
      poster: 1,
      posterUrl: 'https://s.w.org/images/core/5.3/Glacial_lakes,_Bhutan.jpg',
    },
  },
  styles: [
    {
      name: 'default',
      label: __('Plain', '@@text_domain'),
      isDefault: true,
    },
    {
      name: 'icon-only',
      label: __('Icon Only', '@@text_domain'),
    },
  ],
  edit,
  save,
  transforms,
};
