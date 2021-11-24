/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import '../grid/awb-fallback';
import getIcon from '../../utils/get-icon';
import getBackgroundStyles from '../grid/get-background-styles';

import getColClass from './get-col-class';
import metadata from './block.json';
import edit from './edit';
import save from './save';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createHigherOrderComponent } = wp.compose;
const { addFilter } = wp.hooks;

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Column', '@@text_domain' ),
    description: __( 'A single column within a grid block.', '@@text_domain' ),
    icon: getIcon( 'block-grid-column', true ),
    ghostkit: {
        customSelector( selector ) {
            // extend selector to add possibility to override default column spacings without !important
            selector = `.ghostkit-grid ${ selector }`;

            return selector;
        },
        customStylesCallback( attributes ) {
            const {
                stickyContent,
                stickyContentOffset,
                awb_image: image,
            } = attributes;

            let result = {};

            // Sticky styles.
            if ( stickyContent && 'undefined' !== typeof stickyContentOffset ) {
                result[ '--gkt-grid--column-sticky__offset' ] = `${ stickyContentOffset }px`;
            }

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
                styles = styles.replace( new RegExp( '> .nk-awb .jarallax-img', 'g' ), '> .awb-gutenberg-preview-block .jarallax-img' );
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
    edit,
    save,
};

/**
 * Override the default block element to add column classes on wrapper.
 *
 * @param  {Function} BlockListBlock Original component
 * @return {Function}                Wrapped component
 */
export const withClasses = createHigherOrderComponent( ( BlockListBlock ) => (
    ( props ) => {
        const { name: blockName } = props;

        if ( 'ghostkit/grid-column' === blockName ) {
            const className = classnames( props.attributes.className, getColClass( props ) );
            return <BlockListBlock { ...props } className={ className } />;
        }

        return <BlockListBlock { ...props } />;
    }
) );

addFilter( 'editor.BlockListBlock', 'ghostkit/grid-column/with-classes', withClasses );
