import './screenSize';

import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import {
	__experimentalToolsPanel as ExperimentalToolsPanel,
	__stableToolsPanel as StableToolsPanel,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ApplyFilters from '../../components/apply-filters';

const ToolsPanel = StableToolsPanel || ExperimentalToolsPanel;

/**
 * Add inspector controls.
 *
 * @param original
 * @param root0
 * @param root0.props
 */
function GhostKitExtensionDisplayInspector(original, { props }) {
	const { name } = props;

	const hasDisplaySupport = hasBlockSupport(name, ['ghostkit', 'display']);

	if (!hasDisplaySupport) {
		return original;
	}

	return (
		<>
			{original}
			<InspectorControls group="styles">
				<ToolsPanel
					className="ghostkit-tools-panel-with-icon ghostkit-tools-panel-with-icon-display"
					label={__('Display Conditions', 'ghostkit')}
				>
					<div className="ghostkit-tools-panel-display">
						<ApplyFilters
							name="ghostkit.extension.display.tools"
							props={props}
						/>
					</div>
				</ToolsPanel>
			</InspectorControls>
		</>
	);
}

// Init filters.
addFilter(
	'ghostkit.editor.extensions',
	'ghostkit/extension/display/inspector',
	GhostKitExtensionDisplayInspector,
	17
);
