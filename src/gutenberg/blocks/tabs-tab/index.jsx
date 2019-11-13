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

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Tab', '@@text_domain' ),
    description: __( 'A single tab within a tabs block.', '@@text_domain' ),
    icon: getIcon( 'block-tabs', true ),
    ghostkit: {
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },
    getEditWrapperProps( attributes ) {
        return { 'data-tab': attributes.slug };
    },
    edit,
    save,
};
