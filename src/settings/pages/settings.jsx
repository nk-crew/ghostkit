import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import deepAssign from 'deep-assign';
import { debounce } from 'throttle-debounce';

import './settings.scss';
import ToggleControl from '../components/toggle.jsx';

const { apiFetch } = wp;

const { __ } = wp.i18n;

const { GHOSTKIT } = window;

export default class Settings extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            settings: GHOSTKIT.settings || {},
        };

        this.getSetting = this.getSetting.bind( this );
        this.updateSetting = this.updateSetting.bind( this );
        this.updateSettingsDebounce = debounce( 1000, this.updateSettingsDebounce.bind( this ) );
    }

    getSetting( name, defaultVal ) {
        let result = defaultVal;

        if ( typeof this.state.settings[ name ] !== 'undefined' ) {
            result = this.state.settings[ name ];
        }

        return result;
    }

    updateSetting( name, val ) {
        const allSettings = deepAssign( {}, this.state.settings, {
            [ name ]: val,
        } );

        this.setState( {
            settings: allSettings,
        }, () => {
            this.updateSettingsDebounce();
        } );
    }

    updateSettingsDebounce() {
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
            <div className="ghostkit-settings">
                { icons && Object.keys( icons ).length ? (
                    <Fragment>
                        <h3>{ __( 'Icons' ) }</h3>
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

Settings.propTypes = {
    data: PropTypes.object,
};
