import './border';
import './borderRadius';
import './shadow';

import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import {
	__experimentalToolsPanel as ExperimentalToolsPanel,
	__stableToolsPanel as StableToolsPanel,
} from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ApplyFilters from '../../components/apply-filters';
import useStyles from '../../hooks/use-styles';
import { EXTENSIONS } from '../constants';

const ToolsPanel = StableToolsPanel || ExperimentalToolsPanel;

const allFrameProps = EXTENSIONS.frame.styles;

/**
 * Add inspector controls.
 *
 * @param original
 * @param root0
 * @param root0.props
 */
function GhostKitExtensionFrameInspector(original, { props }) {
	const { name } = props;

	const hasFrameSupport = hasBlockSupport(name, ['ghostkit', 'frame']);

	if (!hasFrameSupport) {
		return original;
	}

	const { resetStyles } = useStyles(props);

	return (
		<>
			{original}
			<InspectorControls group="styles">
				<ToolsPanel
					className="ghostkit-tools-panel-with-icon ghostkit-tools-panel-with-icon-frame"
					label={__('Frame', 'ghostkit')}
					resetAll={() => {
						resetStyles(allFrameProps, true, ['', '&:hover']);
					}}
				>
					<div className="ghostkit-tools-panel-frame">
						<ApplyFilters
							name="ghostkit.extension.frame.tools"
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
	'ghostkit/extension/frame/inspector',
	GhostKitExtensionFrameInspector,
	14
);
