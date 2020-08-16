/**
 * External dependencies
 */
import shorthash from 'shorthash';
import deepEqual from 'deep-equal';
import { throttle } from 'throttle-debounce';

/**
 * Internal dependencies
 */
import './fallback-2-5';
import { replaceClass } from '../../utils/classes-replacer';
import EditorStyles from '../../components/editor-styles';

import getStyles from './get-styles';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
    addFilter,
} = wp.hooks;

const {
    getBlockType,
} = wp.blocks;

const {
    withSelect,
} = wp.data;

const {
    Component,
    Fragment,
} = wp.element;

const {
    createHigherOrderComponent,
} = wp.compose;

const { GHOSTKIT } = window;

/**
 * Custom Styles Component.
 */
class CustomStylesComponent extends Component {
    constructor( props ) {
        super( props );

        this.onUpdate = throttle( 60, this.onUpdate.bind( this ) );
        this.getGhostKitAtts = this.getGhostKitAtts.bind( this );
    }

    componentDidMount() {
        this.onUpdate( true );
    }

    componentDidUpdate() {
        this.onUpdate();
    }

    onUpdate( checkDuplicates ) {
        const {
            setAttributes,
            attributes,
            blockSettings,
        } = this.props;

        let {
            className,
        } = attributes;

        const newAttrs = {};

        // prepare custom block styles.
        const blockCustomStyles = applyFilters(
            'ghostkit.blocks.customStyles',
            blockSettings.ghostkit && blockSettings.ghostkit.customStylesCallback ? blockSettings.ghostkit.customStylesCallback( attributes, this.props ) : {},
            this.props
        );

        const thereIsCustomStyles = blockCustomStyles && Object.keys( blockCustomStyles ).length;
        const thereIsCustomCSS = !! attributes.ghostkitCustomCSS;

        if ( thereIsCustomStyles || thereIsCustomCSS ) {
            const ghostkitAtts = this.getGhostKitAtts( checkDuplicates );

            if ( ghostkitAtts.ghostkitClassname ) {
                let updateAttrs = false;

                let customClassName = `.${ attributes.ghostkitClassname }`;

                if ( blockSettings.ghostkit && blockSettings.ghostkit.customSelector ) {
                    customClassName = blockSettings.ghostkit.customSelector( customClassName, this.props );
                }

                if ( thereIsCustomStyles ) {
                    newAttrs.ghostkitStyles = {
                        [ customClassName ]: blockCustomStyles,
                    };
                }

                if ( ghostkitAtts.ghostkitClassname !== attributes.ghostkitClassname ) {
                    newAttrs.ghostkitClassname = ghostkitAtts.ghostkitClassname;
                    updateAttrs = true;
                }
                if ( ghostkitAtts.ghostkitId !== attributes.ghostkitId ) {
                    newAttrs.ghostkitId = ghostkitAtts.ghostkitId;
                    updateAttrs = true;
                }

                // Regenerate custom classname if it was removed or changed.
                const newClassName = replaceClass( className, 'ghostkit-custom', ghostkitAtts.ghostkitId );
                if ( newClassName !== className ) {
                    newAttrs.className = newClassName;
                }

                if ( thereIsCustomStyles && ! updateAttrs ) {
                    updateAttrs = ! deepEqual( attributes.ghostkitStyles, newAttrs.ghostkitStyles );
                }

                if ( updateAttrs ) {
                    setAttributes( newAttrs );
                }
            }
        } else if ( attributes.ghostkitStyles ) {
            className = replaceClass( className, 'ghostkit-custom', '' );

            setAttributes( {
                ghostkitClassname: '',
                ghostkitId: '',
                ghostkitStyles: '',
                className,
            } );
        }
    }

    /**
     * Get recursive all blocks of the current page
     *
     * @param {boolean} blocks - block list
     *
     * @return {array} block list
     */
    getAllBlocks( blocks = false ) {
        let result = [];

        if ( ! blocks ) {
            blocks = wp.data.select( 'core/block-editor' ).getBlocks();
        }

        if ( ! blocks ) {
            return result;
        }

        blocks.forEach( ( data ) => {
            result.push( data );

            if ( data.innerBlocks && data.innerBlocks.length ) {
                result = [
                    ...result,
                    ...this.getAllBlocks( data.innerBlocks ),
                ];
            }
        } );

        return result;
    }

    getGhostKitAtts( checkDuplicates ) {
        const {
            attributes,
            clientId,
        } = this.props;

        let {
            ghostkitId,
            ghostkitClassname,
        } = attributes;

        // create block ID.
        if ( ! ghostkitId || checkDuplicates ) {
            const usedIds = {};

            // prevent unique ID duplication after block duplicated.
            if ( checkDuplicates ) {
                const allBlocks = this.getAllBlocks();
                allBlocks.forEach( ( data ) => {
                    if ( data.clientId && data.attributes && data.attributes.ghostkitId ) {
                        usedIds[ data.attributes.ghostkitId ] = data.clientId;

                        if ( data.clientId !== clientId && data.attributes.ghostkitId === ghostkitId ) {
                            ghostkitId = '';
                        }
                    }
                } );
            }

            // prepare new block id.
            if ( clientId && ! ghostkitId && 'undefined' !== typeof ghostkitId ) {
                let ID = ghostkitId || '';

                // check if ID already exist.
                let tryCount = 10;
                while ( ! ID || ( 'undefined' !== typeof usedIds[ ID ] && usedIds[ ID ] !== clientId && 0 < tryCount ) ) {
                    ID = shorthash.unique( clientId );
                    tryCount -= 1;
                }

                if ( ID && 'undefined' === typeof usedIds[ ID ] ) {
                    usedIds[ ID ] = clientId;
                }

                if ( ID !== ghostkitId ) {
                    ghostkitId = ID;
                    ghostkitClassname = `ghostkit-custom-${ ID }`;
                }
            }
        }

        if ( ghostkitId && ghostkitClassname ) {
            return {
                ghostkitId,
                ghostkitClassname,
            };
        }

        return {};
    }

    render() {
        const {
            attributes,
            blockSettings,
        } = this.props;

        let styles = '';

        // generate custom styles.
        if ( attributes.ghostkitClassname && attributes.ghostkitStyles && Object.keys( attributes.ghostkitStyles ).length ) {
            styles = getStyles( attributes.ghostkitStyles, '', false );

            if ( blockSettings && blockSettings.ghostkit && blockSettings.ghostkit.customStylesFilter ) {
                styles = blockSettings.ghostkit.customStylesFilter( styles, attributes.ghostkitStyles, true, attributes );
            }
        }

        // filter custom styles.
        styles = applyFilters(
            'ghostkit.editor.customStylesOutput',
            styles,
            this.props
        );

        if ( ! styles ) {
            return null;
        }

        const customStylesRender = [ { css: window.GHOSTKIT.replaceVars( styles ) } ];

        return (
            <EditorStyles styles={ customStylesRender } />
        );
    }
}

const CustomStylesComponentWithSelect = withSelect( ( select, ownProps ) => ( {
    blockSettings: getBlockType( ownProps.name ),
} ) )( CustomStylesComponent );

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
        allow = false;

        if ( settings && settings.attributes ) {
            if ( GHOSTKIT.hasBlockSupport( settings || blockSettings, 'styles', false ) ) {
                allow = true;
            } else {
                allow = applyFilters(
                    'ghostkit.blocks.allowCustomStyles',
                    false,
                    settings,
                    settings.name || blockSettings.name
                );
            }
        }

        if ( allow ) {
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

            settings = applyFilters( 'ghostkit.blocks.withCustomStyles', settings, name );
        }
    } );

    return blockSettings;
}

/**
 * Extend block attributes with styles after block transformation
 *
 * @param {Object} transformedBlock Original transformed block.
 * @param {Object} blocks           Blocks on which transform was applied.
 *
 * @return {Object} Modified transformed block, with layout preserved.
 */
function addAttributeTransform( transformedBlock, blocks ) {
    if (
        blocks
        && blocks[ 0 ]
        && blocks[ 0 ].clientId === transformedBlock.clientId
        && blocks[ 0 ].attributes
        && blocks[ 0 ].attributes.ghostkitStyles
        && Object.keys( blocks[ 0 ].attributes.ghostkitStyles ).length
    ) {
        Object.keys( blocks[ 0 ].attributes ).forEach( ( attrName ) => {
            if ( /^ghostkit/.test( attrName ) ) {
                transformedBlock.attributes[ attrName ] = blocks[ 0 ].attributes[ attrName ];
            }
        } );
    }

    return transformedBlock;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom styles if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withNewAttrs = createHigherOrderComponent( ( BlockEdit ) => function( props ) {
    return (
        <Fragment>
            <BlockEdit { ...props } />
            <CustomStylesComponentWithSelect { ...props } />
        </Fragment>
    );
}, 'withNewAttrs' );

// Init filters.
addFilter( 'blocks.registerBlockType', 'ghostkit/styles/additional-attributes', addAttribute );
addFilter( 'blocks.switchToBlockType.transformedBlock', 'ghostkit/styles/additional-attributes', addAttributeTransform );
addFilter( 'editor.BlockEdit', 'ghostkit/styles/additional-attributes', withNewAttrs );
