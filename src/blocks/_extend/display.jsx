// External Dependencies.
import classnames from 'classnames/dedupe';

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
    SelectControl,
} = wp.components;

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
            label: screen === 'all' ? __( 'Default' ) : __( 'Inherit from larger' ),
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
 * Extend ghostkit block attributes with display.
 *
 * @param {Object} settings Original block settings.
 * @param {String} name Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings, name ) {
    let allow = false;

    if ( hasBlockSupport( settings, 'ghostkitDisplay', false ) ) {
        allow = true;
    }

    if ( ! allow ) {
        allow = settings && settings.attributes && applyFilters(
            'ghostkit.blocks.registerBlockType.allowCustomDisplay',
            name && /^core/.test( name ),
            settings,
            name
        );
    }

    if ( allow ) {
        if ( ! settings.attributes.ghostkitDisplay ) {
            settings.attributes.ghostkitDisplay = {
                type: 'object',
                default: {},
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
    class GhostkitDisplayWrapper extends Component {
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
            const newDisplay = {};
            newDisplay[ screen ] = val;

            setAttributes( {
                ghostkitDisplay: Object.assign( {}, ghostkitDisplay, newDisplay ),
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

            if ( hasBlockSupport( props.name, 'ghostkitDisplay', false ) ) {
                allow = true;
            }

            if ( ! allow ) {
                allow = applyFilters(
                    'ghostkit.blocks.allowCustomDisplay',
                    props.name && /^core/.test( props.name ),
                    props,
                    props.name
                );
            }

            if ( ! allow ) {
                return <OriginalComponent { ...props } />;
            }

            // add new display controls.
            return (
                <Fragment>
                    <OriginalComponent
                        { ...props }
                        setState={ this.setState }
                    />
                    <InspectorControls>
                        <PanelBody title={ (
                            <Fragment>
                                { __( 'Display' ) }
                                <span className="ghostkit-ext-badge">{ __( 'ext' ) }</span>
                            </Fragment>
                        ) } initialOpen={ false }>
                            <div className="ghostkit-control-display">
                                <div className="ghostkit-control-display-box">
                                    <div className="ghostkit-control-display-icon" />
                                    <SelectControl
                                        value={ this.getCurrentDisplay( 'all' ) }
                                        onChange={ ( nextValue ) => this.updateDisplay( 'all', nextValue ) }
                                        options={ getDefaultDisplay( 'all' ) }
                                    />
                                </div>

                                <div className="ghostkit-control-display-box">
                                    <div className="ghostkit-control-display-icon">
                                        <span className="fas fa-desktop" />
                                    </div>
                                    <SelectControl
                                        value={ this.getCurrentDisplay( 'xl' ) }
                                        onChange={ ( nextValue ) => this.updateDisplay( 'xl', nextValue ) }
                                        options={ getDefaultDisplay() }
                                    />
                                </div>

                                <div className="ghostkit-control-display-box">
                                    <div className="ghostkit-control-display-icon">
                                        <span className="fas fa-laptop" />
                                    </div>
                                    <SelectControl
                                        value={ this.getCurrentDisplay( 'lg' ) }
                                        onChange={ ( nextValue ) => this.updateDisplay( 'lg', nextValue ) }
                                        options={ getDefaultDisplay() }
                                    />
                                </div>

                                <div className="ghostkit-control-display-box">
                                    <div className="ghostkit-control-display-icon">
                                        <span className="fas fa-tablet-alt" />
                                    </div>
                                    <SelectControl
                                        value={ this.getCurrentDisplay( 'md' ) }
                                        onChange={ ( nextValue ) => this.updateDisplay( 'md', nextValue ) }
                                        options={ getDefaultDisplay() }
                                    />
                                </div>

                                <div className="ghostkit-control-display-box">
                                    <div className="ghostkit-control-display-icon">
                                        <span className="fas fa-mobile-alt" />
                                    </div>
                                    <SelectControl
                                        value={ this.getCurrentDisplay( 'sm' ) }
                                        onChange={ ( nextValue ) => this.updateDisplay( 'sm', nextValue ) }
                                        options={ getDefaultDisplay() }
                                    />
                                </div>
                            </div>
                        </PanelBody>
                    </InspectorControls>
                </Fragment>
            );
        }
    }

    return GhostkitDisplayWrapper;
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
