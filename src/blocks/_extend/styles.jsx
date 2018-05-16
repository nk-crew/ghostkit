// External Dependencies.
import shorthash from 'shorthash';
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import { getCustomStylesAttr } from '../_utils.jsx';
const {
    applyFilters,
    addFilter,
} = wp.hooks;
const { Fragment, createHigherOrderComponent } = wp.element;

/**
 * Extend block attributes with styles.
 *
 * @param {Object} settings Original block settings.
 * @param {String} name Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings, name ) {
    const allowCustomStyles = applyFilters(
        'ghostkit.blocks.registerBlockType.allowCustomStyles',
        settings && settings.attributes && name && /^ghostkit/.test( name ),
        settings,
        name
    );
    if ( allowCustomStyles ) {
        if ( ! settings.attributes.ghostkitStyles ) {
            settings.attributes.ghostkitStyles = {
                type: 'object',
                default: '',
            };
        }
        if ( ! settings.attributes.ghostkitClassname ) {
            settings.attributes.ghostkitClassname = {
                type: 'string',
                default: '',
            };
        }
        if ( ! settings.attributes.ghostkitId ) {
            settings.attributes.ghostkitId = {
                type: 'string',
                default: false,
            };
        }
        settings = applyFilters( 'ghostkit.blocks.registerBlockType.withCustomStyles', settings, name );

        // change default edit class.
        const defaultEdit = settings.edit;
        if ( defaultEdit.prototype && defaultEdit.prototype.render ) {
            class newEdit extends defaultEdit {
                render() {
                    const {
                        setAttributes,
                        attributes,
                    } = this.props;

                    let customStyles = {};

                    if ( attributes.ghostkitClassname ) {
                        // prepare custom block styles.
                        const blockCustomStyles = this.ghostkitStyles ? this.ghostkitStyles( attributes ) : false;
                        if ( blockCustomStyles && Object.keys( blockCustomStyles ).length !== 0 ) {
                            customStyles[ `.${ attributes.ghostkitClassname }` ] = blockCustomStyles;
                        }

                        customStyles = applyFilters(
                            'ghostkit.editor.customStyles',
                            Object.assign( {}, customStyles ),
                            this.props
                        );

                        if ( JSON.stringify( attributes.ghostkitStyles ) !== JSON.stringify( customStyles ) ) {
                            setAttributes( { ghostkitStyles: customStyles } );
                        }
                    }

                    return <Fragment>
                        { super.render( ...arguments ) }
                        <div { ...getCustomStylesAttr( customStyles ) } />
                    </Fragment>;
                }
            }
            settings.edit = newEdit;
        }
    }

    return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom styles if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withNewAttrs = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        // add new ghostkit props.
        if ( ! props.attributes.ghostkitClassname && typeof props.attributes.ghostkitClassname !== 'undefined' && props.id ) {
            props.attributes.ghostkitId = shorthash.unique( props.id );
            props.attributes.ghostkitClassname = props.name.replace( '/', '-' ) + '-' + props.attributes.ghostkitId;
        }

        return <BlockEdit { ...props } />;
    };
}, 'withNewAttrs' );

/**
 * Override props assigned to save component to inject custom styles.
 * This is only applied if the block's save result is an
 * element and not a markup string.
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 *
 * @return {Object} Filtered props applied to save element.
 */
export function addSaveProps( extraProps, blockType, attributes ) {
    const customStyles = applyFilters(
        'ghostkit.blocks.customStyles',
        attributes.ghostkitStyles ? Object.assign( {}, attributes.ghostkitStyles ) : false,
        extraProps,
        blockType,
        attributes
    );

    if ( customStyles ) {
        extraProps = Object.assign( extraProps || {}, getCustomStylesAttr( customStyles ) );

        if ( attributes.ghostkitClassname ) {
            extraProps.className = classnames( extraProps.className, attributes.ghostkitClassname );
        }
    }

    return extraProps;
}

export function styles() {
    addFilter( 'blocks.registerBlockType', 'ghostkit/styles/additional-attributes', addAttribute );
    addFilter( 'blocks.BlockEdit', 'ghostkit/styles/additional-attributes', withNewAttrs );
    addFilter( 'blocks.getSaveContent.extraProps', 'ghostkit/indents/save-props', addSaveProps );
}
