/**
 * External dependencies
 */
import { Component } from 'react';

import ApplyFilters from '../../gutenberg/components/apply-filters';

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;

export default class FontsSettings extends Component {
    render() {
        return (
            <ApplyFilters name="ghostkit.fonts.settings" props={ this.props }>
                <div className="ghostkit-settings-content-wrapper ghostkit-settings-fonts">
                    { __( 'Adobe and Custom user fonts available for PRO users only. Read more about Ghost Kit PRO plugin here - ', '@@text_domain' ) }
                    <a target={ '_blank' } href={ 'https://ghostkit.io/pricing/' }>https://ghostkit.io/pricing/</a>
                </div>
            </ApplyFilters>
        );
    }
}
