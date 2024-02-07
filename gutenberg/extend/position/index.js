import './position';
import './distance';
import './width';
import './height';
import './minMaxWidth';
import './minMaxHeight';
import './zIndex';

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
import getIcon from '../../utils/get-icon';
import { EXTENSIONS } from '../constants';

const ToolsPanel = StableToolsPanel || ExperimentalToolsPanel;

const allPositionProps = EXTENSIONS.position.styles;

/**
 * Add inspector controls.
 *
 * @param original
 * @param root0
 * @param root0.props
 */
function GhostKitExtensionPositionInspector(original, { props }) {
	const { name } = props;

	const hasPositionSupport = hasBlockSupport(name, ['ghostkit', 'position']);

	if (!hasPositionSupport) {
		return original;
	}

	const { resetStyles } = useStyles(props);

	return (
		<>
			{original}
			<InspectorControls group="styles">
				<ToolsPanel
					label={
						<>
							<span className="ghostkit-ext-icon">
								{getIcon('extension-position')}
							</span>
							<span>{__('Position', 'ghostkit')}</span>
						</>
					}
					resetAll={() => {
						resetStyles(allPositionProps, true);
					}}
				>
					<div className="ghostkit-tools-panel-position">
						<ApplyFilters
							name="ghostkit.extension.position.tools"
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
	'ghostkit/extension/position/inspector',
	GhostKitExtensionPositionInspector,
	12
);
