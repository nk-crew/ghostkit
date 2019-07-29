/**
 * Import CSS
 */
import './style.scss';
import './editor.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Icon Box' ),
    description: __( 'Icons are one of the best visual replacement for text descriptions.' ),
    icon: getIcon( 'block-icon-box', true ),
    keywords: [
        __( 'icon' ),
        __( 'icon-box' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/icon-box/',
        customStylesCallback( attributes ) {
            const styles = {
                '.ghostkit-icon-box-icon': {
                    fontSize: attributes.iconSize,
                    color: attributes.iconColor,
                },
            };

            if ( attributes.hoverIconColor ) {
                styles[ '&:hover .ghostkit-icon-box-icon' ] = {
                    color: attributes.hoverIconColor,
                };
            }

            return styles;
        },
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    edit,
    save,
    deprecated,
    transforms,
};
