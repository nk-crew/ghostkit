/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import getIcon from '../../../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Hidden', '@@text_domain' ),
    description: __( 'Form field hidden.', '@@text_domain' ),
    icon: getIcon( 'block-form-field-hidden', true ),
    ghostkit: {
        supports: {
            styles: true,
            frame: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },
    edit,
    save,
};
