/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import metadata from './block.json';
import edit from './edit';
import save from './save';

const { __ } = wp.i18n;

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Form', '@@text_domain' ),
    description: __( 'Add contact form to your page with reCaptcha.', '@@text_domain' ),
    icon: getIcon( 'block-form', true ),
    keywords: [
        __( 'form', '@@text_domain' ),
        __( 'contact', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/contact-form/',
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
        innerBlocks: [
            {
                name: 'ghostkit/form-field-email',
                attributes: {
                    required: true,
                },
            }, {
                name: 'ghostkit/form-field-text',
                attributes: {
                    required: true,
                    nameFields: 'first-last',
                    description: __( 'First', '@@text_domain' ),
                    descriptionLast: __( 'Last', '@@text_domain' ),
                },
            }, {
                name: 'ghostkit/form-field-textarea',
                attributes: {
                    label: __( 'Message', '@@text_domain' ),
                    placeholder: __( 'Write your message here...', '@@text_domain' ),
                },
            }, {
                name: 'ghostkit/form-submit-button',
            },
        ],
    },
    edit,
    save,
};
