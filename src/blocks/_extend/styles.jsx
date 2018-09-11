// External Dependencies.
import shorthash from 'shorthash';
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import { camelCaseToDash } from '../_utils.jsx';

const {
    applyFilters,
    addFilter,
} = wp.hooks;

const {
    hasBlockSupport,
} = wp.blocks;

const {
    Component,
    Fragment,
} = wp.element;

const {
    createHigherOrderComponent,
} = wp.compose;

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
        // object values.
        if ( data[ key ] !== null && typeof data[ key ] === 'object' ) {
            // media for different screens
            if ( /^media_/.test( key ) ) {
                resultCSS += ( resultCSS ? ' ' : '' ) + `@media #{ghostkitvar:${ key }} { ${ getStyles( data[ key ], selector, false ) } }`;

            // nested selectors.
            } else {
                let nestedSelector = selector;
                if ( nestedSelector ) {
                    if ( key.indexOf( '&' ) !== -1 ) {
                        nestedSelector = key.replace( /&/g, nestedSelector );

                    // inside exported xml file all & symbols converted to \u0026
                    } else if ( key.indexOf( 'u0026' ) !== -1 ) {
                        nestedSelector = key.replace( /u0026/g, nestedSelector );
                    } else {
                        nestedSelector = `${ nestedSelector } ${ key }`;
                    }
                } else {
                    nestedSelector = key;
                }
                resultCSS += ( resultCSS ? ' ' : '' ) + getStyles( data[ key ], nestedSelector, false );
            }

        // style properties and values.
        } else if ( typeof data[ key ] !== 'undefined' && data[ key ] !== false ) {
            // fix selector > and < usage.
            selector = selector.replace( />/g, '&gt;' );
            selector = selector.replace( /</g, '&lt;' );

            if ( ! result[ selector ] ) {
                result[ selector ] = '';
            }
            const propName = camelCaseToDash( key );
            let propValue = data[ key ];
            const thereIsImportant = / !important$/.test( propValue );

            if ( thereIsImportant ) {
                propValue = propValue.replace( / !important$/, '' );
            }

            // add pixels.
            if (
                ( typeof propValue === 'number' && propValue !== 0 && cssPropsWithPixels.includes( propName ) ) ||
                ( typeof propValue === 'string' && /^[0-9.\-]*$/.test( propValue ) )
            ) {
                propValue += 'px';
            }

            if ( thereIsImportant ) {
                propValue += ' !important';
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

        let $style = jQuery( '#ghostkit-blocks-custom-css-inline-css' );

        if ( ! $style.length ) {
            $style = jQuery( '<style type="text/css" id="ghostkit-blocks-custom-css-inline-css">' ).appendTo( 'head' );
        }

        $style.html( window.GHOSTKIT.replaceVars( stylesString ) );
    }, 30 );
};

/**
 * Extend block attributes with styles.
 *
 * @param {Object} blockSettings Original block settings.
 * @param {String} name Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( blockSettings, name ) {
    let allow = false;

    // prepare settings of block + deprecated blocks.
    const eachSettings = [ blockSettings ];
    if ( blockSettings.deprecated && blockSettings.deprecated.length ) {
        blockSettings.deprecated.forEach( ( item ) => {
            eachSettings.push( item );
        } );
    }

    eachSettings.forEach( ( settings ) => {
        if ( settings && settings.attributes && hasBlockSupport( settings, 'ghostkitStyles', false ) ) {
            allow = true;
        }

        if ( ! allow ) {
            allow = applyFilters(
                'ghostkit.blocks.registerBlockType.allowCustomStyles',
                false,
                settings,
                name
            );
        }

        if ( allow ) {
            if ( ! settings.attributes.ghostkitStyles ) {
                settings.attributes.ghostkitStyles = {
                    type: 'object',
                    default: '',
                };

                // add to deprecated items.
                if ( settings.deprecated && settings.deprecated.length ) {
                    settings.deprecated.forEach( ( item, i ) => {
                        if ( settings.deprecated[ i ].attributes ) {
                            settings.deprecated[ i ].attributes.ghostkitStyles = settings.attributes.ghostkitStyles;
                        }
                    } );
                }
            }
            if ( ! settings.attributes.ghostkitClassname ) {
                settings.attributes.ghostkitClassname = {
                    type: 'string',
                    default: '',
                };

                // add to deprecated items.
                if ( settings.deprecated && settings.deprecated.length ) {
                    settings.deprecated.forEach( ( item, i ) => {
                        if ( settings.deprecated[ i ].attributes ) {
                            settings.deprecated[ i ].attributes.ghostkitClassname = settings.attributes.ghostkitClassname;
                        }
                    } );
                }
            }
            if ( ! settings.attributes.ghostkitId ) {
                settings.attributes.ghostkitId = {
                    type: 'string',
                    default: '',
                };

                // add to deprecated items.
                if ( settings.deprecated && settings.deprecated.length ) {
                    settings.deprecated.forEach( ( item, i ) => {
                        if ( settings.deprecated[ i ].attributes ) {
                            settings.deprecated[ i ].attributes.ghostkitId = settings.attributes.ghostkitId;
                        }
                    } );
                }
            }

            if ( blockSettings.supports && blockSettings.supports.ghostkitStylesCallback ) {
                settings.attributes.ghostkitStylesCallback = {
                    type: 'function',
                    default: blockSettings.supports.ghostkitStylesCallback,
                };

                // add to deprecated items.
                if ( settings.deprecated && settings.deprecated.length ) {
                    settings.deprecated.forEach( ( item, i ) => {
                        if ( settings.deprecated[ i ].attributes ) {
                            settings.deprecated[ i ].attributes.ghostkitStylesCallback = settings.attributes.ghostkitStylesCallback;
                        }
                    } );
                }
            }
            settings = applyFilters( 'ghostkit.blocks.registerBlockType.withCustomStyles', settings, name );
        }
    } );

    return blockSettings;
}

/**
 * List of used IDs to prevent duplicates.
 *
 * @type {Object}
 */
const usedIds = {};

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom styles if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withNewAttrs = createHigherOrderComponent( ( BlockEdit ) => {
    class newEdit extends Component {
        constructor() {
            super( ...arguments );

            this.onUpdate = this.onUpdate.bind( this );

            // add new ghostkit props.
            if ( this.props.clientId && typeof this.props.attributes.ghostkitId !== 'undefined' ) {
                let ID = this.props.attributes.ghostkitId || '';

                // check if ID already exist.
                let tryCount = 10;
                while ( ! ID || ( typeof usedIds[ ID ] !== 'undefined' && usedIds[ ID ] !== this.props.clientId && tryCount > 0 ) ) {
                    ID = shorthash.unique( this.props.clientId );
                    tryCount--;
                }

                if ( ID && typeof usedIds[ ID ] === 'undefined' ) {
                    usedIds[ ID ] = this.props.clientId;
                }

                if ( ID !== this.props.attributes.ghostkitId ) {
                    this.props.attributes.ghostkitId = ID;
                    this.props.attributes.ghostkitClassname = this.props.name.replace( '/', '-' ) + '-' + ID;
                }
            }
        }

        componentDidMount() {
            this.onUpdate();
        }
        componentDidUpdate() {
            this.onUpdate();
        }

        onUpdate() {
            const {
                setAttributes,
                attributes,
            } = this.props;

            if ( attributes.ghostkitClassname ) {
                const customStyles = {};

                // prepare custom block styles.
                const blockCustomStyles = applyFilters(
                    'ghostkit.blocks.customStyles',
                    attributes.ghostkitStylesCallback ? attributes.ghostkitStylesCallback( attributes ) : {},
                    this.props
                );

                if ( blockCustomStyles && Object.keys( blockCustomStyles ).length !== 0 ) {
                    customStyles[ `.${ attributes.ghostkitClassname }` ] = blockCustomStyles;
                }

                if ( JSON.stringify( attributes.ghostkitStyles ) !== JSON.stringify( customStyles ) ) {
                    setAttributes( { ghostkitStyles: customStyles } );
                }
            }
        }

        render() {
            const {
                attributes,
            } = this.props;

            if ( attributes.ghostkitStyles && attributes.ghostkitClassname ) {
                return (
                    <Fragment>
                        <BlockEdit { ...this.props } />
                        <div { ...getCustomStylesAttr( attributes.ghostkitStyles ) } />
                    </Fragment>
                );
            }

            return <BlockEdit { ...this.props } />;
        }
    }
    return newEdit;
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

    if ( customStyles && Object.keys( customStyles ).length !== 0 ) {
        extraProps = Object.assign( extraProps || {}, getCustomStylesAttr( customStyles ) );

        if ( attributes.ghostkitClassname ) {
            extraProps.className = classnames( extraProps.className, attributes.ghostkitClassname );
        }
    }

    return extraProps;
}

// Init filters.
addFilter( 'blocks.registerBlockType', 'ghostkit/styles/additional-attributes', addAttribute );
addFilter( 'editor.BlockEdit', 'ghostkit/styles/additional-attributes', withNewAttrs );
addFilter( 'blocks.getSaveContent.extraProps', 'ghostkit/indents/save-props', addSaveProps );
