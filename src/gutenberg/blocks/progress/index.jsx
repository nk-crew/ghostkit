/**
 * Import CSS
 */
import './style.scss';
import './editor.scss';

/**
 * External dependencies
 */
import deepAssign from 'deep-assign';

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
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Progress' ),
    description: __( 'Show the progress of your work, skills or earnings.' ),
    icon: getIcon( 'block-progress', true ),
    keywords: [
        __( 'progress' ),
        __( 'bar' ),
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
                styles[ '&:hover' ] = deepAssign( styles[ '&:hover' ] || {}, {
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
