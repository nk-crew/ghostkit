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
import getIcon from '../../utils/get-icon';

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
					label={
						<>
							<span className="ghostkit-ext-icon">
								{getIcon('extension-display')}
							</span>
							<span>{__('Display Conditions', 'ghostkit')}</span>
						</>
					}
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
