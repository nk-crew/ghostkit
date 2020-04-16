/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import './awb-fallback';
import getIcon from '../../utils/get-icon';

import getBackgroundStyles from './get-background-styles';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

const { __ } = wp.i18n;

const { createHigherOrderComponent } = wp.compose;

const { addFilter } = wp.hooks;

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Grid', '@@text_domain' ),
    description: __( 'Responsive grid block to build layouts of all shapes and sizes thanks to a twelve column system. Visual columns size and order change.', '@@text_domain' ),
    icon: getIcon( 'block-grid', true ),
    keywords: [
        __( 'row', '@@text_domain' ),
        __( 'columns', '@@text_domain' ),
        __( 'section', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/grid/',
        customStylesCallback( attributes ) {
            const {
                awb_image: image,
                gap,
                gapCustom,
            } = attributes;

            let result = {};

            // Image styles.
            if ( image ) {
                result = {
                    ...result,
                    ...getBackgroundStyles( attributes ),
                };
            }

            // Custom Gap.
            if ( 'custom' === gap && 'undefined' !== typeof gapCustom ) {
                // we need to use `%` unit because of conflict with complex calc() and 0 value.
                const unit = gapCustom ? 'px' : '%';

                result = {
                    ...result,
                    '--gkt-grid__gap': `${ gapCustom }${ unit }`,
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
            frame: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },
    example: {
        attributes: {
            columns: 2,
        },
        innerBlocks: [
            {
                name: 'ghostkit/grid-column',
                innerBlocks: [
                    {
                        name: 'core/paragraph',
                        attributes: {
                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis.',
                        },
                    },
                ],
            }, {
                name: 'ghostkit/grid-column',
                innerBlocks: [
                    {
                        name: 'core/paragraph',
                        attributes: {
                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis.',
                        },
                    },
                ],
            },
        ],
    },
    edit,
    save,
    transforms,
    deprecated,
};

/**
 * Add data attribute to hide block from editor when inserting templates.
 *
 * @param  {Function} BlockListBlock Original component
 * @return {Function}                Wrapped component
 */
export const withClasses = createHigherOrderComponent( ( BlockListBlock ) => (
    ( props ) => {
        const { name: blockName } = props;

        if ( 'ghostkit/grid' === blockName && props.attributes.isTemplatesModalOnly ) {
            return <BlockListBlock { ...props } data-ghostkit-grid-templates-modal-only="true" />;
        }

        return <BlockListBlock { ...props } />;
    }
) );

addFilter( 'editor.BlockListBlock', 'core/editor/grid/with-classes', withClasses );
