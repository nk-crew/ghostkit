/**
 * Import CSS
 */
import './styles/style.scss';
import './styles/editor.scss';

/**
 * WordPress dependencies
 */
const { merge } = window.lodash;

const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import transforms from './transforms';
import deprecated from './deprecated';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Divider', '@@text_domain' ),
    description: __( 'Divide your long texts and blocks.', '@@text_domain' ),
    icon: getIcon( 'block-divider', true ),
    keywords: [
        __( 'divider', '@@text_domain' ),
        __( 'spacer', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/divider/',
        customStylesCallback( attributes ) {
            const styles = {
                '&::before, &::after': {
                    borderColor: attributes.color,
                    borderWidth: attributes.size,
                },
                '.ghostkit-divider-icon': {
                    fontSize: attributes.iconSize,
                    color: attributes.iconColor,
                },
            };

            if ( attributes.hoverColor ) {
                styles[ '&:hover' ] = {
                    '&::before, &::after': {
                        borderColor: attributes.hoverColor,
                    },
                };
            }
            if ( attributes.hoverIconColor ) {
                styles[ '&:hover' ] = merge( styles[ '&:hover' ] || {}, {
                    '.ghostkit-divider-icon': {
                        color: attributes.hoverIconColor,
                    },
                } );
            }

            return styles;
        },
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },
    example: {
        attributes: {
            size: 4,
            icon: '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7813 9.75C16.7813 7.10939 14.6406 4.96875 12 4.96875C9.35939 4.96875 7.21875 7.10939 7.21875 9.75C7.21875 12.3906 9.35939 14.5312 12 14.5312C14.6406 14.5312 16.7813 12.3906 16.7813 9.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.15625 18C10.6023 19.25 13.3977 19.25 15.8437 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
            iconSize: 40,
            color: '#a7a9ab',
            iconColor: '#a7a9ab',
            ghostkitId: 'example-divider',
            ghostkitClassname: 'ghostkit-custom-example-divider',
            className: 'ghostkit-custom-example-divider',
        },
    },
    edit,
    save,
    transforms,
    deprecated,
};
