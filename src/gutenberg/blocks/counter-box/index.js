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
import deprecated from './deprecated';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Number Box', '@@text_domain' ),
    description: __( 'Show your progress and rewards using counting numbers.', '@@text_domain' ),
    icon: getIcon( 'block-counter-box', true ),
    keywords: [
        __( 'number', '@@text_domain' ),
        __( 'counter', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/number-box/',
        customStylesCallback( attributes ) {
            const styles = {
                '.ghostkit-counter-box-number': {
                    fontSize: attributes.numberSize,
                    color: attributes.numberColor,
                },
            };

            if ( attributes.hoverNumberColor ) {
                styles[ '&:hover .ghostkit-counter-box-number' ] = {
                    color: attributes.hoverNumberColor,
                };
            }

            return styles;
        },
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
        attributes: {
            number: '77',
            numberColor: '#0366d6',
            ghostkitId: 'example-counter-box',
            ghostkitClassname: 'ghostkit-custom-example-counter-box',
            className: 'ghostkit-custom-example-counter-box',
        },
        innerBlocks: [
            {
                name: 'core/paragraph',
                attributes: {
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis.',
                },
            },
        ],
    },
    edit,
    save,
    deprecated,
    transforms,
};
