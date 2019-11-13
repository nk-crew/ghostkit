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

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Changelog', '@@text_domain' ),
    description: __( 'Show the changes log of your product.', '@@text_domain' ),
    icon: getIcon( 'block-changelog', true ),
    keywords: [
        __( 'changelog', '@@text_domain' ),
        __( 'log', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/changelog/',
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
            version: '1.0.0',
            date: '19 August 2077',
        },
        innerBlocks: [
            {
                name: 'core/list',
                attributes: {
                    values: [
                        <li key="list-item-1">
                            <span className="ghostkit-badge" style="background-color: #4ab866;">{ __( 'Added', '@@text_domain' ) }</span>
                            { __( 'Something', '@@text_domain' ) }
                        </li>,
                        <li key="list-item-2">
                            <span className="ghostkit-badge" style="background-color: #0366d6;">{ __( 'Fixed', '@@text_domain' ) }</span>
                            { __( 'Something', '@@text_domain' ) }
                        </li>,
                        <li key="list-item-3">
                            <span className="ghostkit-badge" style="background-color: #63656b;">{ __( 'Changed', '@@text_domain' ) }</span>
                            { __( 'Something', '@@text_domain' ) }
                        </li>,
                    ],
                },
            },
        ],
    },
    edit,
    save,
};
