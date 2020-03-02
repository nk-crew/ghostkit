/**
 * External dependencies
 */
import ApplyFilters from '../../gutenberg/components/apply-filters';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { __ } = wp.i18n;

export default class FontsSettings extends Component {
    render() {
        return (
            <ApplyFilters name="ghostkit.fonts.settings" props={ this.props }>
                <div className="ghostkit-settings-content-wrapper ghostkit-settings-fonts">
                    { __( 'Adobe Fonts available for PRO users only. Read more about Ghost Kit PRO plugin here - ', '@@text_domain' ) }
                    <a target="_blank" rel="noopener noreferrer" href="https://ghostkit.io/pricing/">https://ghostkit.io/pricing/</a>
                </div>
            </ApplyFilters>
        );
    }
}
