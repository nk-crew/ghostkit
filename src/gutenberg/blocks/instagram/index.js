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
    title: __( 'Instagram', '@@text_domain' ),
    description: __( 'Show Instagram feed and user data.', '@@text_domain' ),
    icon: getIcon( 'block-instagram', true ),
    keywords: [
        __( 'instagram', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/instagram/',
        customStylesCallback( attributes ) {
            const {
                gap,
                gapCustom,
            } = attributes;

            let result = {};

            // Custom Gap.
            if ( 'custom' === gap && typeof gapCustom !== 'undefined' ) {
                result = {
                    ...result,
                    '--gkt-instagram--photos__gap': `${ gapCustom }px`,
                };
            }

            return result;
        },
        supports: {
            styles: true,
            frame: true,
            spacings: true,
            display: true,
            customCSS: true,
        },
    },
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
    },
    edit,
    save,
};
