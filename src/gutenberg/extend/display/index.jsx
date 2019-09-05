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
    hasBlockSupport,
} = wp.blocks;

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
import { getActiveClass, replaceClass, addClass, removeClass, hasClass } from '../../utils/classes-replacer';
import ResponsiveTabPanel from '../../components/responsive-tab-panel';
import getIcon from '../../utils/get-icon';

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
            const {
                attributes,
                setAttributes,
            } = this.props;

            const {
                className,
            } = attributes;

            let newClassName = className;

            if ( screen && 'all' !== screen ) {
                newClassName = replaceClass( newClassName, `ghostkit-d-${ screen }`, val );
            } else {
                newClassName = removeClass( newClassName, 'ghostkit-d-none' );
                newClassName = removeClass( newClassName, 'ghostkit-d-block' );

                if ( newClassName && val ) {
                    newClassName = addClass( newClassName, `ghostkit-d-${ val }` );
                }
            }

            setAttributes( {
                className: newClassName,
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
            const {
                attributes,
            } = this.props;

            const {
                className,
            } = attributes;

            if ( ! screen || 'all' === screen ) {
                if ( hasClass( className, 'ghostkit-d-none' ) ) {
                    return 'none';
                } else if ( hasClass( className, 'ghostkit-d-block' ) ) {
                    return 'block';
                }
            }

            return getActiveClass( className, `ghostkit-d-${ screen }`, true );
        }

        render() {
            const props = this.props;
            let allow = false;

            if ( hasBlockSupport( props.name, 'customClassName', true ) ) {
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
                                    <span className="ghostkit-ext-icon">
                                        { getIcon( 'extension-display' ) }
                                    </span>
                                    <span>{ __( 'Display' ) }</span>
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

// Init filters.
addFilter( 'editor.BlockEdit', 'ghostkit/display/additional-attributes', withInspectorControl );
