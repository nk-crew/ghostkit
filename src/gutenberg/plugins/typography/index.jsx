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
        if ( typographyData.customTypography.ghostkit_typography !== undefined && typographyData.customTypography.ghostkit_typography !== '' && typographyData.customTypography.ghostkit_typography !== null ) {
            Object.keys( typographyData.customTypography.ghostkit_typography ).forEach( ( typography ) => {
                if ( typography !== undefined && typography !== '' ) {
                    const fontFamily = typographyData.customTypography.ghostkit_typography[ typography ].fontFamily;
                    const fontFamilyCategory = typographyData.customTypography.ghostkit_typography[ typography ].fontFamilyCategory;
                    if ( fontFamily !== undefined && fontFamily !== '' && fontFamilyCategory !== undefined && fontFamilyCategory !== '' ) {
                        currentFonts.push( { family: fontFamilyCategory, label: fontFamily.label } );
                    }
                }
            } );
        }
    }
    if ( typographyData.meta !== false ) {
        if ( typographyData.meta.ghostkit_typography !== undefined && typographyData.meta.ghostkit_typography !== '' ) {
            Object.keys( typographyData.meta.ghostkit_typography ).forEach( ( typography ) => {
                if ( typography !== undefined && typography !== '' ) {
                    const fontFamily = typographyData.meta.ghostkit_typography[ typography ].fontFamily;
                    const fontFamilyCategory = typographyData.meta.ghostkit_typography[ typography ].fontFamilyCategory;
                    if ( fontFamily !== undefined && fontFamily !== '' && fontFamilyCategory !== undefined && fontFamilyCategory !== '' ) {
                        currentFonts.push( { family: fontFamilyCategory, label: fontFamily.label } );
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
        if ( uniqueFonts[ font ].family !== undefined && uniqueFonts[ font ].family !== '' ) {
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

    if ( webfontList !== undefined && webfontList !== [] && webfontList.length > 0 ) {
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
            // eslint-disable-next-line no-undef
            WebFont.load( {
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
    if ( customTypographyList !== undefined && customTypographyList !== [] && customTypographyList !== '' ) {
        for ( const key in customTypographyList ) {
            if ( customTypographyList[ key ] !== undefined && customTypographyList[ key ] !== '' && customTypographyList[ key ] !== [] ) {
                if ( customTypographyList[ key ].output !== undefined && customTypographyList[ key ].output !== '' && customTypographyList[ key ].output !== [] && customTypographyList[ key ].output.length > 0 ) {
                    for ( const outputKey in customTypographyList[ key ].output ) {
                        if ( customTypographyList[ key ].output[ outputKey ].editor === true &&
                            customTypographyList[ key ].output[ outputKey ].selectors !== '' &&
                            customTypographyList[ key ].output[ outputKey ].selectors !== undefined &&
                            customTypographyList[ key ].defaults !== undefined &&
                            customTypographyList[ key ].defaults !== '' ) {
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
        if ( typographyData !== undefined && typographyData !== [] && typographyData !== '' ) {
            if ( typographyData.ghostkit_typography !== undefined && typographyData.ghostkit_typography !== [] && typographyData.ghostkit_typography !== '' ) {
                for ( const key in typographyData.ghostkit_typography ) {
                    if ( typographyData.ghostkit_typography[ key ] !== undefined &&
                        typographyData.ghostkit_typography[ key ] !== '' ) {
                        if ( typographyData.ghostkit_typography[ key ].fontFamily !== undefined &&
                            typographyData.ghostkit_typography[ key ].fontFamily !== '' &&
                            typographyData.ghostkit_typography[ key ].fontFamily !== {} &&
                            typographyData.ghostkit_typography[ key ].fontFamilyCategory !== '' &&
                            typographyData.ghostkit_typography[ key ].fontFamilyCategory !== undefined ) {
                            if ( typographyData.ghostkit_typography[ key ].fontFamily.label !== undefined &&
                                typographyData.ghostkit_typography[ key ].fontFamily.label !== '' &&
                                typographyData.ghostkit_typography[ key ].fontFamily.value !== undefined &&
                                typographyData.ghostkit_typography[ key ].fontFamily.value !== '' ) {
                                typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family-category' ] = typographyData.ghostkit_typography[ key ].fontFamilyCategory;
                                typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family' ] = typographyData.ghostkit_typography[ key ].fontFamily.label;
                            }
                        }
                        if ( typographyData.ghostkit_typography[ key ].fontSize !== undefined &&
                            typographyData.ghostkit_typography[ key ].fontSize !== '' &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] !== '' ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] = typographyData.ghostkit_typography[ key ].fontSize;
                        }
                        if ( typographyData.ghostkit_typography[ key ].fontWeight !== undefined &&
                            typographyData.ghostkit_typography[ key ].fontWeight !== '' &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] !== '' ) {
                            if ( typographyData.ghostkit_typography[ key ].fontWeight.value !== undefined &&
                                typographyData.ghostkit_typography[ key ].fontWeight.value !== '' ) {
                                typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] = typographyData.ghostkit_typography[ key ].fontWeight.value;
                            }
                        }
                        if ( typographyData.ghostkit_typography[ key ].lineHeight !== undefined &&
                            typographyData.ghostkit_typography[ key ].lineHeight !== '' &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] !== '' ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] = typographyData.ghostkit_typography[ key ].lineHeight;
                        }
                        if ( typographyData.ghostkit_typography[ key ].letterSpacing !== undefined &&
                            typographyData.ghostkit_typography[ key ].letterSpacing !== '' &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] !== '' ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] = typographyData.ghostkit_typography[ key ].letterSpacing;
                        }
                    }
                }
            }
        }

        // Local custom Typography.
        if ( typographyData !== undefined && typographyData !== [] && typographyData !== '' ) {
            if ( typographyData.meta.ghostkit_typography !== undefined && typographyData.meta.ghostkit_typography !== [] && typographyData.meta.ghostkit_typography !== '' ) {
                for ( const key in typographyData.meta.ghostkit_typography ) {
                    if ( typographyData.meta.ghostkit_typography[ key ] !== undefined &&
                        typographyData.meta.ghostkit_typography[ key ] !== '' ) {
                        if ( typographyData.meta.ghostkit_typography[ key ].fontFamily !== undefined &&
                            typographyData.meta.ghostkit_typography[ key ].fontFamily !== '' &&
                            typographyData.meta.ghostkit_typography[ key ].fontFamily !== {} &&
                            typographyData.meta.ghostkit_typography[ key ].fontFamilyCategory !== '' &&
                            typographyData.meta.ghostkit_typography[ key ].fontFamilyCategory !== undefined ) {
                            if ( typographyData.meta.ghostkit_typography[ key ].fontFamily.label !== undefined &&
                                typographyData.meta.ghostkit_typography[ key ].fontFamily.label !== '' &&
                                typographyData.meta.ghostkit_typography[ key ].fontFamily.value !== undefined &&
                                typographyData.meta.ghostkit_typography[ key ].fontFamily.value !== '' ) {
                                typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family-category' ] = typographyData.meta.ghostkit_typography[ key ].fontFamilyCategory;
                                typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family' ] = typographyData.meta.ghostkit_typography[ key ].fontFamily.label;
                            }
                        }
                        if ( typographyData.meta.ghostkit_typography[ key ].fontSize !== undefined &&
                            typographyData.meta.ghostkit_typography[ key ].fontSize !== '' &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] !== '' ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] = typographyData.meta.ghostkit_typography[ key ].fontSize;
                        }
                        if ( typographyData.meta.ghostkit_typography[ key ].fontWeight !== undefined &&
                            typographyData.meta.ghostkit_typography[ key ].fontWeight !== '' &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] !== '' ) {
                            if ( typographyData.meta.ghostkit_typography[ key ].fontWeight.value !== undefined &&
                                typographyData.meta.ghostkit_typography[ key ].fontWeight.value !== '' ) {
                                typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] = typographyData.meta.ghostkit_typography[ key ].fontWeight.value;
                            }
                        }
                        if ( typographyData.meta.ghostkit_typography[ key ].lineHeight !== undefined &&
                            typographyData.meta.ghostkit_typography[ key ].lineHeight !== '' &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] !== '' ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] = typographyData.meta.ghostkit_typography[ key ].lineHeight;
                        }
                        if ( typographyData.meta.ghostkit_typography[ key ].letterSpacing !== undefined &&
                            typographyData.meta.ghostkit_typography[ key ].letterSpacing !== '' &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] !== '' ) {
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] = typographyData.meta.ghostkit_typography[ key ].letterSpacing;
                        }
                    }
                }
            }
        }
        if ( typographyPrepeareStyles !== undefined &&
            typographyPrepeareStyles !== '' ) {
            for ( const key in typographyPrepeareStyles ) {
                let typographyStyles = '';
                if ( typographyPrepeareStyles[ key ] !== undefined &&
                    typographyPrepeareStyles[ key ] !== '' ) {
                    if ( ( typographyPrepeareStyles[ key ].output !== undefined &&
                        typographyPrepeareStyles[ key ].output !== '' ) ) {
                        typographyStyles = typographyStyles + typographyPrepeareStyles[ key ].output + '{';
                        if ( typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family' ] !== '' ) {
                            typographyStyles = typographyStyles + 'font-family: ' + typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-family' ] + ';';
                        }
                        if ( typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] !== '' ) {
                            typographyStyles = typographyStyles + 'font-size: ' + typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-size' ] + ';';
                        }
                        if ( typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ] !== '' ) {
                            let fontWeight = typographyPrepeareStyles[ key ][ 'style-properties' ][ 'font-weight' ];
                            if ( fontWeight.indexOf( 'i' ) > 0 ) {
                                fontWeight = fontWeight.replace( /i/g, '' );
                                typographyStyles = typographyStyles + 'font-style: italic;';
                            }
                            typographyStyles = typographyStyles + 'font-weight: ' + fontWeight + ';';
                        }
                        if ( typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] !== '' ) {
                            typographyStyles = typographyStyles + 'line-height: ' + typographyPrepeareStyles[ key ][ 'style-properties' ][ 'line-height' ] + ';';
                        }
                        if ( typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] !== undefined &&
                            typographyPrepeareStyles[ key ][ 'style-properties' ][ 'letter-spacing' ] !== '' ) {
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

    checkStateObject( global, state ) {
        return (
            ( global ? state.globalCustomTypography : state.customTypography ) === undefined ||
            ( global ? state.globalCustomTypography : state.customTypography ) === '' ||
            ( global ? state.globalCustomTypography : state.customTypography ) === false
        );
    }
    getDefaultValue( state ) {
        const value = ( state === undefined || state === '' || state === false || state === null ) ? '' : state;
        return value;
    }
    setDefaultPropertyValues( property, propertyName, customTypographyPropertiesList, global ) {
        let defaultProperty = false;

        if ( this.getDefaultValue( property ) === '' && this.getDefaultValue( customTypographyPropertiesList ) !== '' ) {
            if ( customTypographyPropertiesList[ propertyName ] !== undefined ) {
                defaultProperty = global ? customTypographyPropertiesList[ propertyName ] : '';
            } else {
                defaultProperty = undefined;
            }
        } else if ( this.getDefaultValue( property ) !== '' && this.getDefaultValue( customTypographyPropertiesList ) !== '' ) {
            if ( customTypographyPropertiesList[ propertyName ] === undefined ) {
                defaultProperty = undefined;
            }
        }

        return defaultProperty;
    }
    getCustomTypographyList( setStateTypography, global ) {
        const {
            customTypographyList,
        } = GHOSTKIT;
        const defaultTypography = {};
        if ( customTypographyList !== undefined && customTypographyList !== '' ) {
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

                    fontFamily = { value: '', label: __( 'Default Site Font' ), family: 'default' };

                    if ( fontName !== '' && fontFamilyCategory !== '' && global ) {
                        fontFamily = { value: fontFamilyCategory + '/' + fontName, label: fontName };
                    }

                    fontWeight = { value: '', label: '' };

                    if ( weight !== '' && global ) {
                        fontWeight = { value: weight, label: weight };
                    }

                    if ( customTypographyList[ key ].defaults[ 'line-height' ] === undefined ) {
                        lineHeight = undefined;
                    } else {
                        lineHeight = global ? customTypographyList[ key ].defaults[ 'line-height' ] : '';
                    }

                    if ( customTypographyList[ key ].defaults[ 'letter-spacing' ] === undefined ) {
                        letterSpacing = undefined;
                    } else {
                        letterSpacing = global ? customTypographyList[ key ].defaults[ 'letter-spacing' ] : '';
                    }

                    defaultTypography[ key ] = {
                        fontFamily: fontFamily,
                        fontFamilyCategory: this.getDefaultValue( customTypographyList[ key ].defaults[ 'font-family-category' ] ),
                        fontSize: global ? this.getDefaultValue( customTypographyList[ key ].defaults[ 'font-size' ] ) : '',
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
                            const CustomTypographyList = this.getCustomTypographyList( setStateTypography, isGlobal );

                            return (
                                <Fragment>
                                    { Object.keys( CustomTypographyList ).map( ( key ) => {
                                        // eslint-disable-next-line react/jsx-key
                                        return <Typography
                                            onChange={ ( opt ) => {
                                                this.setState( {
                                                    [ isGlobal ? 'globalCustomTypography' : 'customTypography' ]: {
                                                        ...CustomTypographyList,
                                                        [ key ]: opt,
                                                    },
                                                } );
                                            } }
                                            fontFamily={ CustomTypographyList[ key ].fontFamily }
                                            fontFamilyCategory={ CustomTypographyList[ key ].fontFamilyCategory }
                                            fontWeight={ CustomTypographyList[ key ].fontWeight }
                                            fontSize={ CustomTypographyList[ key ].fontSize }
                                            lineHeight={ CustomTypographyList[ key ].lineHeight }
                                            letterSpacing={ CustomTypographyList[ key ].letterSpacing }
                                            label={ CustomTypographyList[ key ].label }
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

