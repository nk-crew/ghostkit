// External Dependencies.
import deepAssign from 'deep-assign';

// Internal Dependencies.
import Logo from '../_icons/ghostkit.svg';

const { __ } = wp.i18n;

const {
    applyFilters,
    addFilter,
} = wp.hooks;

const {
    Component,
    Fragment,
} = wp.element;

const {
    createHigherOrderComponent,
} = wp.compose;

const {
    hasBlockSupport,
} = wp.blocks;
const { InspectorAdvancedControls } = wp.editor;

const {
    BaseControl,
    TextControl,
    SelectControl,
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
    if ( hasBlockSupport( settings, 'ghostkitIndents', false ) ) {
        allow = true;
    }

    if ( ! allow ) {
        allow = applyFilters(
            'ghostkit.blocks.allowCustomIndents',
            name && /^core/.test( name ),
            settings,
            name
        );
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
    let allow = false;

    if ( hasBlockSupport( settings, 'ghostkitIndents', false ) ) {
        allow = true;
    }

    if ( ! allow ) {
        allow = applyFilters(
            'ghostkit.blocks.allowCustomIndents',
            name && /^core/.test( name ),
            settings,
            name
        );
    }

    if ( allow ) {
        if ( ! settings.attributes.ghostkitIndents ) {
            settings.attributes.ghostkitIndents = {
                type: 'object',
                default: {},
            };

            // add to deprecated items.
            if ( settings.deprecated && settings.deprecated.length ) {
                settings.deprecated.forEach( ( item, i ) => {
                    if ( settings.deprecated[ i ].attributes ) {
                        settings.deprecated[ i ].attributes.ghostkitIndents = settings.attributes.ghostkitIndents;
                    }
                } );
            }
        }
    }
    return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom indents if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent( ( OriginalComponent ) => {
    class GhostkitIndentsWrapper extends Component {
        constructor() {
            super( ...arguments );

            this.setState = this.setState.bind( this );
            this.state = {
                device: '',
            };

            this.updateIndents = this.updateIndents.bind( this );
            this.getCurrentIndent = this.getCurrentIndent.bind( this );
        }

        /**
         * Update indents object.
         *
         * @param {String} name - name of new indent.
         * @param {String} val - value for new indent.
         */
        updateIndents( name, val ) {
            const { setAttributes } = this.props;
            const { device } = this.state;
            let { ghostkitIndents = {} } = this.props.attributes;
            const result = {};
            const newIndents = {};

            if ( device ) {
                newIndents[ device ] = {};
                newIndents[ device ][ name ] = val;
            } else {
                newIndents[ name ] = val;
            }

            // add default properties to keep sorting.
            ghostkitIndents = deepAssign( {
                media_xl: {},
                media_lg: {},
                media_md: {},
                media_sm: {},
            }, ghostkitIndents, newIndents );

            // validate values.
            Object.keys( ghostkitIndents ).map( ( key ) => {
                if ( ghostkitIndents[ key ] ) {
                    // check if device object.
                    if ( typeof ghostkitIndents[ key ] === 'object' ) {
                        Object.keys( ghostkitIndents[ key ] ).map( ( keyDevice ) => {
                            if ( ghostkitIndents[ key ][ keyDevice ] ) {
                                if ( ! result[ key ] ) {
                                    result[ key ] = {};
                                }
                                result[ key ][ keyDevice ] = ghostkitIndents[ key ][ keyDevice ];
                            }
                        } );
                    } else {
                        result[ key ] = ghostkitIndents[ key ];
                    }
                }
            } );

            setAttributes( {
                ghostkitIndents: result,
            } );
        }

        /**
         * Get current indent for selected device type.
         *
         * @param {String} name - name of indent.
         *
         * @returns {String} indent value.
         */
        getCurrentIndent( name ) {
            const { ghostkitIndents = {} } = this.props.attributes;
            const { device } = this.state;
            let result = '';

            if ( ! device ) {
                if ( ghostkitIndents[ name ] ) {
                    result = ghostkitIndents[ name ];
                }
            } else if ( ghostkitIndents[ device ] && ghostkitIndents[ device ][ name ] ) {
                result = ghostkitIndents[ device ][ name ];
            }

            return result;
        }

        render() {
            const props = this.props;
            let allow = false;

            if ( hasBlockSupport( props.name, 'ghostkitIndents', false ) ) {
                allow = true;
            }

            if ( ! allow ) {
                allow = applyFilters(
                    'ghostkit.blocks.allowCustomIndents',
                    props.name && /^core/.test( props.name ),
                    props,
                    props.name
                );
            }

            if ( ! allow ) {
                return <OriginalComponent { ...props } />;
            }

            // add new indents controls.
            return (
                <Fragment>
                    <OriginalComponent
                        { ...props }
                        { ...this.state }
                        setState={ this.setState }
                    />
                    <InspectorAdvancedControls>
                        <BaseControl label={ __( 'Indents' ) } >
                            <div className="ghostkit-control-indent">
                                <Logo className="ghostkit-control-indent-logo" />
                                <div className="ghostkit-control-indent-margin">
                                    <span>{ __( 'Margin' ) }</span>
                                    <div className="ghostkit-control-indent-margin-left">
                                        <TextControl
                                            value={ this.getCurrentIndent( 'marginLeft' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateIndents( 'marginLeft', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-indent-margin-top">
                                        <TextControl
                                            value={ this.getCurrentIndent( 'marginTop' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateIndents( 'marginTop', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-indent-margin-right">
                                        <TextControl
                                            value={ this.getCurrentIndent( 'marginRight' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateIndents( 'marginRight', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-indent-margin-bottom">
                                        <TextControl
                                            value={ this.getCurrentIndent( 'marginBottom' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateIndents( 'marginBottom', nextValue ) }
                                        />
                                    </div>
                                </div>
                                <div className="ghostkit-control-indent-padding">
                                    <span>{ __( 'Padding' ) }</span>
                                    <div className="ghostkit-control-indent-padding-left">
                                        <TextControl
                                            value={ this.getCurrentIndent( 'paddingLeft' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateIndents( 'paddingLeft', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-indent-padding-top">
                                        <TextControl
                                            value={ this.getCurrentIndent( 'paddingTop' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateIndents( 'paddingTop', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-indent-padding-right">
                                        <TextControl
                                            value={ this.getCurrentIndent( 'paddingRight' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateIndents( 'paddingRight', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-indent-padding-bottom">
                                        <TextControl
                                            value={ this.getCurrentIndent( 'paddingBottom' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateIndents( 'paddingBottom', nextValue ) }
                                        />
                                    </div>
                                </div>
                                <div className="ghostkit-control-indent-device">
                                    <SelectControl
                                        value={ this.state.device }
                                        onChange={ ( value ) => {
                                            this.setState( {
                                                device: value,
                                            } );
                                        } }
                                        options={ [
                                            {
                                                label: __( 'All' ),
                                                value: '',
                                            }, {
                                                label: __( 'Desktop' ),
                                                value: 'media_xl',
                                            }, {
                                                label: __( 'Laptop' ),
                                                value: 'media_lg',
                                            }, {
                                                label: __( 'Tablet' ),
                                                value: 'media_md',
                                            }, {
                                                label: __( 'Mobile' ),
                                                value: 'media_sm',
                                            },
                                        ] }
                                    />
                                </div>
                            </div>
                        </BaseControl>
                    </InspectorAdvancedControls>
                </Fragment>
            );
        }
    }

    return GhostkitIndentsWrapper;
}, 'withInspectorControl' );

/**
 * Add custom styles to element in editor.
 *
 * @param {Object} customStyles Additional element styles object.
 * @param {Object} props Element props.
 *
 * @return {Object} Additional element styles object.
 */
function addEditorCustomStyles( customStyles, props ) {
    const customIndents = props.attributes.ghostkitIndents && Object.keys( props.attributes.ghostkitIndents ).length !== 0 ? deepAssign( {}, props.attributes.ghostkitIndents ) : false;

    if ( customStyles && customIndents ) {
        customStyles = deepAssign( customStyles, customIndents );
    }

    return customStyles;
}

// Init filters.
addFilter( 'ghostkit.blocks.registerBlockType.allowCustomStyles', 'ghostkit/indents/allow-custom-styles', allowCustomStyles );
addFilter( 'ghostkit.blocks.registerBlockType.withCustomStyles', 'ghostkit/indents/additional-attributes', addAttribute );
addFilter( 'ghostkit.blocks.customStyles', 'ghostkit/indents/editor-custom-styles', addEditorCustomStyles );
addFilter( 'editor.BlockEdit', 'ghostkit/indents/additional-attributes', withInspectorControl );
