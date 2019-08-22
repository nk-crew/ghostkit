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
} = wp.components;

/**
 * Internal dependencies
 */
const { GHOSTKIT } = window;
import getIcon from '../../utils/get-icon';
import Modal from '../../components/modal';
import Typography from '../../components/typography';

/**
 * Check value on the existence and emptiness.
 *
 * @param {object} value - Cheching Value;
 * @return {boolean} - True or false.
 */
function isExist( value ) {
    return ( typeof value !== undefined && value !== '' && value !== null );
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

    const currentFonts = [];
    if ( typographyData.customTypography !== false ) {
        if ( isExist( typographyData.customTypography.ghostkit_typography ) ) {
            Object.keys( typographyData.customTypography.ghostkit_typography ).forEach( ( typography ) => {
                if ( isExist( typography ) ) {
                    const fontFamily = typographyData.customTypography.ghostkit_typography[ typography ].fontFamily;
                    const fontFamilyCategory = typographyData.customTypography.ghostkit_typography[ typography ].fontFamilyCategory;
                    if ( isExist( fontFamily ) && isExist( fontFamilyCategory ) ) {
                        currentFonts.push( { family: fontFamilyCategory, label: fontFamily } );
                    }
                }
            } );
        }
    }
    if ( typographyData.meta !== false ) {
        if ( isExist( typographyData.meta.ghostkit_typography ) ) {
            Object.keys( typographyData.meta.ghostkit_typography ).forEach( ( typography ) => {
                if ( isExist( typography ) ) {
                    const fontFamily = typographyData.meta.ghostkit_typography[ typography ].fontFamily;
                    const fontFamilyCategory = typographyData.meta.ghostkit_typography[ typography ].fontFamilyCategory;
                    if ( isExist( fontFamily ) && isExist( fontFamilyCategory ) ) {
                        currentFonts.push( { family: fontFamilyCategory, label: fontFamily } );
                    }
                }
            } );
        }
    }

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
                            widths: fonts[ uniqueFonts[ font ].family ].fonts[ findFont ].widths,
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
        /*
        jQuery( 'link[rel="stylesheet"]' ).each( function() {
            const googleApisLink = jQuery( this ).attr( 'href' );
            for ( const removeKey in webfontList ) {
                if ( googleApisLink.indexOf( webfontList[ removeKey ].name.replace( / /g, '+' ) ) > 0 ) {
                    delete webfontList[ removeKey ];
                }
            }
        } );
*/
        for ( const key in webfontList ) {
            if ( webfontList[ key ].family === 'google-fonts' ) {
                let weights = '';
                for ( const keyWeight in webfontList[ key ].widths ) {
                    if ( keyWeight > 0 && keyWeight !== ( webfontList[ key ].widths.length - 1 ) ) {
                        weights = weights + ',';
                    }
                    weights = weights + webfontList[ key ].widths[ keyWeight ];
                }
                googleFamilies.push( webfontList[ key ].name + ':' + weights );
            }
        }

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
 * Print Typography Styles.
 *
 * @param {object} typographyData - Typography Actual Data.
 */
function printStyles( typographyData ) {
    const {
        customTypographyList,
    } = GHOSTKIT;
    const typographyPrepeareStyles = [];
    let typographyCss = '';
    if ( isExist( customTypographyList ) ) {
        for ( const key in customTypographyList ) {
            if ( isExist( customTypographyList[ key ] ) ) {
                if ( isExist( customTypographyList[ key ].output ) && customTypographyList[ key ].output.length > 0 ) {
                    for ( const outputKey in customTypographyList[ key ].output ) {
                        if ( customTypographyList[ key ].output[ outputKey ].editor === true &&
                            isExist( customTypographyList[ key ].output[ outputKey ].selectors ) &&
                            isExist( customTypographyList[ key ].defaults ) ) {
                            typographyPrepeareStyles[ key ] = {
                                'style-properties': customTypographyList[ key ].defaults,
                                output: customTypographyList[ key ].output[ outputKey ].selectors,
                            };
                        }
                    }
                }
            }
        }

        // Global custom Typography.
        if ( isExist( typographyData ) ) {
            if ( isExist( typographyData.ghostkit_typography ) ) {
                for ( const key in typographyData.ghostkit_typography ) {
                    if ( isExist( typographyData.ghostkit_typography[ key ] ) ) {
                        if ( isExist( typographyData.ghostkit_typography[ key ].fontFamily ) &&
                            isExist( typographyData.ghostkit_typography[ key ].fontFamilyCategory ) ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family-category' ] = typographyData.ghostkit_typography[ key ].fontFamilyCategory;
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family' ] = typographyData.ghostkit_typography[ key ].fontFamily === 'Default Site Font' ? '' : typographyData.ghostkit_typography[ key ].fontFamily;
                        }
                        if ( isExist( typographyData.ghostkit_typography[ key ].fontSize ) &&
                            typeof typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] !== undefined ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] = typographyData.ghostkit_typography[ key ].fontSize;
                        }
                        if ( isExist( typographyData.ghostkit_typography[ key ].fontWeight ) &&
                            typeof typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] !== undefined ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] = typographyData.ghostkit_typography[ key ].fontWeight;
                        }
                        if ( isExist( typographyData.ghostkit_typography[ key ].lineHeight ) &&
                            typeof typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] !== undefined ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] = typographyData.ghostkit_typography[ key ].lineHeight;
                        }
                        if ( isExist( typographyData.ghostkit_typography[ key ].letterSpacing ) &&
                            typeof typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] !== undefined ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] = typographyData.ghostkit_typography[ key ].letterSpacing;
                        }
                    }
                }
            }
        }

        // Local custom Typography.
        if ( isExist( typographyData ) ) {
            if ( isExist( typographyData.meta.ghostkit_typography ) ) {
                for ( const key in typographyData.meta.ghostkit_typography ) {
                    if ( isExist( typographyData.meta.ghostkit_typography[ key ] ) ) {
                        if ( isExist( typographyData.meta.ghostkit_typography[ key ].fontFamily ) &&
                            isExist( typographyData.meta.ghostkit_typography[ key ].fontFamilyCategory ) ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family-category' ] = typographyData.meta.ghostkit_typography[ key ].fontFamilyCategory;
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family' ] = typographyData.meta.ghostkit_typography[ key ].fontFamily === 'Default Site Font' ? '' : typographyData.meta.ghostkit_typography[ key ].fontFamily;
                        }
                        if ( isExist( typographyData.meta.ghostkit_typography[ key ].fontSize ) &&
                            typeof typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] !== undefined ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] = typographyData.meta.ghostkit_typography[ key ].fontSize;
                        }
                        if ( isExist( typographyData.meta.ghostkit_typography[ key ].fontWeight ) &&
                            typeof typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] !== undefined ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] = typographyData.meta.ghostkit_typography[ key ].fontWeight;
                        }
                        if ( isExist( typographyData.meta.ghostkit_typography[ key ].lineHeight ) &&
                            typeof typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] !== undefined ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] = typographyData.meta.ghostkit_typography[ key ].lineHeight;
                        }
                        if ( isExist( typographyData.meta.ghostkit_typography[ key ].letterSpacing ) &&
                            typeof typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] !== undefined ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] = typographyData.meta.ghostkit_typography[ key ].letterSpacing;
                        }
                    }
                }
            }
        }
        if ( isExist( typographyPrepeareStyles ) ) {
            for ( const key in typographyPrepeareStyles ) {
                let typographyStyles = '';
                if ( isExist( typographyPrepeareStyles[ key ] ) ) {
                    if ( isExist( typographyPrepeareStyles[ key ].output ) ) {
                        typographyStyles = typographyStyles + typographyPrepeareStyles[ key ].output + '{';
                        if ( isExist( typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family' ] ) ) {
                            typographyStyles = typographyStyles + 'font-family: ' + typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family' ] + ';';
                        }
                        if ( isExist( typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] ) ) {
                            typographyStyles = typographyStyles + 'font-size: ' + typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] + ';';
                        }
                        if ( isExist( typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] ) ) {
                            let fontWeight = typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ];
                            if ( fontWeight.indexOf( 'i' ) > 0 ) {
                                fontWeight = fontWeight.replace( /i/g, '' );
                                typographyStyles = typographyStyles + 'font-style: italic;';
                            }
                            typographyStyles = typographyStyles + 'font-weight: ' + fontWeight + ';';
                        }
                        if ( isExist( typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] ) ) {
                            typographyStyles = typographyStyles + 'line-height: ' + typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] + ';';
                        }
                        if ( isExist( typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] ) ) {
                            typographyStyles = typographyStyles + 'letter-spacing: ' + typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] + ';';
                        }
                        typographyStyles = typographyStyles + '}';
                    }
                }
                typographyCss = typographyCss + typographyStyles;
            }
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
        };

        this.maybePrepareGlobalTypography = this.maybePrepareGlobalTypography.bind( this );
    }

    componentDidMount() {
        this.maybePrepareGlobalTypography();
    }
    componentDidUpdate() {
        this.maybePrepareGlobalTypography();
    }

    maybePrepareGlobalTypography() {
        const {
            customTypography = {},
        } = this.props;

        if (
            customTypography &&
            false === this.state.globalCustomTypography
        ) {
            this.setState( {
                globalCustomTypography: this.getCustomTypographyList( customTypography.ghostkit_typography, true ) || '',
            } );
        }
    }

    getDefaultValue( state ) {
        const value = ( typeof state === undefined || state === '' || state === false || state === null ) ? '' : state;
        return value;
    }
    setDefaultPropertyValues( property, propertyName, customTypographyPropertiesList, global ) {
        let defaultProperty = false;

        if ( this.getDefaultValue( property ) === '' && this.getDefaultValue( customTypographyPropertiesList ) !== '' ) {
            if ( typeof customTypographyPropertiesList[ propertyName ] !== undefined ) {
                defaultProperty = global ? customTypographyPropertiesList[ propertyName ] : '';
            } else {
                defaultProperty = undefined;
            }
        } else if ( this.getDefaultValue( property ) !== '' && this.getDefaultValue( customTypographyPropertiesList ) !== '' ) {
            if ( typeof customTypographyPropertiesList[ propertyName ] === undefined ) {
                defaultProperty = undefined;
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
        if ( typeof customTypographyList !== undefined && customTypographyList !== '' ) {
            for ( const key in customTypographyList ) {
                if ( this.getDefaultValue( setStateTypography ) !== '' && this.getDefaultValue( setStateTypography[ key ] ) !== '' ) {
                    defaultTypography[ key ] = setStateTypography[ key ];

                    let defaultProperty = this.setDefaultPropertyValues( setStateTypography[ key ].lineHeight, 'line-height', customTypographyList[ key ].defaults, global );

                    if ( defaultProperty !== false ) {
                        defaultTypography[ key ].lineHeight = defaultProperty;
                    }

                    defaultProperty = this.setDefaultPropertyValues( setStateTypography[ key ].letterSpacing, 'letter-spacing', customTypographyList[ key ].defaults, global );

                    if ( defaultProperty !== false ) {
                        defaultTypography[ key ].letterSpacing = defaultProperty;
                    }
                } else if ( this.getDefaultValue( customTypographyList[ key ].defaults ) !== '' ) {
                    const fontName = this.getDefaultValue( customTypographyList[ key ].defaults[ 'font-family' ] );
                    const fontFamilyCategory = this.getDefaultValue( customTypographyList[ key ].defaults[ 'font-family-category' ] );
                    const weight = this.getDefaultValue( customTypographyList[ key ].defaults[ 'font-weight' ] );

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

                    if ( typeof customTypographyList[ key ].defaults[ 'line-height' ] === undefined ) {
                        lineHeight = undefined;
                    } else {
                        lineHeight = global ? customTypographyList[ key ].defaults[ 'line-height' ] : '';
                    }

                    if ( typeof customTypographyList[ key ].defaults[ 'letter-spacing' ] === undefined ) {
                        letterSpacing = undefined;
                    } else {
                        letterSpacing = global ? customTypographyList[ key ].defaults[ 'letter-spacing' ] : '';
                    }

                    fontSize = '';

                    if ( typeof customTypographyList[ key ].defaults[ 'font-size' ] !== undefined ) {
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
                    };
                }
            }
        }

        return defaultTypography;
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
                            const customTypographyList = this.getCustomTypographyList( setStateTypography, isGlobal );

                            return (
                                <Fragment>
                                    { Object.keys( customTypographyList ).map( ( key ) => {
                                        // eslint-disable-next-line react/jsx-key
                                        return <Typography
                                            onChange={ ( opt ) => {
                                                this.setState( {
                                                    [ isGlobal ? 'globalCustomTypography' : 'customTypography' ]: {
                                                        ...customTypographyList,
                                                        [ key ]: {
                                                            ...customTypographyList[ key ],
                                                            ...opt,
                                                        },
                                                    },
                                                } );
                                            } }
                                            fontFamily={ customTypographyList[ key ].fontFamily }
                                            fontFamilyCategory={ customTypographyList[ key ].fontFamilyCategory }
                                            fontWeight={ customTypographyList[ key ].fontWeight }
                                            fontSize={ customTypographyList[ key ].fontSize }
                                            lineHeight={ customTypographyList[ key ].lineHeight }
                                            letterSpacing={ customTypographyList[ key ].letterSpacing }
                                            label={ customTypographyList[ key ].label }
                                        >
                                        </Typography>;
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

