/**
 * External dependencies
 */
import ApplyFilters from '../../gutenberg/components/apply-filters';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { ExternalLink } = wp.components;

const { __ } = wp.i18n;

export default class BreakpointSettings extends Component {
    render() {
        return (
            <ApplyFilters name="ghostkit.breakpoints.settings" props={ this.props }>
                <div className="ghostkit-settings-content-wrapper ghostkit-settings-breakpoints">
                    { __( 'Breakpoints available for PRO users only. Read more about Ghost Kit PRO plugin here - ', '@@text_domain' ) }
                    <ExternalLink href="https://ghostkit.io/pricing/">https://ghostkit.io/pricing/</ExternalLink>
                </div>
            </ApplyFilters>
        );
    }
}
