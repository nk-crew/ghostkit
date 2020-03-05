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
    title: __( 'Radio', '@@text_domain' ),
    description: __( 'Form field radio.', '@@text_domain' ),
    icon: getIcon( 'block-form-field-radio', true ),
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
