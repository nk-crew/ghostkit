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
    title: __( 'Alert' ),
    description: __( 'Provide contextual feedback messages for user actions.' ),
    icon: getIcon( 'block-alert', true ),
    keywords: [
        __( 'alert' ),
        __( 'notification' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/alert/',
        customStylesCallback( attributes ) {
            const styles = {
                borderLeftColor: attributes.color,
                '.ghostkit-alert-icon': {
                    fontSize: attributes.iconSize,
                    color: attributes.color,
                },
            };

            if ( attributes.hoverColor ) {
                styles[ '&:hover' ] = {
                    borderLeftColor: attributes.hoverColor,
                    '.ghostkit-alert-icon': {
                        color: attributes.hoverColor,
                    },
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
