/**
 * External dependencies
 */
import ApplyFilters from '../../gutenberg/components/apply-filters';

/**
 * WordPress dependencies
 */
const { ExternalLink } = wp.components;

const { __ } = wp.i18n;

export default function BreakpointSettings(props) {
  return (
    <ApplyFilters name="ghostkit.breakpoints.settings" props={props}>
      <div className="ghostkit-settings-content-wrapper ghostkit-settings-breakpoints">
        {__(
          'Breakpoints available for Pro users only. Read more about Ghost Kit Pro plugin here - ',
          '@@text_domain'
        )}
        <ExternalLink href="https://ghostkit.io/pricing/?utm_source=plugin&utm_medium=settings&utm_campaign=breakpoints&utm_content=@@plugin_version">
          https://ghostkit.io/pricing/
        </ExternalLink>
      </div>
    </ApplyFilters>
  );
}
