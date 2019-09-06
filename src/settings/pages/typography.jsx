/**
 * Import CSS
 */
import './typography.scss';

/**
 * External dependencies
 */
import { Component, Fragment } from 'react';
import { debounce } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
const { apiFetch } = wp;

const { __ } = wp.i18n;

const { compose } = wp.compose;

const {
    withSelect,
    withDispatch,
} = wp.data;

const {
    Button,
    Spinner,
} = wp.components;

/**
 * Internal dependencies
 */
import Typography from '../../gutenberg/components/typography';
import { getCustomTypographyList, getInitialAdvancedState } from '../../gutenberg/plugins/typography';

const { GHOSTKIT } = window;

class TypographySettings extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            settings: GHOSTKIT.settings || {},
            customTypography: false,
            advanced: {},
        };

        this.maybePrepareTypographyData = this.maybePrepareTypographyData.bind( this );
        this.updateTypography = this.updateTypography.bind( this );
        this.updateTypographyDebounce = debounce( 1000, this.updateTypographyDebounce.bind( this ) );
    }

    componentDidMount() {
        this.maybePrepareTypographyData();
    }
    componentDidUpdate() {
        this.maybePrepareTypographyData();
    }

    maybePrepareTypographyData() {
        const {
            customTypography = {},
        } = this.props;

        if (
            customTypography &&
            false === this.state.customTypography
        ) {
            this.setState( {
                customTypography: getCustomTypographyList( customTypography.ghostkit_typography, true ) || '',
                advanced: getInitialAdvancedState( getCustomTypographyList( customTypography.ghostkit_typography, true ) ),
            } );
        }
    }

    updateTypography( opt, typographyList, key ) {
        this.setState( {
            customTypography: {
                ...typographyList,
                [ key ]: {
                    ...typographyList[ key ],
                    ...opt,
                },
            },
        }, () => {
            this.updateTypographyDebounce();
        } );
    }

    updateTypographyDebounce() {
        this.props.updateTypography( {
            ghostkit_typography: this.state.customTypography,
        } );
    }

    /**
     * The function returns a placeholder object.
     *
     * @param {string} key - Key of current typography.
     * @param {boolean} isGlobal - Flag of global customization.
     * @return {object} - Placeholders Object.
     */
    getPlaceholders() {
        const placeholders = {
            'font-size': '-',
            'line-height': '-',
            'letter-spacing': '-',
        };

        return placeholders;
    }

    /**
     * Function for setting the current state with a list of child typographies and a button status flag when a button is clicked.
     *
     * @param {int} key - Typography identifier.
     */
    onClickAdvanced( key ) {
        this.setState( prevState => ( {
            advanced: {
                ...this.state.advanced,
                [ key ]: ! prevState.advanced[ key ],
            },
        } ) );
    }

    /**
     * Function for get Child Render Typographies.
     *
     * @param {object} typographyList - Typography List.
     * @param {int} key - Typography identifier.
     * @param {boolean} isGlobal - Flag of global customization.
     * @return {Array} - Array with child typography objects.
     */
    getChildrenTypography( typographyList, key ) {
        const childTypographies = [];

        Object.keys( typographyList ).forEach( ( childKey ) => {
            if ( typographyList[ childKey ].childOf === key ) {
                childTypographies.push(
                    <div key={ childKey }>
                        { this.getTypographyComponent( typographyList, childKey ) }
                    </div>
                );
            }
        } );

        return childTypographies;
    }

    /**
     * Function for get Typography Component.
     *
     * @param {object} typographyList - Typography List.
     * @param {int} key - Typography identifier.
     * @param {boolean} isGlobal - Flag of global customization.
     * @return {*} - Typography Object.
     */
    getTypographyComponent( typographyList, key ) {
        const placeholders = this.getPlaceholders();

        return (
            ( false !== this.state.customTypography ) ? (
                <Typography
                    onChange={ ( opt ) => {
                        this.updateTypography( opt, typographyList, key );
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
                />
            ) : (
                <Spinner />
            )
        );
    }

    render() {
        const typographyList = getCustomTypographyList( this.state.customTypography, true );

        return (
            <div className="ghostkit-settings-content-wrapper ghostkit-settings-typography">
                { typographyList && Object.keys( typographyList ).length ? (
                    <Fragment>
                        { Object.keys( typographyList ).map( ( key ) => {
                            const advancedData = this.state.advanced[ key ];
                            const advancedLabel = advancedData === true ? __( 'Hide Advanced' ) : __( 'Show Advanced' );

                            if ( typographyList[ key ].childOf === '' ) {
                                return (
                                    <div className={ 'ghostkit-typography-container' } key={ key }>
                                        {
                                            this.getTypographyComponent( typographyList, key )
                                        }
                                        { typeof advancedData !== 'undefined' ? (
                                            <div className={ 'ghostkit-typography-advanced' }>
                                                <Button
                                                    isDefault
                                                    onClick={ () => this.onClickAdvanced( key ) }
                                                    className={ 'ghostkit-typography-advanced-button' }
                                                >
                                                    { advancedLabel }
                                                </Button>
                                            </div>
                                        ) : '' }
                                        { advancedData ? (
                                            this.getChildrenTypography( typographyList, key )
                                        ) : '' }
                                    </div>
                                );
                            }
                        } ) }
                    </Fragment>
                ) : '' }
            </div>
        );
    }
}

export default compose( [
    withSelect( ( select ) => {
        const customTypography = select( 'ghostkit/plugins/typography' ).getCustomTypography();

        try {
            customTypography.ghostkit_typography = JSON.parse( customTypography.ghostkit_typography );
        } catch ( e ) { }

        return {
            customTypography,
        };
    } ),
    withDispatch( ( dispatch ) => ( {
        updateTypography( value ) {
            value = {
                ghostkit_typography: JSON.stringify( value.ghostkit_typography ),
            };

            dispatch( 'ghostkit/plugins/typography' ).setCustomTypography( value );

            apiFetch( {
                path: '/ghostkit/v1/update_custom_typography',
                method: 'POST',
                data: {
                    data: value,
                },
            } );
        },
    } ) ),
] )( TypographySettings );
