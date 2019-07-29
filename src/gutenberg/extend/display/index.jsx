/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
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

const { InspectorControls } = wp.editor;

const {
    PanelBody,
    BaseControl,
    ButtonGroup,
    Button,
} = wp.components;

/**
 * Internal dependencies
 */
import ResponsiveTabPanel from '../../components/responsive-tab-panel';

const {
    GHOSTKIT,
    ghostkitVariables,
} = window;

let initialOpenPanel = false;

/**
 * Get array for Select element.
 *
 * @param {String} screen - screen size
 *
 * @returns {Array} array for Select.
 */
const getDefaultDisplay = function( screen = '' ) {
    return [
        {
            label: screen === 'all' ? __( 'Default' ) : __( 'Inherit' ),
            value: '',
        }, {
            label: __( 'Show' ),
            value: 'block',
        }, {
            label: __( 'Hide' ),
            value: 'none',
        },
    ];
};

/**
 * Add support for core blocks.
 *
 * @param {String} name - block name.
 *
 * @return {Boolean} block supported.
 */
function addCoreBlocksSupport( name ) {
    return name && /^core/.test( name ) && ! /^core\/block$/.test( name ) && ! /^core\/archives/.test( name );
}

/**
 * Extend ghostkit block attributes with display.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings ) {
    let allow = false;

    if ( GHOSTKIT.hasBlockSupport( settings, 'display', false ) ) {
        allow = true;
    }

    if ( ! allow ) {
        allow = settings && settings.attributes && applyFilters(
            'ghostkit.blocks.allowDisplay',
            addCoreBlocksSupport( settings.name ),
            settings,
            settings.name
        );
    }

    if ( allow ) {
        if ( ! settings.attributes.ghostkitDisplay ) {
            settings.attributes.ghostkitDisplay = {
                type: 'object',
                default: '',
            };

            // add to deprecated items.
            if ( settings.deprecated && settings.deprecated.length ) {
                settings.deprecated.forEach( ( item, i ) => {
                    if ( settings.deprecated[ i ].attributes ) {
                        settings.deprecated[ i ].attributes.ghostkitDisplay = settings.attributes.ghostkitDisplay;
                    }
                } );
            }
        }
    }
    return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom display if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent( ( OriginalComponent ) => {
    class GhostKitDisplayWrapper extends Component {
        constructor() {
            super( ...arguments );

            this.updateDisplay = this.updateDisplay.bind( this );
            this.getCurrentDisplay = this.getCurrentDisplay.bind( this );
        }

        /**
         * Update display object.
         *
         * @param {String} screen - name of screen size.
         * @param {String} val - value for new display.
         */
        updateDisplay( screen, val ) {
            const { setAttributes } = this.props;
            const { ghostkitDisplay = {} } = this.props.attributes;
            let newDisplay = Object.assign( {}, ghostkitDisplay );

            if ( ! val ) {
                if ( newDisplay[ screen ] ) {
                    delete newDisplay[ screen ];

                    if ( ! Object.keys( newDisplay ).length ) {
                        newDisplay = '';
                    }
                }
            } else {
                newDisplay[ screen ] = val;
            }

            setAttributes( {
                ghostkitDisplay: newDisplay,
            } );
        }

        /**
         * Get current display for selected screen size.
         *
         * @param {String} screen - name of screen size.
         *
         * @returns {String} display value.
         */
        getCurrentDisplay( screen ) {
            const { ghostkitDisplay = {} } = this.props.attributes;
            let result = '';

            if ( ghostkitDisplay[ screen ] ) {
                result = ghostkitDisplay[ screen ];
            }

            return result;
        }

        render() {
            const props = this.props;
            let allow = false;

            if ( GHOSTKIT.hasBlockSupport( props.name, 'display', false ) ) {
                allow = true;
            }

            if ( ! allow ) {
                allow = applyFilters(
                    'ghostkit.blocks.allowDisplay',
                    addCoreBlocksSupport( props.name ),
                    props,
                    props.name
                );
            }

            if ( ! allow ) {
                return <OriginalComponent { ...props } />;
            }

            const iconsColor = {};
            if ( ghostkitVariables && ghostkitVariables.media_sizes && Object.keys( ghostkitVariables.media_sizes ).length ) {
                Object.keys( ghostkitVariables.media_sizes ).forEach( ( media ) => {
                    if ( ! this.getCurrentDisplay( media ) ) {
                        iconsColor[ media ] = '#cccccc';
                    }
                } );
            }

            // add new display controls.
            return (
                <Fragment>
                    <OriginalComponent
                        { ...props }
                        setState={ this.setState }
                    />
                    <InspectorControls>
                        <PanelBody
                            title={ (
                                <Fragment>
                                    { __( 'Display' ) }
                                    <span className="ghostkit-ext-badge">{ __( 'ext' ) }</span>
                                </Fragment>
                            ) }
                            initialOpen={ initialOpenPanel }
                            onToggle={ () => {
                                initialOpenPanel = ! initialOpenPanel;
                            } }
                        >
                            <ResponsiveTabPanel iconsColor={ iconsColor }>
                                {
                                    ( tabData ) => {
                                        return (
                                            <ButtonGroup>
                                                {
                                                    getDefaultDisplay( tabData.name ).map( ( val ) => {
                                                        const selected = this.getCurrentDisplay( tabData.name ) === val.value;

                                                        return (
                                                            <Button
                                                                isLarge
                                                                isPrimary={ selected }
                                                                aria-pressed={ selected }
                                                                onClick={ () => this.updateDisplay( tabData.name, val.value ) }
                                                                key={ `gap_${ val.label }` }
                                                            >
                                                                { val.label }
                                                            </Button>
                                                        );
                                                    } )
                                                }
                                            </ButtonGroup>
                                        );
                                    }
                                }
                            </ResponsiveTabPanel>
                            <BaseControl help={ __( 'Display settings will only take effect once you are on the preview or live page, and not while you\'re in editing mode.' ) } />
                        </PanelBody>
                    </InspectorControls>
                </Fragment>
            );
        }
    }

    return GhostKitDisplayWrapper;
}, 'withInspectorControl' );

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
    const display = attributes.ghostkitDisplay ? Object.assign( {}, attributes.ghostkitDisplay ) : false;

    if ( display ) {
        Object.keys( display ).map( ( key ) => {
            if ( display[ key ] ) {
                const $prefix = key === 'all' ? '' : `-${ key }`;
                extraProps.className = classnames( extraProps.className, `ghostkit-d${ $prefix }-${ display[ key ] }` );
            }
        } );
    }

    return extraProps;
}

// Init filters.
addFilter( 'blocks.registerBlockType', 'ghostkit/display/additional-attributes', addAttribute );
addFilter( 'editor.BlockEdit', 'ghostkit/display/additional-attributes', withInspectorControl );
addFilter( 'blocks.getSaveContent.extraProps', 'ghostkit/display/save-props', addSaveProps );
