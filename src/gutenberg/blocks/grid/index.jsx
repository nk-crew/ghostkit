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
import './awb-fallback';
import getBackgroundStyles from './get-background-styles';
import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Grid' ),
    description: __( 'Responsive grid block to build layouts of all shapes and sizes thanks to a twelve column system. Visual columns size and order change.' ),
    icon: getIcon( 'block-grid', true ),
    keywords: [
        __( 'row' ),
        __( 'columns' ),
        __( 'section' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/grid/',
        customStylesCallback( attributes ) {
            const {
                awb_image: image,
            } = attributes;

            let result = {};

            // Image styles.
            if ( image ) {
                result = {
                    ...result,
                    ...getBackgroundStyles( attributes ),
                };
            }

            return result;
        },
        customStylesFilter( styles, data, isEditor, attributes ) {
            // change custom styles in Editor.
            if ( isEditor && attributes.ghostkitClassname ) {
                // background.
                styles = styles.replace( new RegExp( `.${ attributes.ghostkitClassname } > .nk-awb .jarallax-img`, 'g' ), `.ghostkit-grid .${ attributes.ghostkitClassname } > .awb-gutenberg-preview-block .jarallax-img` );
            }
            return styles;
        },
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    edit,
    save,
    transforms,
    deprecated,
};
