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
    title: __( 'Icon Box', '@@text_domain' ),
    description: __( 'Icons are one of the best visual replacement for text descriptions.', '@@text_domain' ),
    icon: getIcon( 'block-icon-box', true ),
    keywords: [
        __( 'icon', '@@text_domain' ),
        __( 'icon-box', '@@text_domain' ),
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
            frame: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },
    example: {
        attributes: {
            icon: 'fab fa-twitter',
            iconColor: '#0366d6',
            ghostkitId: 'example-icon-box',
            ghostkitClassname: 'ghostkit-custom-example-icon-box',
            className: 'ghostkit-custom-example-icon-box',
        },
        innerBlocks: [
            {
                name: 'core/paragraph',
                attributes: {
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis.',
                },
            },
        ],
    },
    edit,
    save,
    deprecated,
    transforms,
};
