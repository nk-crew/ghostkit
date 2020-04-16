/**
 * External dependencies
 */
import { debounce } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;

const { merge } = window.lodash;

const { apiFetch } = wp;

const {
    ToggleControl,
} = wp.components;

/**
 * Internal dependencies
 */
const { GHOSTKIT } = window;

class Icons extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            settings: GHOSTKIT.settings || {},
        };

        this.getSetting = this.getSetting.bind( this );
        this.updateSetting = this.updateSetting.bind( this );
        this.updateIconsDebounce = debounce( 1000, this.updateIconsDebounce.bind( this ) );
    }

    getSetting( name, defaultVal ) {
        let result = defaultVal;

        if ( 'undefined' !== typeof this.state.settings[ name ] ) {
            result = this.state.settings[ name ];
        }

        return result;
    }

    updateSetting( name, val ) {
        this.setState( ( prevState ) => ( {
            settings: merge( {}, prevState.settings, {
                [ name ]: val,
            } ),
        } ), () => {
            this.updateIconsDebounce();
        } );
    }

    updateIconsDebounce() {
        apiFetch( {
            path: '/ghostkit/v1/update_settings',
            method: 'POST',
            data: {
                settings: this.state.settings,
            },
        } )
            .then( ( result ) => {
                if ( ! result.success || ! result.response ) {
                    // eslint-disable-next-line no-console
                    console.log( result );
                }
            } );
    }

    render() {
        const {
            icons,
        } = GHOSTKIT;

        return (
            <div className="ghostkit-settings-content-wrapper ghostkit-settings-icons">
                { icons && Object.keys( icons ).length ? (
                    <Fragment>
                        { Object.keys( icons ).map( ( k ) => (
                            <ToggleControl
                                key={ k }
                                label={ icons[ k ].name }
                                checked={ this.getSetting( `icon_pack_${ k }`, true ) }
                                onChange={ () => {
                                    this.updateSetting( `icon_pack_${ k }`, ! this.getSetting( `icon_pack_${ k }`, true ) );
                                } }
                            />
                        ) ) }
                    </Fragment>
                ) : '' }
            </div>
        );
    }
}

export default Icons;
