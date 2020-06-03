/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import checkCoreBlock from '../check-core-block';
import {
    getActiveClass, replaceClass, addClass, removeClass, hasClass,
} from '../../utils/classes-replacer';
import ResponsiveTabPanel from '../../components/responsive-tab-panel';
import getIcon from '../../utils/get-icon';
import ActiveIndicator from '../../components/active-indicator';

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

const { InspectorControls } = wp.blockEditor;

const {
    PanelBody,
    ButtonGroup,
    Button,
} = wp.components;

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
            label: 'all' === screen ? __( 'Default', '@@text_domain' ) : __( 'Inherit', '@@text_domain' ),
            value: '',
        }, {
            label: __( 'Show', '@@text_domain' ),
            value: 'block',
        }, {
            label: __( 'Hide', '@@text_domain' ),
            value: 'none',
        },
    ];
};

/**
 * Check if block Display allowed.
 *
 * @param {object} data - block data.
 * @return {boolean} allowed Display.
 */
function allowedDisplay( data ) {
    let allow = false;
    const checkSupportVar = data && data.ghostkit && data.ghostkit.supports ? data : data.name;

    if ( hasBlockSupport( checkSupportVar, 'customClassName', true ) && GHOSTKIT.hasBlockSupport( checkSupportVar, 'display', false ) ) {
        allow = true;
    }

    if ( ! allow ) {
        allow = data && data.attributes && applyFilters(
            'ghostkit.blocks.allowDisplay',
            checkCoreBlock( data.name ),
            data,
            data.name
        );
    }

    return allow;
}

/**
 * Get current display for selected screen size.
 *
 * @param {String} className - block className.
 * @param {String} screen - name of screen size.
 *
 * @returns {String} display value.
 */
function getCurrentDisplay( className, screen ) {
    if ( ! screen || 'all' === screen ) {
        if ( hasClass( className, 'ghostkit-d-none' ) ) {
            return 'none';
        }
        if ( hasClass( className, 'ghostkit-d-block' ) ) {
            return 'block';
        }
    }

    return getActiveClass( className, `ghostkit-d-${ screen }`, true );
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
        constructor( props ) {
            super( props );

            this.updateDisplay = this.updateDisplay.bind( this );
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

                if ( val ) {
                    newClassName = addClass( newClassName, `ghostkit-d-${ val }` );
                }
            }

            setAttributes( {
                className: newClassName,
            } );
        }

        render() {
            const { props } = this;
            const {
                className,
            } = props.attributes;

            const allow = allowedDisplay( props );

            if ( ! allow ) {
                return <OriginalComponent { ...props } />;
            }

            const filledTabs = {};
            if ( ghostkitVariables && ghostkitVariables.media_sizes && Object.keys( ghostkitVariables.media_sizes ).length ) {
                [
                    'all',
                    ...Object.keys( ghostkitVariables.media_sizes ),
                ].forEach( ( media ) => {
                    filledTabs[ media ] = !! getCurrentDisplay( className, media );
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
                                    <span>{ __( 'Display', '@@text_domain' ) }</span>
                                    { className && getActiveClass( className, 'ghostkit-d' ) ? (
                                        <ActiveIndicator />
                                    ) : '' }
                                </Fragment>
                            ) }
                            initialOpen={ initialOpenPanel }
                            onToggle={ () => {
                                initialOpenPanel = ! initialOpenPanel;
                            } }
                        >
                            <ResponsiveTabPanel filledTabs={ filledTabs }>
                                {
                                    ( tabData ) => (
                                        <ButtonGroup>
                                            {
                                                getDefaultDisplay( tabData.name ).map( ( val ) => {
                                                    const selected = getCurrentDisplay( className, tabData.name ) === val.value;

                                                    return (
                                                        <Button
                                                            isSecondary
                                                            isSmall
                                                            isPrimary={ selected }
                                                            aria-pressed={ selected }
                                                            onClick={ () => this.updateDisplay( tabData.name, val.value ) }
                                                            key={ `display_${ val.label }` }
                                                        >
                                                            { val.label }
                                                        </Button>
                                                    );
                                                } )
                                            }
                                        </ButtonGroup>
                                    )
                                }
                            </ResponsiveTabPanel>
                        </PanelBody>
                    </InspectorControls>
                </Fragment>
            );
        }
    }

    return GhostKitDisplayWrapper;
}, 'withInspectorControl' );

const withDataDisplay = createHigherOrderComponent( ( BlockListBlock ) => {
    class GhostKitDisplayWrapper extends Component {
        constructor( props ) {
            super( props );

            this.state = {
                allowedDisplay: allowedDisplay( this.props ),
                currentClassName: '',
                currentDisplay: '',
            };

            this.maybeRunDisplay = this.maybeRunDisplay.bind( this );
        }

        componentDidMount() {
            this.maybeRunDisplay();
        }

        componentDidUpdate() {
            this.maybeRunDisplay();
        }

        maybeRunDisplay() {
            const {
                attributes,
            } = this.props;

            const {
                className = '',
            } = attributes;

            if ( ! this.state.allowedDisplay || this.state.currentClassName === className ) {
                return;
            }

            if ( ! ghostkitVariables || ! ghostkitVariables.media_sizes ) {
                return;
            }

            let currentDisplay = '';

            [
                'all',
                ...Object.keys( ghostkitVariables.media_sizes ),
            ].forEach( ( media ) => {
                const currentVal = getCurrentDisplay( className, media );

                if ( currentVal ) {
                    currentDisplay = classnames( currentDisplay, `editor-ghostkit-d${ 'all' === media ? '' : `-${ media }` }-${ currentVal }` );
                }
            } );

            this.setState( {
                currentClassName: className,
                currentDisplay,
            } );
        }

        render() {
            const {
                className,
            } = this.props;

            if ( ! this.state.currentDisplay ) {
                return (
                    <BlockListBlock { ...this.props } />
                );
            }

            return (
                <BlockListBlock
                    { ...this.props }
                    className={ classnames( className, this.state.currentDisplay ) }
                />
            );
        }
    }

    return GhostKitDisplayWrapper;
}, 'withDataDisplay' );

// Init filters.
addFilter( 'editor.BlockEdit', 'ghostkit/display/additional-attributes', withInspectorControl );
addFilter( 'editor.BlockListBlock', 'ghostkit/display/editor/additional-attributes', withDataDisplay );
