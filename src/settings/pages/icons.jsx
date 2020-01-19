/**
 * Import CSS
 */
import './icons.scss';

/**
 * External dependencies
 */
import { Component, Fragment } from 'react';
import { debounce } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
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

        if ( typeof this.state.settings[ name ] !== 'undefined' ) {
            result = this.state.settings[ name ];
        }

        return result;
    }

    updateSetting( name, val ) {
        const allSettings = merge( {}, this.state.settings, {
            [ name ]: val,
        } );

        this.setState( {
            settings: allSettings,
        }, () => {
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
                    // eslint-disable-next-line
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
