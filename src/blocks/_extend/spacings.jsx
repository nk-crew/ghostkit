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
const { InspectorControls } = wp.editor;

const {
    PanelBody,
    TextControl,
    SelectControl,
    CheckboxControl,
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
    if ( hasBlockSupport( settings, 'ghostkitSpacings', false ) || hasBlockSupport( settings, 'ghostkitIndents', false ) ) {
        allow = true;
    }

    if ( ! allow ) {
        allow = name && /^core/.test( name );
        allow = applyFilters(
            'ghostkit.blocks.allowCustomSpacings',
            allow,
            settings,
            name
        );
        allow = applyFilters(
            'ghostkit.blocks.allowCustomIndents',
            allow,
            settings,
            name
        );
    }
    return allow;
}

/**
 * Extend ghostkit block attributes with spacings.
 *
 * @param {Object} settings Original block settings.
 * @param {String} name Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings, name ) {
    let allow = false;

    if ( hasBlockSupport( settings, 'ghostkitSpacings', false ) || hasBlockSupport( settings, 'ghostkitIndents', false ) ) {
        allow = true;
    }

    if ( ! allow ) {
        allow = name && /^core/.test( name );
        allow = applyFilters(
            'ghostkit.blocks.allowCustomSpacings',
            allow,
            settings,
            name
        );
        allow = applyFilters(
            'ghostkit.blocks.allowCustomIndents',
            allow,
            settings,
            name
        );
    }

    if ( allow ) {
        if ( ! settings.attributes.ghostkitSpacings ) {
            settings.attributes.ghostkitSpacings = {
                type: 'object',
                default: {},
            };

            // add to deprecated items.
            if ( settings.deprecated && settings.deprecated.length ) {
                settings.deprecated.forEach( ( item, i ) => {
                    if ( settings.deprecated[ i ].attributes ) {
                        settings.deprecated[ i ].attributes.ghostkitSpacings = settings.attributes.ghostkitSpacings;
                    }
                } );
            }
        }
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
 * assigning the custom spacings if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent( ( OriginalComponent ) => {
    class GhostkitSpacingsWrapper extends Component {
        constructor() {
            super( ...arguments );

            this.setState = this.setState.bind( this );
            this.state = {
                device: '',
            };

            this.updateSpacings = this.updateSpacings.bind( this );
            this.getCurrentSpacing = this.getCurrentSpacing.bind( this );
        }

        componentDidMount() {
            const {
                attributes,
                setAttributes,
            } = this.props;

            const {
                ghostkitIndents = {},
                ghostkitSpacings = {},
            } = attributes;

            // since Indents renamed to Spacings we need to migrate it.
            if ( Object.keys( ghostkitIndents ).length > 0 && Object.keys( ghostkitSpacings ).length === 0 ) {
                setAttributes( {
                    ghostkitIndents: {},
                    ghostkitSpacings: ghostkitIndents,
                } );
            }
        }

        /**
         * Update spacings object.
         *
         * @param {String} name - name of new spacing.
         * @param {String} val - value for new spacing.
         */
        updateSpacings( name, val ) {
            const { setAttributes } = this.props;
            const { device } = this.state;
            let { ghostkitSpacings = {} } = this.props.attributes;
            const result = {};
            const newSpacings = {};

            if ( device ) {
                newSpacings[ device ] = {};
                newSpacings[ device ][ name ] = val;
            } else {
                newSpacings[ name ] = val;
            }

            // add default properties to keep sorting.
            ghostkitSpacings = deepAssign( {
                media_xl: {},
                media_lg: {},
                media_md: {},
                media_sm: {},
            }, ghostkitSpacings, newSpacings );

            // validate values.
            Object.keys( ghostkitSpacings ).map( ( key ) => {
                if ( ghostkitSpacings[ key ] ) {
                    // check if device object.
                    if ( typeof ghostkitSpacings[ key ] === 'object' ) {
                        Object.keys( ghostkitSpacings[ key ] ).map( ( keyDevice ) => {
                            if ( ghostkitSpacings[ key ][ keyDevice ] ) {
                                if ( ! result[ key ] ) {
                                    result[ key ] = {};
                                }
                                result[ key ][ keyDevice ] = ghostkitSpacings[ key ][ keyDevice ];
                            }
                        } );
                    } else {
                        result[ key ] = ghostkitSpacings[ key ];
                    }
                }
            } );

            setAttributes( {
                ghostkitSpacings: result,
            } );
        }

        /**
         * Get current spacing for selected device type.
         *
         * @param {String} name - name of spacing.
         *
         * @returns {String} spacing value.
         */
        getCurrentSpacing( name ) {
            const { ghostkitSpacings = {} } = this.props.attributes;
            const { device } = this.state;
            let result = '';

            if ( ! device ) {
                if ( ghostkitSpacings[ name ] ) {
                    result = ghostkitSpacings[ name ];
                }
            } else if ( ghostkitSpacings[ device ] && ghostkitSpacings[ device ][ name ] ) {
                result = ghostkitSpacings[ device ][ name ];
            }

            return result;
        }

        render() {
            const props = this.props;
            let allow = false;

            if ( hasBlockSupport( props.name, 'ghostkitSpacings', false ) || hasBlockSupport( props.name, 'ghostkitIndents', false ) ) {
                allow = true;
            }

            if ( ! allow ) {
                allow = props.name && /^core/.test( props.name );
                allow = applyFilters(
                    'ghostkit.blocks.allowCustomSpacings',
                    allow,
                    props,
                    props.name
                );
                allow = applyFilters(
                    'ghostkit.blocks.allowCustomIndents',
                    allow,
                    props,
                    props.name
                );
            }

            if ( ! allow ) {
                return <OriginalComponent { ...props } />;
            }

            // add new spacings controls.
            return (
                <Fragment>
                    <OriginalComponent
                        { ...props }
                        { ...this.state }
                        setState={ this.setState }
                    />
                    <InspectorControls>
                        <PanelBody title={ (
                            <Fragment>
                                { __( 'Spacings' ) }
                                <span className="ghostkit-ext-badge">{ __( 'ext' ) }</span>
                            </Fragment>
                        ) } initialOpen={ false }>
                            <div className="ghostkit-control-spacing">
                                <Logo className="ghostkit-control-spacing-logo" />
                                <div className="ghostkit-control-spacing-margin">
                                    <span>{ __( 'Margin' ) }</span>
                                    <div className="ghostkit-control-spacing-margin-left">
                                        <TextControl
                                            value={ this.getCurrentSpacing( 'marginLeft' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateSpacings( 'marginLeft', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-spacing-margin-top">
                                        <TextControl
                                            value={ this.getCurrentSpacing( 'marginTop' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateSpacings( 'marginTop', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-spacing-margin-right">
                                        <TextControl
                                            value={ this.getCurrentSpacing( 'marginRight' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateSpacings( 'marginRight', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-spacing-margin-bottom">
                                        <TextControl
                                            value={ this.getCurrentSpacing( 'marginBottom' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateSpacings( 'marginBottom', nextValue ) }
                                        />
                                    </div>
                                </div>
                                <div className="ghostkit-control-spacing-padding">
                                    <span>{ __( 'Padding' ) }</span>
                                    <div className="ghostkit-control-spacing-padding-left">
                                        <TextControl
                                            value={ this.getCurrentSpacing( 'paddingLeft' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateSpacings( 'paddingLeft', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-spacing-padding-top">
                                        <TextControl
                                            value={ this.getCurrentSpacing( 'paddingTop' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateSpacings( 'paddingTop', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-spacing-padding-right">
                                        <TextControl
                                            value={ this.getCurrentSpacing( 'paddingRight' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateSpacings( 'paddingRight', nextValue ) }
                                        />
                                    </div>
                                    <div className="ghostkit-control-spacing-padding-bottom">
                                        <TextControl
                                            value={ this.getCurrentSpacing( 'paddingBottom' ) }
                                            placeholder="-"
                                            onChange={ ( nextValue ) => this.updateSpacings( 'paddingBottom', nextValue ) }
                                        />
                                    </div>
                                </div>
                                <div className="ghostkit-control-spacing-device">
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
                                <div className="ghostkit-control-spacing-important">
                                    <CheckboxControl
                                        label={ __( '!important' ) }
                                        checked={ !! this.getCurrentSpacing( '!important' ) }
                                        onChange={ ( nextValue ) => this.updateSpacings( '!important', nextValue ) }
                                    />
                                </div>
                            </div>
                        </PanelBody>
                    </InspectorControls>
                </Fragment>
            );
        }
    }

    return GhostkitSpacingsWrapper;
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
    let customSpacings = props.attributes.ghostkitSpacings && Object.keys( props.attributes.ghostkitSpacings ).length !== 0 ? deepAssign( {}, props.attributes.ghostkitSpacings ) : false;

    // prepare !important tag.
    // validate values.
    const result = {};
    Object.keys( customSpacings ).map( ( key ) => {
        if ( customSpacings[ key ] && '!important' !== key ) {
            // check if device object.
            if ( typeof customSpacings[ key ] === 'object' ) {
                Object.keys( customSpacings[ key ] ).map( ( keyDevice ) => {
                    if ( customSpacings[ key ][ keyDevice ] && '!important' !== keyDevice ) {
                        if ( ! result[ key ] ) {
                            result[ key ] = {};
                        }
                        result[ key ][ keyDevice ] = customSpacings[ key ][ keyDevice ] + ( customSpacings[ key ][ '!important' ] ? ' !important' : '' );
                    }
                } );
            } else {
                result[ key ] = customSpacings[ key ] + ( customSpacings[ '!important' ] ? ' !important' : '' );
            }
        }
    } );

    customSpacings = Object.keys( result ).length !== 0 ? result : false;

    if ( customStyles && customSpacings ) {
        customStyles = deepAssign( customStyles, customSpacings );
    }

    return customStyles;
}

// Init filters.
addFilter( 'ghostkit.blocks.registerBlockType.allowCustomStyles', 'ghostkit/spacings/allow-custom-styles', allowCustomStyles );
addFilter( 'ghostkit.blocks.registerBlockType.withCustomStyles', 'ghostkit/spacings/additional-attributes', addAttribute );
addFilter( 'ghostkit.blocks.customStyles', 'ghostkit/spacings/editor-custom-styles', addEditorCustomStyles );
addFilter( 'editor.BlockEdit', 'ghostkit/spacings/additional-attributes', withInspectorControl );
