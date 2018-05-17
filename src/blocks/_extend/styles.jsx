// External Dependencies.
import shorthash from 'shorthash';
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import { camelCaseToDash } from '../_utils.jsx';

const {
    applyFilters,
    addFilter,
} = wp.hooks;
const { Fragment, createHigherOrderComponent } = wp.element;

const cssPropsWithPixels = [ 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-width', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-radius', 'bottom', 'top', 'left', 'right', 'font-size', 'height', 'width', 'min-height', 'min-width', 'max-height', 'max-width', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'margin', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'padding', 'outline-width' ];

/**
 * Get styles from object.
 *
 * @param {object} data - styles data.
 * @param {string} selector - current styles selector (useful for nested styles).
 * @param {boolean} render - render styles after generation.
 * @return {string} - ready to use styles string.
 */
const getStyles = ( data = {}, selector = '', render = true ) => {
    const result = {};
    let resultCSS = '';

    // add styles.
    Object.keys( data ).map( ( key ) => {
        if ( data[ key ] !== null && typeof data[ key ] === 'object' ) {
            // prepare nested selector.
            let nestedSelector = selector;
            if ( nestedSelector ) {
                if ( key.indexOf( '&' ) !== -1 ) {
                    nestedSelector = key.replace( /&/g, nestedSelector );
                } else {
                    nestedSelector = `${ nestedSelector } ${ key }`;
                }
            } else {
                nestedSelector = key;
            }
            resultCSS += ( resultCSS ? ' ' : '' ) + getStyles( data[ key ], nestedSelector, false );
        } else if ( typeof data[ key ] !== 'undefined' && data[ key ] !== false ) {
            if ( ! result[ selector ] ) {
                result[ selector ] = '';
            }
            const propName = camelCaseToDash( key );
            let propValue = data[ key ];

            // add pixels.
            if (
                ( typeof propValue === 'number' && propValue !== 0 && cssPropsWithPixels.includes( propName ) ) ||
                ( typeof propValue === 'string' && /^[0-9.\-]*$/.test( propValue ) )
            ) {
                propValue += 'px';
            }

            result[ selector ] += ` ${ propName }: ${ propValue };`;
        }
    } );

    // add styles to selectors.
    Object.keys( result ).map( ( key ) => {
        resultCSS = `${ key } {${ result[ key ] } }${ resultCSS ? ` ${ resultCSS }` : '' }`;
    } );

    // render new styles.
    if ( render ) {
        renderStyles();
    }

    return resultCSS;
};

/**
 * Get styles attribute.
 *
 * @param {object} data - styles data.
 * @return {string} - data attribute with styles.
 */
const getCustomStylesAttr = ( data = {} ) => {
    return {
        'data-ghostkit-styles': getStyles( data ),
    };
};

/**
 * Render styles from all available ghostkit components.
 */
let renderTimeout;
const renderStyles = () => {
    clearTimeout( renderTimeout );
    renderTimeout = setTimeout( () => {
        let stylesString = '';
        jQuery( '[data-ghostkit-styles]' ).each( function() {
            stylesString += jQuery( this ).attr( 'data-ghostkit-styles' );
        } );

        let $style = jQuery( '#ghostkit-blocks-custom-css' );

        if ( ! $style.length ) {
            $style = jQuery( '<style type="text/css" id="ghostkit-blocks-custom-css">' ).appendTo( 'head' );
        }

        $style.html( stylesString );
    }, 30 );
};

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
                default: '',
            };
        }
        settings = applyFilters( 'ghostkit.blocks.registerBlockType.withCustomStyles', settings, name );

        // change default edit class.
        const defaultEdit = settings.edit;
        if ( defaultEdit.prototype && defaultEdit.prototype.render ) {
            class newEdit extends defaultEdit {
                constructor( props ) {
                    const {
                        attributes,
                        setAttributes,
                        sharedBlock,
                    } = props;
                    super( ...arguments );

                    // Remove custom classname if already exist the same classname on the page.
                    // This may be because of cloned block.
                    // Don't work for shared blocks
                    if ( ! sharedBlock && attributes.ghostkitClassname && jQuery( '.' + attributes.ghostkitClassname ).length ) {
                        setAttributes( {
                            ghostkitClassname: '',
                            ghostkitId: '',
                        } );
                    }
                }
                render() {
                    const {
                        setAttributes,
                        attributes,
                    } = this.props;

                    const customStyles = {};

                    if ( attributes.ghostkitClassname ) {
                        // prepare custom block styles.
                        const blockCustomStyles = applyFilters(
                            'ghostkit.blocks.customStyles',
                            this.ghostkitStyles ? this.ghostkitStyles( attributes ) : {},
                            this.props
                        );

                        if ( blockCustomStyles && Object.keys( blockCustomStyles ).length !== 0 ) {
                            customStyles[ `.${ attributes.ghostkitClassname }` ] = blockCustomStyles;
                        }

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
function addSaveProps( extraProps, blockType, attributes ) {
    const customStyles = attributes.ghostkitStyles ? Object.assign( {}, attributes.ghostkitStyles ) : false;

    if ( customStyles ) {
        extraProps = Object.assign( extraProps || {}, getCustomStylesAttr( customStyles ) );

        if ( attributes.ghostkitClassname ) {
            extraProps.className = classnames( extraProps.className, attributes.ghostkitClassname );
        }
    }

    return extraProps;
}

// Init filters.
addFilter( 'blocks.registerBlockType', 'ghostkit/styles/additional-attributes', addAttribute );
addFilter( 'blocks.BlockEdit', 'ghostkit/styles/additional-attributes', withNewAttrs );
addFilter( 'blocks.getSaveContent.extraProps', 'ghostkit/indents/save-props', addSaveProps );
