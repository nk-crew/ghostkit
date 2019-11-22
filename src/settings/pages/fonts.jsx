/**
 * External dependencies
 */
import { Component, Fragment } from 'react';

const {
    applyFilters,
} = wp.hooks;

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;

class FontsSettings extends Component {
    render() {
        return (
            <div className="ghostkit-settings-content-wrapper ghostkit-settings-fonts">
                <Fragment>
                    { __( 'Adobe and Custom user fonts available for PRO users only. Read more about Ghost Kit PRO plugin here - ', '@@text_domain' ) }
                    <a href={ 'https://ghostkit.io/pricing/' }>https://ghostkit.io/pricing/</a>
                </Fragment>
            </div>
        );
    }
}

export default applyFilters( 'ghostkit.settings.fonts', FontsSettings );
