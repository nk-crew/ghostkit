/**
 * Import CSS
 */
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

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Tabs' ),
    description: __( 'Separate content on the tabs with titles.' ),
    icon: getIcon( 'block-tabs', true ),
    keywords: [
        __( 'tabs' ),
        __( 'tab' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/tabs/',
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    edit,
    save,
};
