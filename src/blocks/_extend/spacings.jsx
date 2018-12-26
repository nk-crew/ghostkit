// External Dependencies.
import deepAssign from 'deep-assign';

// Internal Dependencies.
import Logo from '../_icons/ghostkit.svg';

import InputDrag from '../_components/input-drag.jsx';

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
    BaseControl,
    PanelBody,
    CheckboxControl,
    TabPanel,
} = wp.components;

let initialOpenPanel = false;

/**
 * Add support for core blocks.
 *
 * @param {String} name - block name.
 *
 * @return {Boolean} block supported.
 */
function addCoreBlocksSupport( name ) {
    return name && /^core/.test( name ) && ! /^core\/block$/.test( name );
}

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
        allow = addCoreBlocksSupport( name );
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
        allow = addCoreBlocksSupport( name );
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
                default: '',
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
                default: '',
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
         * @param {String} device - spacing for device.
         */
        updateSpacings( name, val, device ) {
            const { setAttributes } = this.props;
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
                ghostkitSpacings: Object.keys( result ).length ? result : '',
            } );
        }

        /**
         * Get current spacing for selected device type.
         *
         * @param {String} name - name of spacing.
         * @param {String} device - spacing for device.
         *
         * @returns {String} spacing value.
         */
        getCurrentSpacing( name, device ) {
            const { ghostkitSpacings = {} } = this.props.attributes;
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
                allow = addCoreBlocksSupport( props.name );
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
                        <PanelBody
                            title={ (
                                <Fragment>
                                    { __( 'Spacings' ) }
                                    <span className="ghostkit-ext-badge">{ __( 'ext' ) }</span>
                                </Fragment>
                            ) }
                            initialOpen={ initialOpenPanel }
                            onToggle={ () => {
                                initialOpenPanel = ! initialOpenPanel;
                            } }
                        >
                            <TabPanel
                                className="ghostkit-control-tabs ghostkit-control-tabs-spacings"
                                tabs={ [
                                    {
                                        name: 'all',
                                        title: <span className="fas fa-tv" />,
                                        className: 'ghostkit-control-tabs-tab',
                                    },
                                    {
                                        name: 'xl',
                                        title: <span className="fas fa-desktop" />,
                                        className: 'ghostkit-control-tabs-tab',
                                    },
                                    {
                                        name: 'lg',
                                        title: <span className="fas fa-laptop" />,
                                        className: 'ghostkit-control-tabs-tab',
                                    },
                                    {
                                        name: 'md',
                                        title: <span className="fas fa-tablet-alt" />,
                                        className: 'ghostkit-control-tabs-tab',
                                    },
                                    {
                                        name: 'sm',
                                        title: <span className="fas fa-mobile-alt" />,
                                        className: 'ghostkit-control-tabs-tab',
                                    },
                                ] }>
                                {
                                    ( tabData ) => {
                                        let device = '';

                                        if ( tabData.name !== 'all' ) {
                                            device = `media_${ tabData.name }`;
                                        }

                                        let note = __( 'Will be applied to all devices' );

                                        switch ( tabData.name ) {
                                        case 'xl':
                                            note = __( 'Will be applied to devices with screen width <= 1200px' );
                                            break;
                                        case 'lg':
                                            note = __( 'Will be applied to devices with screen width <= 992px' );
                                            break;
                                        case 'md':
                                            note = __( 'Will be applied to devices with screen width <= 768px' );
                                            break;
                                        case 'sm':
                                            note = __( 'Will be applied to devices with screen width <= 576px' );
                                            break;
                                        }

                                        return (
                                            <Fragment>
                                                <BaseControl className="ghostkit-control-spacing">
                                                    <Logo className="ghostkit-control-spacing-logo" />
                                                    <div className="ghostkit-control-spacing-margin">
                                                        <span>{ __( 'Margin' ) }</span>
                                                        <div className="ghostkit-control-spacing-margin-left">
                                                            <InputDrag
                                                                value={ this.getCurrentSpacing( 'marginLeft', device ) }
                                                                placeholder="-"
                                                                onChange={ ( nextValue ) => this.updateSpacings( 'marginLeft', nextValue, device ) }
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                        <div className="ghostkit-control-spacing-margin-top">
                                                            <InputDrag
                                                                value={ this.getCurrentSpacing( 'marginTop', device ) }
                                                                placeholder="-"
                                                                onChange={ ( nextValue ) => this.updateSpacings( 'marginTop', nextValue, device ) }
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                        <div className="ghostkit-control-spacing-margin-right">
                                                            <InputDrag
                                                                value={ this.getCurrentSpacing( 'marginRight', device ) }
                                                                placeholder="-"
                                                                onChange={ ( nextValue ) => this.updateSpacings( 'marginRight', nextValue, device ) }
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                        <div className="ghostkit-control-spacing-margin-bottom">
                                                            <InputDrag
                                                                value={ this.getCurrentSpacing( 'marginBottom', device ) }
                                                                placeholder="-"
                                                                onChange={ ( nextValue ) => this.updateSpacings( 'marginBottom', nextValue, device ) }
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="ghostkit-control-spacing-padding">
                                                        <span>{ __( 'Padding' ) }</span>
                                                        <div className="ghostkit-control-spacing-padding-left">
                                                            <InputDrag
                                                                value={ this.getCurrentSpacing( 'paddingLeft', device ) }
                                                                placeholder="-"
                                                                onChange={ ( nextValue ) => this.updateSpacings( 'paddingLeft', nextValue, device ) }
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                        <div className="ghostkit-control-spacing-padding-top">
                                                            <InputDrag
                                                                value={ this.getCurrentSpacing( 'paddingTop', device ) }
                                                                placeholder="-"
                                                                onChange={ ( nextValue ) => this.updateSpacings( 'paddingTop', nextValue, device ) }
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                        <div className="ghostkit-control-spacing-padding-right">
                                                            <InputDrag
                                                                value={ this.getCurrentSpacing( 'paddingRight', device ) }
                                                                placeholder="-"
                                                                onChange={ ( nextValue ) => this.updateSpacings( 'paddingRight', nextValue, device ) }
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                        <div className="ghostkit-control-spacing-padding-bottom">
                                                            <InputDrag
                                                                value={ this.getCurrentSpacing( 'paddingBottom', device ) }
                                                                placeholder="-"
                                                                onChange={ ( nextValue ) => this.updateSpacings( 'paddingBottom', nextValue, device ) }
                                                                autocomplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="ghostkit-control-spacing-important">
                                                        <CheckboxControl
                                                            label={ __( '!important' ) }
                                                            checked={ !! this.getCurrentSpacing( '!important', device ) }
                                                            onChange={ ( nextValue ) => this.updateSpacings( '!important', nextValue, device ) }
                                                        />
                                                    </div>
                                                </BaseControl>
                                                <p><em>{ note }</em></p>
                                            </Fragment>
                                        );
                                    }
                                }
                            </TabPanel>
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
