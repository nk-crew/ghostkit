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
import transforms from './transforms';
import deprecated from './deprecated';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Buttons', '@@text_domain' ),

    description: __( 'Change important links to buttons to get more click rate.', '@@text_domain' ),

    icon: getIcon( 'block-button', true ),

    keywords: [
        __( 'btn', '@@text_domain' ),
        __( 'button', '@@text_domain' ),
    ],

    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/button/',
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
            count: 2,
            align: 'center',
            gap: 'lg',
        },
        innerBlocks: [
            {
                name: 'ghostkit/button-single',
                attributes: {
                    text: 'Button 1',
                    size: 'xl',
                    color: '#0366d6',
                    ghostkitId: 'example-button-1',
                    ghostkitClassname: 'ghostkit-custom-example-button-1',
                    className: 'ghostkit-custom-example-button-1',
                },
            }, {
                name: 'ghostkit/button-single',
                attributes: {
                    text: 'Button 2',
                    size: 'xl',
                    color: '#5c39a7',
                    icon: '<svg class="ghostkit-svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7813 9.75C16.7813 7.10939 14.6406 4.96875 12 4.96875C9.35939 4.96875 7.21875 7.10939 7.21875 9.75C7.21875 12.3906 9.35939 14.5312 12 14.5312C14.6406 14.5312 16.7813 12.3906 16.7813 9.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.15625 18C10.6023 19.25 13.3977 19.25 15.8437 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
                    borderRadius: 50,
                    ghostkitId: 'example-button-2',
                    ghostkitClassname: 'ghostkit-custom-example-button-2',
                    className: 'ghostkit-custom-example-button-2',
                },
            },
        ],
    },

    edit,
    save,
    transforms,
    deprecated,
};
