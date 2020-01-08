/**
 * Import CSS
 */
import './editor.scss';
import './style.scss';

/**
 * External dependencies
 */
import deepAssign from 'deep-assign';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    addFilter,
} = wp.hooks;

const {
    Component,
    Fragment,
} = wp.element;

const {
    createHigherOrderComponent,
} = wp.compose;

const { InspectorControls } = wp.blockEditor;

const {
    BaseControl,
    PanelBody,
    Button,
    ButtonGroup,
    TabPanel,
    Tooltip,
} = wp.components;

const {
    GHOSTKIT,
    ghostkitVariables,
} = window;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import InputDrag from '../../components/input-drag';
import ColorPicker from '../../components/color-picker';
import ResponsiveTabPanel from '../../components/responsive-tab-panel';
import ActiveIndicator from '../../components/active-indicator';
import {
    hasClass,
    removeClass,
    addClass,
} from '../../utils/classes-replacer';

let initialOpenPanel = false;

// Check supported blocks.
function checkSupportedBlock( name ) {
    if ( GHOSTKIT.hasBlockSupport( name, 'frame', false ) ) {
        return true;
    }

    return (
        name &&
        /^core\/group/.test( name.name || name )
    );
}

/**
 * Frame Component.
 */
class FrameComponent extends Component {
    constructor() {
        super( ...arguments );

        this.updateFrame = this.updateFrame.bind( this );
        this.getCurrentFrame = this.getCurrentFrame.bind( this );
    }

    /**
     * Update frame settings object.
     *
     * @param {Object} data - new attributes object.
     * @param {String} device - frame setting for device.
     */
    updateFrame( data, device ) {
        const { setAttributes } = this.props;
        let {
            ghostkitFrame = {},
        } = this.props.attributes;
        const {
            className = '',
        } = this.props.attributes;
        const result = {};
        const newFrame = {};

        Object.keys( data ).forEach( ( name ) => {
            if ( device ) {
                if ( ! newFrame[ device ] ) {
                    newFrame[ device ] = {};
                }
                newFrame[ device ][ name ] = data[ name ];
            } else {
                newFrame[ name ] = data[ name ];
            }
        } );

        // add default properties to keep sorting.
        ghostkitFrame = deepAssign( {
            media_xl: {},
            media_lg: {},
            media_md: {},
            media_sm: {},
        }, ghostkitFrame, newFrame );

        // validate values.
        Object.keys( ghostkitFrame ).map( ( key ) => {
            if ( ghostkitFrame[ key ] ) {
                // check if device object.
                if ( typeof ghostkitFrame[ key ] === 'object' ) {
                    Object.keys( ghostkitFrame[ key ] ).map( ( keyDevice ) => {
                        if ( ghostkitFrame[ key ][ keyDevice ] ) {
                            if ( ! result[ key ] ) {
                                result[ key ] = {};
                            }
                            result[ key ][ keyDevice ] = ghostkitFrame[ key ][ keyDevice ];
                        }
                    } );
                } else {
                    result[ key ] = ghostkitFrame[ key ];
                }
            }
        } );

        const hasFrameAttrs = Object.keys( result ).length;
        const resultAttrs = {
            ghostkitFrame: hasFrameAttrs ? result : '',
        };

        // additional classname for blocks with frame styles.
        if ( hasFrameAttrs && ! hasClass( className, 'ghostkit-has-frame' ) ) {
            resultAttrs.className = addClass( className, 'ghostkit-has-frame' );
        } else if ( ! hasFrameAttrs && hasClass( className, 'ghostkit-has-frame' ) ) {
            resultAttrs.className = removeClass( className, 'ghostkit-has-frame' );
        }

        setAttributes( resultAttrs );
    }

    /**
     * Get current frame setting for selected device type.
     *
     * @param {String} name - name of frame setting.
     * @param {String} device - frame setting for device.
     *
     * @returns {String} frame setting value.
     */
    getCurrentFrame( name, device ) {
        const { ghostkitFrame = {} } = this.props.attributes;
        let result = '';

        if ( ! device ) {
            if ( ghostkitFrame[ name ] ) {
                result = ghostkitFrame[ name ];
            }
        } else if ( ghostkitFrame[ device ] && ghostkitFrame[ device ][ name ] ) {
            result = ghostkitFrame[ device ][ name ];
        }

        return result;
    }

    render() {
        const props = this.props;
        const allow = checkSupportedBlock( props.name );

        const {
            ghostkitFrame,
        } = props.attributes;

        if ( ! allow ) {
            return '';
        }

        const filledTabs = {};
        const allFrame = [
            'borderStyle',
            'borderWidth',
            'borderColor',
            'boxShadowColor',
            'boxShadowX',
            'boxShadowY',
            'boxShadowBlur',
            'boxShadowSpread',
            'borderTopLeftRadius',
            'borderTopRightRadius',
            'borderBottomRightRadius',
            'borderBottomLeftRadius',
            'hoverBorderStyle',
            'hoverBorderWidth',
            'hoverBorderColor',
            'hoverBoxShadowX',
            'hoverBoxShadowY',
            'hoverBoxShadowBlur',
            'hoverBoxShadowSpread',
            'hoverBorderTopLeftRadius',
            'hoverBorderTopRightRadius',
            'hoverBorderBottomRightRadius',
            'hoverBorderBottomLeftRadius',
        ];
        if ( ghostkitVariables && ghostkitVariables.media_sizes && Object.keys( ghostkitVariables.media_sizes ).length ) {
            [
                'all',
                ...Object.keys( ghostkitVariables.media_sizes ),
            ].forEach( ( media ) => {
                filledTabs[ media ] = false;
                allFrame.forEach( ( spacing ) => {
                    if ( this.getCurrentFrame( spacing, media !== 'all' ? `media_${ media }` : '' ) ) {
                        filledTabs[ media ] = true;
                    }
                } );
            } );
        }

        const stateTabs = [
            {
                name: 'normal',
                title: __( 'Normal', '@@text_domain' ),
                className: 'ghostkit-control-tabs-tab',
            },
            {
                name: 'hover',
                title: __( 'Hover', '@@text_domain' ),
                className: 'ghostkit-control-tabs-tab',
            },
        ];

        const borderStyles = {
            solid: __( 'Solid', '@@text_domain' ),
            dashed: __( 'Dashed', '@@text_domain' ),
            dotted: __( 'Dotted', '@@text_domain' ),
            double: __( 'Double', '@@text_domain' ),
            none: __( 'None', '@@text_domain' ),
        };

        // add new frame controls.
        return (
            <InspectorControls>
                <PanelBody
                    title={ (
                        <Fragment>
                            <span className="ghostkit-ext-icon">
                                { getIcon( 'extension-frame' ) }
                            </span>
                            <span>{ __( 'Frame', '@@text_domain' ) }</span>
                            { ghostkitFrame && Object.keys( ghostkitFrame ).length ? (
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
                            ( tabData ) => {
                                let device = '';

                                if ( tabData.name !== 'all' ) {
                                    device = `media_${ tabData.name }`;
                                }

                                return (
                                    <TabPanel
                                        className="ghostkit-control-tabs ghostkit-control-tabs-wide ghostkit-extension-frame-tabs"
                                        tabs={ stateTabs }
                                    >
                                        {
                                            ( stateTabData ) => {
                                                const isHover = stateTabData.name === 'hover';
                                                const borderPropName = `${ isHover ? 'hoverBorder' : 'border' }`;
                                                const shadowPropName = `${ isHover ? 'hoverBoxShadow' : 'boxShadow' }`;
                                                const borderStyle = this.getCurrentFrame( `${ borderPropName }Style`, device );

                                                return (
                                                    <Fragment>
                                                        <BaseControl
                                                            label={ __( 'Border', '@@text_domain' ) }
                                                        >
                                                            <ButtonGroup className="ghostkit-control-border-style">
                                                                {
                                                                    Object.keys( borderStyles ).map( ( key ) => {
                                                                        const currentStyleName = 'none' === key ? '' : key;

                                                                        return (
                                                                            <Tooltip
                                                                                key={ key }
                                                                                text={ borderStyles[ key ] }
                                                                            >
                                                                                <Button
                                                                                    isDefault
                                                                                    isPrimary={ currentStyleName === borderStyle }
                                                                                    aria-pressed={ currentStyleName === borderStyle }
                                                                                    onClick={ () => {
                                                                                        if ( 'none' === key ) {
                                                                                            this.updateFrame( {
                                                                                                [ `${ borderPropName }Style` ]: '',
                                                                                                [ `${ borderPropName }Color` ]: '',
                                                                                                [ `${ borderPropName }Width` ]: '',
                                                                                            }, device );
                                                                                        } else {
                                                                                            this.updateFrame( {
                                                                                                [ `${ borderPropName }Style` ]: 'none' === key ? '' : key,
                                                                                            }, device );
                                                                                        }
                                                                                    } }
                                                                                    className={ `ghostkit-control-border-style-item-${ key }` }
                                                                                >
                                                                                    <span className="ghostkit-control-border-style-item-inner" />
                                                                                </Button>
                                                                            </Tooltip>
                                                                        );
                                                                    } )
                                                                }
                                                            </ButtonGroup>
                                                            { borderStyle ? (
                                                                <div className="ghostkit-control-border-additional">
                                                                    <Tooltip
                                                                        text={ __( 'Border Color', '@@text_domain' ) }
                                                                    >
                                                                        <div>
                                                                            <ColorPicker
                                                                                value={ this.getCurrentFrame( `${ borderPropName }Color`, device ) }
                                                                                onChange={ ( val ) => this.updateFrame( {
                                                                                    [ `${ borderPropName }Color` ]: val,
                                                                                }, device ) }
                                                                                alpha={ true }
                                                                            />
                                                                        </div>
                                                                    </Tooltip>
                                                                    <Tooltip
                                                                        text={ __( 'Border Size', '@@text_domain' ) }
                                                                    >
                                                                        <div>
                                                                            <InputDrag
                                                                                value={ this.getCurrentFrame( `${ borderPropName }Width`, device ) }
                                                                                placeholder={ __( 'Border Size', '@@text_domain' ) }
                                                                                onChange={ ( val ) => this.updateFrame( {
                                                                                    [ `${ borderPropName }Width` ]: val,
                                                                                }, device ) }
                                                                                startDistance={ 1 }
                                                                                autoComplete="off"
                                                                            />
                                                                        </div>
                                                                    </Tooltip>
                                                                </div>
                                                            ) : '' }
                                                        </BaseControl>
                                                        <BaseControl
                                                            label={ __( 'Shadow', '@@text_domain' ) }
                                                        >
                                                            <div className="ghostkit-control-box-shadow">
                                                                <Tooltip
                                                                    text={ __( 'Color', '@@text_domain' ) }
                                                                >
                                                                    <div>
                                                                        <ColorPicker
                                                                            value={ this.getCurrentFrame( `${ shadowPropName }Color`, device ) }
                                                                            onChange={ ( val ) => this.updateFrame( {
                                                                                [ `${ shadowPropName }Color` ]: val,
                                                                            }, device ) }
                                                                            alpha={ true }
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    text={ __( 'X', '@@text_domain' ) }
                                                                >
                                                                    <div>
                                                                        <InputDrag
                                                                            value={ this.getCurrentFrame( `${ shadowPropName }X`, device ) }
                                                                            placeholder={ __( 'X', '@@text_domain' ) }
                                                                            onChange={ ( val ) => this.updateFrame( {
                                                                                [ `${ shadowPropName }X` ]: val,
                                                                            }, device ) }
                                                                            startDistance={ 1 }
                                                                            autoComplete="off"
                                                                            className="ghostkit-control-box-shadow-x"
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    text={ __( 'Y', '@@text_domain' ) }
                                                                >
                                                                    <div>
                                                                        <InputDrag
                                                                            value={ this.getCurrentFrame( `${ shadowPropName }Y`, device ) }
                                                                            placeholder={ __( 'Y', '@@text_domain' ) }
                                                                            onChange={ ( val ) => this.updateFrame( {
                                                                                [ `${ shadowPropName }Y` ]: val,
                                                                            }, device ) }
                                                                            startDistance={ 1 }
                                                                            autoComplete="off"
                                                                            className="ghostkit-control-box-shadow-y"
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    text={ __( 'Blur', '@@text_domain' ) }
                                                                >
                                                                    <div>
                                                                        <InputDrag
                                                                            value={ this.getCurrentFrame( `${ shadowPropName }Blur`, device ) }
                                                                            placeholder={ __( 'Blur', '@@text_domain' ) }
                                                                            onChange={ ( val ) => this.updateFrame( {
                                                                                [ `${ shadowPropName }Blur` ]: val,
                                                                            }, device ) }
                                                                            startDistance={ 1 }
                                                                            autoComplete="off"
                                                                            className="ghostkit-control-box-shadow-blur"
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    text={ __( 'Spread', '@@text_domain' ) }
                                                                >
                                                                    <div>
                                                                        <InputDrag
                                                                            value={ this.getCurrentFrame( `${ shadowPropName }Spread`, device ) }
                                                                            placeholder={ __( 'Spread', '@@text_domain' ) }
                                                                            onChange={ ( val ) => this.updateFrame( {
                                                                                [ `${ shadowPropName }Spread` ]: val,
                                                                            }, device ) }
                                                                            startDistance={ 1 }
                                                                            autoComplete="off"
                                                                            className="ghostkit-control-box-shadow-spread"
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                            </div>
                                                        </BaseControl>
                                                        <BaseControl
                                                            label={ __( 'Corner Radius', '@@text_domain' ) }
                                                        >
                                                            <div className="ghostkit-control-radius">
                                                                <Tooltip
                                                                    text={ __( 'Top Left', '@@text_domain' ) }
                                                                >
                                                                    <div>
                                                                        <InputDrag
                                                                            value={ this.getCurrentFrame( `${ borderPropName }TopLeftRadius`, device ) }
                                                                            placeholder="-"
                                                                            onChange={ ( val ) => this.updateFrame( {
                                                                                [ `${ borderPropName }TopLeftRadius` ]: val,
                                                                            }, device ) }
                                                                            autoComplete="off"
                                                                            className="ghostkit-control-radius-tl"
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    text={ __( 'Top Right', '@@text_domain' ) }
                                                                >
                                                                    <div>
                                                                        <InputDrag
                                                                            value={ this.getCurrentFrame( `${ borderPropName }TopRightRadius`, device ) }
                                                                            placeholder="-"
                                                                            onChange={ ( val ) => this.updateFrame( {
                                                                                [ `${ borderPropName }TopRightRadius` ]: val,
                                                                            }, device ) }
                                                                            autoComplete="off"
                                                                            className="ghostkit-control-radius-tr"
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    text={ __( 'Bottom Right', '@@text_domain' ) }
                                                                >
                                                                    <div>
                                                                        <InputDrag
                                                                            value={ this.getCurrentFrame( `${ borderPropName }BottomRightRadius`, device ) }
                                                                            placeholder="-"
                                                                            onChange={ ( val ) => this.updateFrame( {
                                                                                [ `${ borderPropName }BottomRightRadius` ]: val,
                                                                            }, device ) }
                                                                            autoComplete="off"
                                                                            className="ghostkit-control-radius-br"
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    text={ __( 'Bottom Left', '@@text_domain' ) }
                                                                >
                                                                    <div>
                                                                        <InputDrag
                                                                            value={ this.getCurrentFrame( `${ borderPropName }BottomLeftRadius`, device ) }
                                                                            placeholder="-"
                                                                            onChange={ ( val ) => this.updateFrame( {
                                                                                [ `${ borderPropName }BottomLeftRadius` ]: val,
                                                                            }, device ) }
                                                                            autoComplete="off"
                                                                            className="ghostkit-control-radius-bl"
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                            </div>
                                                        </BaseControl>
                                                    </Fragment>
                                                );
                                            }
                                        }
                                    </TabPanel>
                                );
                            }
                        }
                    </ResponsiveTabPanel>
                </PanelBody>
            </InspectorControls>
        );
    }
}

/**
 * Allow custom styles in blocks.
 *
 * @param {Boolean} allow Original block allow custom styles.
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function allowCustomStyles( allow, settings ) {
    if ( ! allow ) {
        allow = checkSupportedBlock( settings );
    }
    return allow;
}

/**
 * Extend ghostkit block attributes with frame settings.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings ) {
    const allow = checkSupportedBlock( settings );

    if ( allow ) {
        if ( ! settings.attributes.ghostkitFrame ) {
            settings.attributes.ghostkitFrame = {
                type: 'object',
                default: '',
            };

            // add to deprecated items.
            if ( settings.deprecated && settings.deprecated.length ) {
                settings.deprecated.forEach( ( item, i ) => {
                    if ( settings.deprecated[ i ].attributes ) {
                        settings.deprecated[ i ].attributes.ghostkitFrame = settings.attributes.ghostkitFrame;
                    }
                } );
            }
        }
    }
    return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom frame settings if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent( ( BlockEdit ) => {
    return function( props ) {
        return (
            <Fragment>
                <BlockEdit { ...props } />
                <FrameComponent { ...props } />
            </Fragment>
        );
    };
}, 'withInspectorControl' );

/**
 * Add `px` suffix to number string.
 *
 * @param {String} str string.
 *
 * @return {String} string with pixels.
 */
function addPixelsToString( str ) {
    // add pixels.
    if ( typeof str === 'string' && str !== '0' && /^[0-9.\-]*$/.test( str ) ) {
        str += 'px';
    }

    return str;
}

/**
 * Prepare attributes for shadow.
 *
 * @param {Object} attrs frame attributes.
 *
 * @return {Object} updated attributes.
 */
function prepareShadow( attrs ) {
    // check if device object.
    Object.keys( attrs ).map( ( key ) => {
        if ( attrs[ key ] && typeof attrs[ key ] === 'object' ) {
            attrs[ key ] = prepareShadow( attrs[ key ] );
        }
    } );

    // prepare new style.
    if ( attrs.boxShadowColor ) {
        attrs.boxShadow = `${ attrs.boxShadowColor } ${ addPixelsToString( attrs.boxShadowX || '0' ) } ${ addPixelsToString( attrs.boxShadowY || '0' ) } ${ addPixelsToString( attrs.boxShadowBlur || '0' ) } ${ addPixelsToString( attrs.boxShadowSpread || '0' ) }`;
    }
    if ( attrs.hoverBoxShadowColor ) {
        attrs.hoverBoxShadow = `${ attrs.hoverBoxShadowColor } ${ addPixelsToString( attrs.hoverBoxShadowX || '0' ) } ${ addPixelsToString( attrs.hoverBoxShadowY || '0' ) } ${ addPixelsToString( attrs.hoverBoxShadowBlur || '0' ) } ${ addPixelsToString( attrs.hoverBoxShadowSpread || '0' ) }`;
    }

    // remove unused attributes.
    const shadowAttrs = [
        'boxShadowColor',
        'boxShadowX',
        'boxShadowY',
        'boxShadowBlur',
        'boxShadowSpread',
        'hoverBoxShadowColor',
        'hoverBoxShadowX',
        'hoverBoxShadowY',
        'hoverBoxShadowBlur',
        'hoverBoxShadowSpread',
    ];
    shadowAttrs.forEach( ( shadowAttr ) => {
        if ( typeof attrs[ shadowAttr ] !== 'undefined' ) {
            delete attrs[ shadowAttr ];
        }
    } );

    return attrs;
}

/**
 * Prepare styles for frame.
 *
 * @param {String} key prop name.
 * @param {String} val prop val.
 *
 * @return {Object|String} result styles.
 */
function prepareStyle( key, val ) {
    // Hover styles
    if ( /^hover/g.test( key ) ) {
        key = key.replace( /^hover/g, '' );
        key = key.charAt( 0 ).toLowerCase() + key.slice( 1 );

        return {
            '&:hover': {
                [ key ]: val,
            },
        };
    }

    return {
        [ key ]: val,
    };
}

/**
 * Add custom styles to element in editor.
 *
 * @param {Object} customStyles Additional element styles object.
 * @param {Object} props Element props.
 *
 * @return {Object} Additional element styles object.
 */
function addEditorCustomStyles( customStyles, props ) {
    let customFrame = props.attributes.ghostkitFrame && Object.keys( props.attributes.ghostkitFrame ).length !== 0 ? deepAssign( {}, props.attributes.ghostkitFrame ) : false;

    // prepare shadow.
    customFrame = prepareShadow( customFrame );

    // validate values.
    let result = {};
    Object.keys( customFrame ).map( ( key ) => {
        if ( customFrame[ key ] ) {
            // check if device object.
            if ( typeof customFrame[ key ] === 'object' ) {
                Object.keys( customFrame[ key ] ).map( ( keyDevice ) => {
                    if ( customFrame[ key ][ keyDevice ] ) {
                        result = deepAssign(
                            result,
                            {
                                [ key ]: prepareStyle( keyDevice, customFrame[ key ][ keyDevice ] ),
                            }
                        );
                    }
                } );
            } else {
                result = deepAssign(
                    result,
                    prepareStyle( key, customFrame[ key ] )
                );
            }
        }
    } );

    customFrame = Object.keys( result ).length !== 0 ? result : false;

    if ( customStyles && customFrame ) {
        customStyles = deepAssign( customStyles, customFrame );
    }

    return customStyles;
}

// Init filters.
addFilter( 'ghostkit.blocks.allowCustomStyles', 'ghostkit/frame/allow-custom-styles', allowCustomStyles );
addFilter( 'ghostkit.blocks.withCustomStyles', 'ghostkit/frame/additional-attributes', addAttribute );
addFilter( 'ghostkit.blocks.customStyles', 'ghostkit/frame/editor-custom-styles', addEditorCustomStyles );
addFilter( 'editor.BlockEdit', 'ghostkit/frame/additional-attributes', withInspectorControl );
