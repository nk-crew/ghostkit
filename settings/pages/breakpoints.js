import { ExternalLink } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import ApplyFilters from '../../gutenberg/components/apply-filters';

const { version } = window.ghostkitVariables;

export default function BreakpointSettings(props) {
	return (
		<ApplyFilters name="ghostkit.breakpoints.settings" props={props}>
			<div className="ghostkit-settings-content-wrapper ghostkit-settings-breakpoints">
				{__(
					'Breakpoints available for Pro users only. Read more about Ghost Kit Pro plugin here - ',
					'ghostkit'
				)}
				<ExternalLink
					href={`https://www.ghostkit.io/pricing/?utm_source=plugin&utm_medium=settings&utm_campaign=breakpoints&utm_content=${version}`}
				>
					https://www.ghostkit.io/pricing/
				</ExternalLink>
			</div>
		</ApplyFilters>
	);
}
