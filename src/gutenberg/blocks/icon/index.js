/**
 * Internal dependencies
 */
import setBorder from '../../utils/set-border';
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;
export { metadata, name };

/**
 * WordPress dependencies
 */
const {
  __experimentalGetBorderClassesAndStyles: getBorderClassesAndStyles,
  __experimentalGetColorClassesAndStyles: getColorClassesAndStyles,
  __experimentalGetSpacingClassesAndStyles: getSpacingClassesAndStyles,
} = wp.blockEditor;

export const settings = {
  icon: getIcon('block-icon', true),
  ghostkit: {
    previewUrl: 'https://ghostkit.io/blocks/circle-button/',
    customStylesCallback(attributes) {
      const { justify, width } = attributes;

      const styles = {
        'justify-content': justify || undefined,
        '> .ghostkit-icon-inner': {
          width: width || undefined,
          borderRadius: undefined,
          border: undefined,
          borderTop: undefined,
          borderRight: undefined,
          borderBottom: undefined,
          borderLeft: undefined,
          paddingTop: undefined,
          paddingRight: undefined,
          paddingBottom: undefined,
          paddingLeft: undefined,
          marginTop: undefined,
          marginRight: undefined,
          marginBottom: undefined,
          marginLeft: undefined,
        },
      };

      const borderStyle = getBorderClassesAndStyles(attributes)?.style;
      const colorStyle = getColorClassesAndStyles(attributes)?.style;
      const spacingStyle = getSpacingClassesAndStyles(attributes)?.style;

      // Border.
      if (Object.keys(borderStyle).length) {
        styles['> .ghostkit-icon-inner'] = {
          ...styles['> .ghostkit-icon-inner'],
          ...setBorder(borderStyle),
        };
      }

      // Color.
      if (Object.keys(colorStyle).length) {
        styles['> .ghostkit-icon-inner'] = {
          ...styles['> .ghostkit-icon-inner'],
          ...colorStyle,
        };
      }

      // Spacing.
      if (Object.keys(spacingStyle).length) {
        styles['> .ghostkit-icon-inner'] = {
          ...styles['> .ghostkit-icon-inner'],
          ...spacingStyle,
        };
      }

      return styles;
    },
  },
  edit,
  save,
};
