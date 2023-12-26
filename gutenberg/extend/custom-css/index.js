import './opacity';
import './overflow';
import './cursor';
import './userSelect';
import './clipPath';
import './pro-transition';
import './custom';

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

const allCustomCSS = EXTENSIONS.customCSS.styles;

/**
 * Add inspector controls.
 *
 * @param original
 * @param root0
 * @param root0.props
 */
function GhostKitExtensionCustomCSSInspector(original, { props }) {
	const { name } = props;

	const hasCustomCSSSupport = hasBlockSupport(name, [
		'ghostkit',
		'customCSS',
	]);

	if (!hasCustomCSSSupport) {
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
								{getIcon('extension-custom-css')}
							</span>
							<span>{__('Custom CSS', 'ghostkit')}</span>
						</>
					}
					resetAll={() => {
						resetStyles(allCustomCSS, true);
					}}
				>
					<div className="ghostkit-tools-panel-custom-css">
						<ApplyFilters
							name="ghostkit.extension.customCSS.tools"
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
	'ghostkit/extension/customCSS/inspector',
	GhostKitExtensionCustomCSSInspector,
	16
);
