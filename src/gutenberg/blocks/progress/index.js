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
import metadata from './block.json';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Progress', '@@text_domain' ),
    description: __( 'Show the progress of your work, skills or earnings.', '@@text_domain' ),
    icon: getIcon( 'block-progress', true ),
    keywords: [
        __( 'progress', '@@text_domain' ),
        __( 'bar', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/progress/',
        customStylesCallback( attributes ) {
            const styles = {
                '.ghostkit-progress-wrap': {
                    height: attributes.height,
                    borderRadius: attributes.borderRadius,
                    backgroundColor: attributes.backgroundColor,
                    '.ghostkit-progress-bar': {
                        width: attributes.percent + '%',
                        backgroundColor: attributes.color,
                    },
                },
            };

            if ( attributes.hoverColor ) {
                styles[ '&:hover' ] = {
                    '.ghostkit-progress-wrap': {
                        '.ghostkit-progress-bar': {
                            backgroundColor: attributes.hoverColor,
                        },
                    },
                };
            }
            if ( attributes.hoverBackgroundColor ) {
                styles[ '&:hover' ] = merge( styles[ '&:hover' ] || {}, {
                    '.ghostkit-progress-wrap': {
                        backgroundColor: attributes.hoverBackgroundColor,
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
            ghostkitId: 'example-progress',
            ghostkitClassname: 'ghostkit-custom-example-progress',
            className: 'ghostkit-custom-example-progress',
        },
    },
    edit,
    save,
    deprecated,
};
