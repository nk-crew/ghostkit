/**
 * Import CSS
 */
import './editor.scss';

/**
 * WordPress dependencies
 */
const {
    Fragment,
} = wp.element;

const { __ } = wp.i18n;
const { Component } = wp.element;
const { apiFetch } = wp;

const { compose } = wp.compose;

const { PluginMoreMenuItem } = wp.editPost;
const { registerPlugin } = wp.plugins;

const {
    withSelect,
    withDispatch,
} = wp.data;

const {
    TabPanel,
    Tooltip,
    Button,
} = wp.components;

/**
 * Internal dependencies
 */
const { GHOSTKIT } = window;
import getIcon from '../../utils/get-icon';
import Modal from '../../components/modal';
import Typography from '../../components/typography';

GHOSTKIT[ 'added_fonts' ] = [];

/**
 * Variable to simplify the relationship of filter Typography properties and objects
 */
const conformityAttributes = {
    'font-family': 'fontFamily',
    'font-family-category': 'fontFamilyCategory',
    'font-size': 'fontSize',
    'font-weight': 'fontWeight',
    'line-height': 'lineHeight',
    'letter-spacing': 'letterSpacing',
};

/**
 * Check value on the existence and emptiness.
 *
 * @param {object} value - Cheching Value;
 * @return {boolean} - True or false.
 */
function isExist( value ) {
    return ( typeof value !== 'undefined' && value !== '' && value !== null && value !== false );
}

/**
 * Get Current Fonts.
 *
 * @param {object} typographyData - Typography Data.
 * @param {array} currentFonts - Previous Array With Current Fonts.
 * @return {array} currentFonts - Next Array With Current Fonts.
 */
function getCurrentFonts( typographyData, currentFonts ) {
    if ( typographyData !== false ) {
        if ( isExist( typographyData.ghostkit_typography ) ) {
            Object.keys( typographyData.ghostkit_typography ).forEach( ( typography ) => {
                if ( isExist( typography ) ) {
                    const fontFamily = typographyData.ghostkit_typography[ typography ].fontFamily;
                    const fontFamilyCategory = typographyData.ghostkit_typography[ typography ].fontFamilyCategory;
                    let fontWeight = typographyData.ghostkit_typography[ typography ].fontWeight;
                    const fontWeights = [];
                    if ( isExist( fontWeight ) ) {
                        fontWeight = fontWeight.replace( /i/g, '' );
                        if ( fontWeight !== '600' &&
                            fontWeight !== '700' &&
                            fontWeight !== '800' &&
                            fontWeight !== '900' &&
                            fontWeight !== '600i' &&
                            fontWeight !== '700i' &&
                            fontWeight !== '800i' &&
                            fontWeight !== '900i' ) {
                            fontWeights.push( fontWeight, fontWeight + 'i', '700', '700i' );
                        } else {
                            fontWeights.push( fontWeight, fontWeight + 'i' );
                        }
                    } else {
                        fontWeights.push( '400', '400i', '700', '700i' );
                    }
                    if ( isExist( fontFamily ) && isExist( fontFamilyCategory ) ) {
                        currentFonts.push( { family: fontFamilyCategory, label: fontFamily, weights: fontWeights } );
                    }
                }
            } );
        }
    }
    return currentFonts;
}

/**
 * Print WebLoad fonts.
 *
 * @param {object} typographyData - Typography Actual Data.
 */
function printFonts( typographyData ) {
    const {
        fonts,
    } = GHOSTKIT;

    let currentFonts = [];
    currentFonts = getCurrentFonts( typographyData.customTypography, currentFonts );
    currentFonts = getCurrentFonts( typographyData.meta, currentFonts );

    let uniqueFonts = currentFonts;

    const myData = uniqueFonts;

    uniqueFonts = Array.from( new Set( myData.map( JSON.stringify ) ) ).map( JSON.parse );

    const webfontList = [];

    Object.keys( uniqueFonts ).forEach( ( font ) => {
        if ( isExist( uniqueFonts[ font ].family ) ) {
            Object.keys( fonts[ uniqueFonts[ font ].family ].fonts ).forEach( ( findFont ) => {
                if ( fonts[ uniqueFonts[ font ].family ].fonts[ findFont ].name === uniqueFonts[ font ].label ) {
                    webfontList.push(
                        {
                            family: uniqueFonts[ font ].family,
                            name: uniqueFonts[ font ].label,
                            weights: uniqueFonts[ font ].weights,
                            category: fonts[ uniqueFonts[ font ].family ].fonts[ findFont ].category,
                            subsets: fonts[ uniqueFonts[ font ].family ].fonts[ findFont ].subsets,
                        }
                    );
                }
            } );
        }
    } );

    if ( isExist( webfontList ) && webfontList.length > 0 ) {
        const googleFamilies = [];
        Object.keys( webfontList ).forEach( ( key ) => {
            if ( webfontList[ key ].family === 'google-fonts' ) {
                let weights = '';
                Object.keys( webfontList[ key ].weights ).forEach( ( keyWeight ) => {
                    if ( keyWeight > 0 && keyWeight !== ( webfontList[ key ].weights.length - 1 ) ) {
                        weights = weights + ',';
                    }
                    weights = weights + webfontList[ key ].weights[ keyWeight ];
                } );
                googleFamilies.push( webfontList[ key ].name + ':' + weights );
            }
        } );
        Object.keys( GHOSTKIT[ 'added_fonts' ] ).forEach( ( key ) => {
            Object.keys( GHOSTKIT[ 'added_fonts' ][ key ] ).forEach( ( removeKey ) => {
                Object.keys( googleFamilies ).forEach( ( remove ) => {
                    if ( GHOSTKIT[ 'added_fonts' ][ key ][ removeKey ] === googleFamilies[ remove ] ) {
                        googleFamilies.splice( remove, 1 );
                    }
                } );
            } );
        } );
        GHOSTKIT[ 'added_fonts' ].push( googleFamilies );
        if ( googleFamilies.length > 0 ) {
            window.WebFont.load( {
                google: {
                    families: googleFamilies,
                },
            } );
        }
    }
}

/**
 * The function gets the current typography for generated styles.
 *
 * @param {object} typographyData - Typography Data.
 * @param {array} typographyPrepeareStyles - Previous Array With Current Styles Properties.
 * @return {*} - Next Array With Current Styles Properties.
 */
function getCurrentTypography( typographyData, typographyPrepeareStyles ) {
    if ( isExist( typographyData ) ) {
        if ( isExist( typographyData.ghostkit_typography ) ) {
            Object.keys( typographyData.ghostkit_typography ).forEach( ( key ) => {
                if ( isExist( typographyData.ghostkit_typography[ key ] ) ) {
                    Object.keys( conformityAttributes ).forEach( ( propertyKey ) => {
                        if ( isExist( typographyData.ghostkit_typography[ key ][ conformityAttributes[ propertyKey ] ] ) &&
                            typeof typographyPrepeareStyles[ key ][ 'style-properties' ][ propertyKey ] !== 'undefined' ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ propertyKey ] = typographyData.ghostkit_typography[ key ][ conformityAttributes[ propertyKey ] ];
                        }
                    } );
                }
            } );
        }
    }
    return typographyPrepeareStyles;
}

/**
 * Print Typography Styles.
 *
 * @param {object} typographyData - Typography Actual Data.
 */
function printStyles( typographyData ) {
    const {
        customTypographyList,
    } = GHOSTKIT;

    let typographyPrepeareStyles = [];
    let typographyCss = '';
    if ( isExist( customTypographyList ) ) {
        Object.keys( customTypographyList ).forEach( ( key ) => {
            if ( isExist( customTypographyList[ key ] ) ) {
                if ( isExist( customTypographyList[ key ].output ) && customTypographyList[ key ].output.length > 0 ) {
                    Object.keys( customTypographyList[ key ].output ).forEach( ( outputKey ) => {
                        if ( customTypographyList[ key ].output[ outputKey ].editor === true &&
                            isExist( customTypographyList[ key ].output[ outputKey ].selectors ) &&
                            isExist( customTypographyList[ key ].defaults ) ) {
                            typographyPrepeareStyles[ key ] = {
                                'style-properties': {
                                    ...customTypographyList[ key ].defaults,
                                },
                                output: customTypographyList[ key ].output[ outputKey ].selectors,
                            };
                        }
                    } );
                }
            }
        } );

        // Global custom Typography.
        typographyPrepeareStyles = getCurrentTypography( typographyData.customTypography, typographyPrepeareStyles );
        // Local custom Typography.
        typographyPrepeareStyles = getCurrentTypography( typographyData.meta, typographyPrepeareStyles );

        if ( isExist( typographyPrepeareStyles ) ) {
            Object.keys( typographyPrepeareStyles ).forEach( ( key ) => {
                let typographyStyles = '';
                if ( isExist( typographyPrepeareStyles[ key ] ) ) {
                    if ( isExist( typographyPrepeareStyles[ key ].output ) ) {
                        typographyStyles = typographyStyles + typographyPrepeareStyles[ key ].output + '{';
                        Object.keys( conformityAttributes ).forEach( ( propertyKey ) => {
                            if ( isExist( typographyPrepeareStyles[ key ][ 'style-properties' ][ propertyKey ] ) && propertyKey !== 'font-family-category' ) {
                                if ( propertyKey === 'font-weight' ) {
                                    let fontWeight = typographyPrepeareStyles[ key ][ 'style-properties' ][ propertyKey ];
                                    if ( fontWeight.indexOf( 'i' ) > 0 ) {
                                        fontWeight = fontWeight.replace( /i/g, '' );
                                        typographyStyles = typographyStyles + 'font-style: italic;';
                                        typographyPrepeareStyles[ key ][ 'style-properties' ][ propertyKey ] = fontWeight;
                                    } else if ( fontWeight !== '' ) {
                                        typographyStyles = typographyStyles + 'font-style: normal;';
                                    }
                                }
                                typographyStyles = typographyStyles + propertyKey + ': ' + typographyPrepeareStyles[ key ][ 'style-properties' ][ propertyKey ] + ';';
                            }
                        } );
                        typographyStyles = typographyStyles + '}';
                    }
                }
                typographyCss = typographyCss + typographyStyles;
            } );
        }
        jQuery( '#ghostkit-typography-inline-css' ).html( typographyCss );
    }
}

class TypographyModal extends Component {
    constructor() {
        super( ...arguments );
        const {
            meta = {},
        } = this.props;

        this.state = {
            customTypography: this.getCustomTypographyList( meta.ghostkit_typography, false ),

            globalCustomTypography: false,
            advanced: this.getInitialAdvancedState( this.getCustomTypographyList( meta.ghostkit_typography, false ) ),
            globalAdvanced: {},
        };

        this.maybePrepareGlobalTypographyAndAdvanced = this.maybePrepareGlobalTypographyAndAdvanced.bind( this );
    }

    /**
     * Function to get the initial state state of the children. Sets the button open flag if at least one option is set in the child
     *
     * @param {object} customTypographyList - Current typography List.
     * @return {{}} - An object with a list of states of a advanced button of child elements.
     */
    getInitialAdvancedState( customTypographyList ) {
        const advanced = {};
        Object.keys( customTypographyList ).forEach( ( typography ) => {
            if ( typeof customTypographyList[ typography ].childOf !== 'undefined' && customTypographyList[ typography ].childOf !== '' ) {
                let showAdvanced = false;
                Object.keys( conformityAttributes ).forEach( ( attribute ) => {
                    const metaTypographyAttribute = customTypographyList[ typography ][ conformityAttributes[ attribute ] ];
                    if ( typeof metaTypographyAttribute !== 'undefined' &&
                        metaTypographyAttribute !== 'default' &&
                        metaTypographyAttribute !== '' ) {
                        showAdvanced = true;
                        advanced[ customTypographyList[ typography ].childOf ] = showAdvanced;
                    }
                } );

                if ( advanced[ customTypographyList[ typography ].childOf ] !== true && showAdvanced === false ) {
                    advanced[ customTypographyList[ typography ].childOf ] = showAdvanced;
                }
            }
        } );
        return advanced;
    }

    componentDidMount() {
        this.maybePrepareGlobalTypographyAndAdvanced();
    }
    componentDidUpdate() {
        this.maybePrepareGlobalTypographyAndAdvanced();
    }

    maybePrepareGlobalTypographyAndAdvanced() {
        const {
            customTypography = {},
        } = this.props;

        if (
            customTypography &&
            false === this.state.globalCustomTypography
        ) {
            this.setState( {
                globalCustomTypography: this.getCustomTypographyList( customTypography.ghostkit_typography, true ) || '',
                globalAdvanced: this.getInitialAdvancedState( this.getCustomTypographyList( customTypography.ghostkit_typography, false ) ),
            } );
        }
    }

    /**
     * The function returns a placeholder object.
     *
     * @param {string} key - Key of current typography.
     * @param {boolean} isGlobal - Flag of global customization.
     * @return {object} - Placeholders Object.
     */
    getPlaceholders( key, isGlobal ) {
        const {
            customTypographyList,
        } = GHOSTKIT;

        const placeholders = {
            'font-size': '-',
            'line-height': '-',
            'letter-spacing': '-',
        };

        Object.keys( placeholders ).forEach( ( placeholderKey ) => {
            const defaultProperty = isExist( customTypographyList[ key ].defaults[ placeholderKey ] ) ? customTypographyList[ key ].defaults[ placeholderKey ] : placeholders[ placeholderKey ];
            if ( isGlobal ) {
                placeholders[ placeholderKey ] = defaultProperty;
            } else if ( isExist( this.state.globalCustomTypography[ key ] ) ) {
                placeholders[ placeholderKey ] = isExist( this.state.globalCustomTypography[ key ][ conformityAttributes[ placeholderKey ] ] ) ? this.state.globalCustomTypography[ key ][ conformityAttributes[ placeholderKey ] ] : defaultProperty;
            }
        } );
        return placeholders;
    }

    /**
     * The function checks and returns the default value of the state, if it exists.
     *
     * @param  {object} state - Typography State.
     * @return {string} - Default Value.
     */
    getDefaultValue( state ) {
        return ( typeof state === 'undefined' || state === '' || state === false || state === null ) ? '' : state;
    }

    /**
     * The function returns the default undefined values of options from the filter.
     *
     * @param {string} property - Property Object Key
     * @param {string} propertyName - Property Name
     * @param {object} customTypographyPropertiesList - Typography List.
     * @return {boolean} - false if customTypographyPropertiesList options not define and value if option exist.
     */
    setDefaultPropertyValues( property, propertyName, customTypographyPropertiesList ) {
        let defaultProperty = false;
        if ( this.getDefaultValue( customTypographyPropertiesList ) !== '' ) {
            if ( typeof customTypographyPropertiesList[ propertyName ] === 'undefined' ) {
                defaultProperty = undefined;
            } else if ( typeof property !== 'undefined' ) {
                defaultProperty = property;
            } else if ( typeof customTypographyPropertiesList[ propertyName ] !== 'undefined' ) {
                defaultProperty = customTypographyPropertiesList[ propertyName ] !== '' ? customTypographyPropertiesList[ propertyName ] : '';
            }
        }
        return defaultProperty;
    }

    /**
     * Function to get all default values from the database and from the typography filter.
     *
     * @param {object} setStateTypography - Current State.
     * @param {boolean} global - Flag to check current options: global or local.
     * @return {{}} - Object with default values
     */
    getCustomTypographyList( setStateTypography, global ) {
        const {
            customTypographyList,
        } = GHOSTKIT;
        const defaultTypography = {};
        if ( typeof customTypographyList !== 'undefined' && customTypographyList !== '' ) {
            Object.keys( customTypographyList ).forEach( ( key ) => {
                if ( this.getDefaultValue( setStateTypography ) !== '' && this.getDefaultValue( setStateTypography[ key ] ) !== '' ) {
                    defaultTypography[ key ] = setStateTypography[ key ];

                    Object.keys( conformityAttributes ).forEach( ( property ) => {
                        const defaultProperty = this.setDefaultPropertyValues( setStateTypography[ key ][ conformityAttributes[ property ] ], property, customTypographyList[ key ].defaults );

                        if ( defaultProperty !== false ) {
                            defaultTypography[ key ][ conformityAttributes[ property ] ] = defaultProperty;
                        }
                    } );

                    if ( typeof customTypographyList[ key ][ 'child-of' ] !== 'undefined' ) {
                        defaultTypography[ key ].childOf = customTypographyList[ key ][ 'child-of' ];
                    }
                } else if ( this.getDefaultValue( customTypographyList[ key ].defaults ) !== '' ) {
                    const fontName = this.getDefaultValue( customTypographyList[ key ].defaults[ 'font-family' ] );
                    const fontFamilyCategory = this.getDefaultValue( customTypographyList[ key ].defaults[ 'font-family-category' ] );
                    const weight = this.getDefaultValue( customTypographyList[ key ].defaults[ 'font-weight' ] );
                    const childOf = this.getDefaultValue( customTypographyList[ key ][ 'child-of' ] );

                    let fontFamily;
                    let fontWeight;
                    let lineHeight;
                    let letterSpacing;
                    let fontSize;

                    fontFamily = '';

                    if ( fontName !== '' && fontFamilyCategory !== '' && global ) {
                        fontFamily = fontName;
                    }

                    fontWeight = '';

                    if ( weight !== '' && global ) {
                        fontWeight = weight;
                    }

                    if ( typeof customTypographyList[ key ].defaults[ 'line-height' ] === 'undefined' ) {
                        lineHeight = undefined;
                    } else {
                        lineHeight = global ? customTypographyList[ key ].defaults[ 'line-height' ] : '';
                    }

                    if ( typeof customTypographyList[ key ].defaults[ 'letter-spacing' ] === 'undefined' ) {
                        letterSpacing = undefined;
                    } else {
                        letterSpacing = global ? customTypographyList[ key ].defaults[ 'letter-spacing' ] : '';
                    }

                    fontSize = '';

                    if ( typeof customTypographyList[ key ].defaults[ 'font-size' ] !== 'undefined' ) {
                        fontSize = global ? customTypographyList[ key ].defaults[ 'font-size' ] : '';
                    }

                    defaultTypography[ key ] = {
                        fontFamily: fontFamily,
                        fontFamilyCategory: this.getDefaultValue( customTypographyList[ key ].defaults[ 'font-family-category' ] ),
                        fontSize: fontSize,
                        fontWeight: fontWeight,
                        lineHeight: lineHeight,
                        letterSpacing: letterSpacing,
                        label: this.getDefaultValue( customTypographyList[ key ].label ),
                        childOf: childOf,
                    };
                }
            } );
        }
        return defaultTypography;
    }

    /**
     * Function for setting the current state with a list of child typographies and a button status flag when a button is clicked.
     *
     * @param {int} key - Typography identifier.
     * @param {boolean} isGlobal - Flag of global customization.
     */
    onClickAdvanced( key, isGlobal ) {
        if ( typeof this.state[ isGlobal ? 'globalAdvanced' : 'advanced' ] !== 'undefined' ) {
            this.setState( prevState => ( {
                [ isGlobal ? 'globalAdvanced' : 'advanced' ]: {
                    ...this.state[ isGlobal ? 'globalAdvanced' : 'advanced' ],
                    [ key ]: ! prevState[ isGlobal ? 'globalAdvanced' : 'advanced' ][ key ],
                },
            } ) );
        }
    }

    /**
     * Function to get advanced button label
     *
     * @param {int} key - Typography identifier.
     * @param {boolean} isGlobal - Flag of global customization.
     * @return {string} advancedLabel - Button Label.
     */
    getAdvancedLabel( key, isGlobal ) {
        let advancedLabel = __( 'Show Advanced' );

        if ( this.state[ isGlobal ? 'globalAdvanced' : 'advanced' ][ key ] === true ) {
            advancedLabel = __( 'Hide Advanced' );
        }
        return advancedLabel;
    }

    /**
     * Function for get Child Render Typographies.
     *
     * @param {object} typographyList - Typography List.
     * @param {int} key - Typography identifier.
     * @param {boolean} isGlobal - Flag of global customization.
     * @return {Array} - Array with child typography objects.
     */
    getChildrenTypography( typographyList, key, isGlobal ) {
        if ( this.state[ isGlobal ? 'globalAdvanced' : 'advanced' ][ key ] === true ) {
            const childTypographies = [];
            Object.keys( typographyList ).map( ( childKey ) => {
                if ( typographyList[ childKey ].childOf === key ) {
                    childTypographies.push( this.getTypographyComponent( typographyList, childKey, isGlobal ) );
                }
            } );
            return childTypographies;
        }
    }

    /**
     * Function for get Typography Component.
     *
     * @param {object} typographyList - Typography List.
     * @param {int} key - Typography identifier.
     * @param {boolean} isGlobal - Flag of global customization.
     * @return {*} - Typography Object.
     */
    getTypographyComponent( typographyList, key, isGlobal ) {
        const placeholders = this.getPlaceholders( key, isGlobal );
        return (
            <Typography
                onChange={ ( opt ) => {
                    this.setState( {
                        [ isGlobal ? 'globalCustomTypography' : 'customTypography' ]: {
                            ...typographyList,
                            [ key ]: {
                                ...typographyList[ key ],
                                ...opt,
                            },
                        },
                    } );
                } }
                fontFamily={ typographyList[ key ].fontFamily }
                fontFamilyCategory={ typographyList[ key ].fontFamilyCategory }
                fontWeight={ typographyList[ key ].fontWeight }
                fontSize={ typographyList[ key ].fontSize }
                lineHeight={ typographyList[ key ].lineHeight }
                letterSpacing={ typographyList[ key ].letterSpacing }
                label={ typographyList[ key ].label }
                placeholders={ placeholders }
                childOf={ typographyList[ key ].childOf }
            >
            </Typography>
        );
    }

    render() {
        const {
            updateMeta,
            updateCustomTypography,
            onRequestClose,
        } = this.props;

        return (
            <Modal
                className="ghostkit-plugin-typography-modal"
                position="top"
                size="md"
                title={ __( 'Typography' ) }
                onRequestClose={ () => {
                    const local = this.props.meta || {};
                    const global = this.props.customTypography || {};
                    const newLocal = {};
                    const newGlobal = {};

                    // Local
                    if ( this.state.customTypography !== local.ghostkit_typography ) {
                        newLocal.ghostkit_typography = this.state.customTypography;
                    }

                    if ( Object.keys( newLocal ).length ) {
                        updateMeta( newLocal );
                    }

                    // Global
                    if ( this.state.globalCustomTypography !== global.ghostkit_typography ) {
                        newGlobal.ghostkit_typography = this.state.globalCustomTypography;
                    }

                    if ( Object.keys( newGlobal ).length ) {
                        updateCustomTypography( newGlobal );
                    }

                    onRequestClose();
                } }
                icon={ getIcon( 'plugin-typography' ) }
            >
                <TabPanel
                    className="ghostkit-control-tabs ghostkit-component-modal-tab-panel"
                    tabs={ [
                        {
                            name: 'local',
                            title: (
                                <Tooltip text={ __( 'All changes will be applied on the current page only.' ) }>
                                    <span>
                                        { __( 'Local' ) }
                                    </span>
                                </Tooltip>
                            ),
                            className: 'ghostkit-control-tabs-tab',
                        },
                        {
                            name: 'global',
                            title: (
                                <Tooltip text={ __( 'All changes will be applied site wide.' ) }>
                                    <span>
                                        { __( 'Global' ) }
                                    </span>
                                </Tooltip>
                            ),
                            className: 'ghostkit-control-tabs-tab',
                        },
                    ] }
                >
                    {
                        ( tabData ) => {
                            const isGlobal = tabData.name === 'global';
                            const setStateTypography = ( isGlobal ? this.state.globalCustomTypography : this.state.customTypography );
                            const typographyList = this.getCustomTypographyList( setStateTypography, isGlobal );

                            return (
                                <Fragment>
                                    { Object.keys( typographyList ).map( ( key ) => {
                                        const advancedLabel = this.getAdvancedLabel( key, isGlobal );
                                        const ghostkitContainerClass = typographyList[ key ].childOf === '' ? 'ghostkit-typography-container' : 'ghostkit-typography-child-container';
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <div className={ ghostkitContainerClass }>
                                                { typographyList[ key ].childOf === '' ? (
                                                    this.getTypographyComponent( typographyList, key, isGlobal )
                                                ) : '' }
                                                { typeof this.state[ isGlobal ? 'globalAdvanced' : 'advanced' ][ key ] !== 'undefined' ? (
                                                    <div className={ 'ghostkit-typography-advanced' }>
                                                        <Button
                                                            isDefault
                                                            onClick={ () => this.onClickAdvanced( key, isGlobal ) }
                                                            className={ 'ghostkit-typography-advanced-button' }
                                                        >
                                                            { advancedLabel }
                                                        </Button>
                                                    </div>
                                                ) : '' }
                                                {
                                                    this.getChildrenTypography( typographyList, key, isGlobal )
                                                }
                                            </div>
                                        );
                                    } ) }
                                </Fragment>
                            );
                        }
                    }
                </TabPanel>
            </Modal>
        );
    }
}

const TypographyModalWithSelect = compose( [
    withSelect( ( select ) => {
        const currentMeta = select( 'core/editor' ).getCurrentPostAttribute( 'meta' );
        const editedMeta = select( 'core/editor' ).getEditedPostAttribute( 'meta' );
        const customTypography = select( 'ghostkit/plugins/typography' ).getCustomTypography();

        try {
            currentMeta.ghostkit_typography = JSON.parse( currentMeta.ghostkit_typography );
        } catch ( e ) { }
        try {
            editedMeta.ghostkit_typography = JSON.parse( editedMeta.ghostkit_typography );
        } catch ( e ) { }
        try {
            customTypography.ghostkit_typography = JSON.parse( customTypography.ghostkit_typography );
        } catch ( e ) { }

        const typographyData = {
            meta: { ...currentMeta, ...editedMeta },
            customTypography,
        };

        printFonts( typographyData );
        printStyles( typographyData );

        return typographyData;
    } ),
    withDispatch( ( dispatch ) => ( {
        updateMeta( value ) {
            const localValue = {
                ghostkit_typography: JSON.stringify( value.ghostkit_typography ),
            };

            dispatch( 'core/editor' ).editPost( { meta: localValue } );
        },
        updateCustomTypography( value ) {
            const globalValue = {
                ghostkit_typography: JSON.stringify( value.ghostkit_typography ),
            };
            dispatch( 'ghostkit/plugins/typography' ).setCustomTypography( globalValue );

            apiFetch( {
                path: '/ghostkit/v1/update_custom_typography',
                method: 'POST',
                data: {
                    data: globalValue,
                },
            } );
        },
    } ) ),
] )( TypographyModal );

export { TypographyModalWithSelect as TypographyModal };

export class TypographyPlugin extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            isModalOpen: false,
        };
    }

    render() {
        const {
            isModalOpen,
        } = this.state;

        return (
            <Fragment>
                <PluginMoreMenuItem
                    icon={ null }
                    onClick={ () => {
                        this.setState( { isModalOpen: true } );
                    } }
                >
                    { __( 'Typography' ) }
                </PluginMoreMenuItem>
                { isModalOpen ? (
                    <TypographyModalWithSelect
                        onRequestClose={ () => this.setState( { isModalOpen: false } ) }
                    />
                ) : '' }
            </Fragment>
        );
    }
}

registerPlugin( 'ghostkit-typography', {
    icon: null,
    render: TypographyPlugin,
} );
