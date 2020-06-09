/**
 * External dependencies
 */
import { debounce } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
const {
    __,
} = wp.i18n;

const { Component } = wp.element;

const {
    TextControl,
    PanelBody,
    ExternalLink,
} = wp.components;

const { apiFetch } = wp;

/**
 * Internal dependencies
 */
const { GHOSTKIT } = window;

/**
 * Block Settings Class.
 */
export default class BlockSettings extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            apiSiteKey: GHOSTKIT.googleReCaptchaAPISiteKey,
            apiSiteKeySaved: GHOSTKIT.googleReCaptchaAPISiteKey,
            apiSecretKey: GHOSTKIT.googleReCaptchaAPISecretKey,
            apiSecretKeySaved: GHOSTKIT.googleReCaptchaAPISecretKey,
        };

        this.onChangeAPIKeys = debounce( 600, this.onChangeAPIKeys.bind( this ) );
        this.saveAPIKeys = debounce( 3000, this.saveAPIKeys.bind( this ) );
    }

    onChangeAPIKeys() {
        GHOSTKIT.googleReCaptchaAPISiteKey = this.state.apiSiteKey;
        GHOSTKIT.googleReCaptchaAPISecretKey = this.state.apiSecretKey;
    }

    saveAPIKeys() {
        if ( GHOSTKIT.googleReCaptchaAPISiteKey !== this.state.apiSiteKeySaved || GHOSTKIT.googleReCaptchaAPISecretKey !== this.state.apiSecretKeySaved ) {
            this.setState( {
                apiSiteKeySaved: GHOSTKIT.googleReCaptchaAPISiteKey,
                apiSecretKeySaved: GHOSTKIT.googleReCaptchaAPISecretKey,
            } );
            apiFetch( {
                path: '/ghostkit/v1/update_google_recaptcha_keys',
                method: 'POST',
                data: {
                    site_key: GHOSTKIT.googleReCaptchaAPISiteKey,
                    secret_key: GHOSTKIT.googleReCaptchaAPISecretKey,
                },
            } );
        }
    }

    render() {
        const {
            apiSiteKey,
            apiSecretKey,
        } = this.state;

        return (
            <PanelBody
                title={ __( 'Google reCAPTCHA', 'ghostkit' ) }
                initialOpen={ ! ( apiSiteKey && apiSecretKey ) }
            >
                <TextControl
                    label={ __( 'Site Key', 'ghostkit' ) }
                    value={ apiSiteKey }
                    onChange={ ( value ) => {
                        this.setState( { apiSiteKey: value } );
                        this.onChangeAPIKeys();
                        this.saveAPIKeys();
                    } }
                />
                <TextControl
                    label={ __( 'Secret Key', 'ghostkit' ) }
                    value={ apiSecretKey }
                    onChange={ ( value ) => {
                        this.setState( { apiSecretKey: value } );
                        this.onChangeAPIKeys();
                        this.saveAPIKeys();
                    } }
                />
                <p>{ __( 'Protect your form from spam using Google reCAPTCHA v3.', 'ghostkit' ) }</p>
                <p>
                    <ExternalLink href="https://g.co/recaptcha/v3">
                        { __( 'Generate Keys', 'ghostkit' ) }
                    </ExternalLink>
                </p>
            </PanelBody>
        );
    }
}
