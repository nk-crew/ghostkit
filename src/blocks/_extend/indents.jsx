// External Dependencies.
import deepAssign from 'deep-assign';

const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { createHigherOrderComponent, Fragment } = wp.element;
const { InspectorAdvancedControls } = wp.blocks;
const {
    BaseControl,
    TextControl,
} = wp.components;

/**
 * Allow custom styles in blocks.
 *
 * @param {Boolean} allow Original block allow custom styles.
 * @param {Object} settings Original block settings.
 * @param {String} name Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function allowCustomStyles( allow, settings, name ) {
    if ( ! allow ) {
        allow = settings && settings.attributes && name && /^ghostkit|^core/.test( name );
    }
    return allow;
}

/**
 * Extend ghostkit block attributes with indents.
 *
 * @param {Object} settings Original block settings.
 * @param {String} name Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings, name ) {
    if ( name && /^ghostkit|^core/.test( name ) ) {
        if ( ! settings.attributes.ghostkitIndents ) {
            settings.attributes.ghostkitIndents = {
                type: 'object',
                default: {},
            };
        }
    }
    return settings;
}

/**
 * Update indents object.
 *
 * @param {String} name - name of new indent.
 * @param {String} val - value for new indent.
 * @param {Object} allIndents - object with all indents.
 * @param {Function} setAttributes - set attributes function.
 */
function updateIndents( name, val, allIndents, setAttributes ) {
    const result = {};
    const newIndents = {};
    newIndents[ name ] = val;
    allIndents = Object.assign( {}, allIndents, newIndents );

    // validate values.
    Object.keys( allIndents ).map( ( key ) => {
        if ( allIndents[ key ] ) {
            result[ key ] = allIndents[ key ];
        }
    } );

    setAttributes( {
        ghostkitIndents: result,
    } );
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom indents if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        if ( ! /^ghostkit|^core/.test( props.name ) ) {
            return <BlockEdit { ...props } />;
        }

        // add new indents controls.

        props.attributes.ghostkitIndents = props.attributes.ghostkitIndents || {};

        return (
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorAdvancedControls>
                    <BaseControl label={ __( 'Indents' ) } >
                        <div className="ghostkit-control-indent">
                            <div className="ghostkit-control-indent-margin">
                                <span>{ __( 'Margin' ) }</span>
                                <div className="ghostkit-control-indent-margin-left">
                                    <TextControl
                                        value={ props.attributes.ghostkitIndents.marginLeft || '' }
                                        placeholder="-"
                                        onChange={ ( nextValue ) => {
                                            updateIndents( 'marginLeft', nextValue, props.attributes.ghostkitIndents, props.setAttributes );
                                        } }
                                    />
                                </div>
                                <div className="ghostkit-control-indent-margin-top">
                                    <TextControl
                                        value={ props.attributes.ghostkitIndents.marginTop || '' }
                                        placeholder="-"
                                        onChange={ ( nextValue ) => {
                                            updateIndents( 'marginTop', nextValue, props.attributes.ghostkitIndents, props.setAttributes );
                                        } }
                                    />
                                </div>
                                <div className="ghostkit-control-indent-margin-right">
                                    <TextControl
                                        value={ props.attributes.ghostkitIndents.marginRight || '' }
                                        placeholder="-"
                                        onChange={ ( nextValue ) => {
                                            updateIndents( 'marginRight', nextValue, props.attributes.ghostkitIndents, props.setAttributes );
                                        } }
                                    />
                                </div>
                                <div className="ghostkit-control-indent-margin-bottom">
                                    <TextControl
                                        value={ props.attributes.ghostkitIndents.marginBottom || '' }
                                        placeholder="-"
                                        onChange={ ( nextValue ) => {
                                            updateIndents( 'marginBottom', nextValue, props.attributes.ghostkitIndents, props.setAttributes );
                                        } }
                                    />
                                </div>
                            </div>
                            <div className="ghostkit-control-indent-padding">
                                <span>{ __( 'Padding' ) }</span>
                                <div className="ghostkit-control-indent-padding-left">
                                    <TextControl
                                        value={ props.attributes.ghostkitIndents.paddingLeft || '' }
                                        placeholder="-"
                                        onChange={ ( nextValue ) => {
                                            updateIndents( 'paddingLeft', nextValue, props.attributes.ghostkitIndents, props.setAttributes );
                                        } }
                                    />
                                </div>
                                <div className="ghostkit-control-indent-padding-top">
                                    <TextControl
                                        value={ props.attributes.ghostkitIndents.paddingTop || '' }
                                        placeholder="-"
                                        onChange={ ( nextValue ) => {
                                            updateIndents( 'paddingTop', nextValue, props.attributes.ghostkitIndents, props.setAttributes );
                                        } }
                                    />
                                </div>
                                <div className="ghostkit-control-indent-padding-right">
                                    <TextControl
                                        value={ props.attributes.ghostkitIndents.paddingRight || '' }
                                        placeholder="-"
                                        onChange={ ( nextValue ) => {
                                            updateIndents( 'paddingRight', nextValue, props.attributes.ghostkitIndents, props.setAttributes );
                                        } }
                                    />
                                </div>
                                <div className="ghostkit-control-indent-padding-bottom">
                                    <TextControl
                                        value={ props.attributes.ghostkitIndents.paddingBottom || '' }
                                        placeholder="-"
                                        onChange={ ( nextValue ) => {
                                            updateIndents( 'paddingBottom', nextValue, props.attributes.ghostkitIndents, props.setAttributes );
                                        } }
                                    />
                                </div>
                            </div>
                        </div>
                    </BaseControl>
                </InspectorAdvancedControls>
            </Fragment>
        );
    };
}, 'withInspectorControl' );

/**
 * Add custom styles to element.
 *
 * @param {Object} customStyles Additional element styles object.
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 *
 * @return {Object} Additional element styles object.
 */
export function addCustomStyles( customStyles, extraProps, blockType, attributes ) {
    const customIndents = attributes.ghostkitIndents && Object.keys( attributes.ghostkitIndents ).length !== 0 ? Object.assign( {}, attributes.ghostkitIndents ) : false;
    const uniqClassname = attributes.ghostkitClassname ? attributes.ghostkitClassname : false;

    if ( customIndents && uniqClassname ) {
        let indentStyles = {};
        indentStyles[ `.${ uniqClassname }` ] = customIndents;

        if ( customStyles ) {
            indentStyles = deepAssign( customStyles, indentStyles );
        }

        return indentStyles;
    }

    return customStyles;
}

/**
 * Add custom styles to element in editor.
 *
 * @param {Object} customStyles Additional element styles object.
 * @param {Object} props Element props.
 *
 * @return {Object} Additional element styles object.
 */
export function addEditorCustomStyles( customStyles, props ) {
    const customIndents = props.block.attributes.ghostkitIndents && Object.keys( props.block.attributes.ghostkitIndents ).length !== 0 ? Object.assign( {}, props.block.attributes.ghostkitIndents ) : false;
    const uniqClassname = props.block.attributes.ghostkitClassname ? props.block.attributes.ghostkitClassname : false;

    if ( customIndents && uniqClassname ) {
        let indentStyles = {};
        indentStyles[ `.${ uniqClassname }` ] = customIndents;

        if ( customStyles ) {
            indentStyles = deepAssign( customStyles, indentStyles );
        }

        return indentStyles;
    }

    return customStyles;
}

export function indents() {
    addFilter( 'ghostkit.blocks.registerBlockType.allowCustomStyles', 'ghostkit/indents/allow-custom-styles', allowCustomStyles );
    addFilter( 'ghostkit.blocks.registerBlockType.withCustomStyles', 'ghostkit/indents/additional-attributes', addAttribute );
    addFilter( 'ghostkit.blocks.getSaveContent.customStyles', 'ghostkit/indents/add-custom-styles', addCustomStyles );
    addFilter( 'ghostkit.editor.BlockListBlock.customStyles', 'ghostkit/indents/add-custom-styles', addEditorCustomStyles );

    addFilter( 'blocks.BlockEdit', 'ghostkit/indents/additional-attributes', withInspectorControl );
}
