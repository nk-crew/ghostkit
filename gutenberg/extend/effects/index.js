import './reveal';
import './pro-effects';

import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import {
	__experimentalToolsPanel as ExperimentalToolsPanel,
	__stableToolsPanel as StableToolsPanel,
	Button,
	MenuGroup,
	ToolbarDropdownMenu,
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
function GhostKitExtensionEffectsInspector(original, { props }) {
	const { name, attributes, setAttributes } = props;

	const hasEffectsSupport = hasBlockSupport(name, ['ghostkit', 'effects']);

	if (!hasEffectsSupport) {
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
								{getIcon('extension-sr')}
							</span>
							<span>{__('Effects', 'ghostkit')}</span>
						</>
					}
					resetAll={() => {
						const ghostkitData = {
							...(attributes?.ghostkit || {}),
						};

						if (typeof ghostkitData?.effects !== 'undefined') {
							delete ghostkitData?.effects;

							setAttributes({ ghostkit: ghostkitData });
						}
					}}
				>
					<div className="ghostkit-tools-panel-effects">
						<ApplyFilters
							name="ghostkit.extension.effects.tools"
							props={props}
						/>
					</div>
				</ToolsPanel>
			</InspectorControls>
		</>
	);
}

/**
 * Add toolbar controls.
 *
 * @param original
 * @param root0
 * @param root0.props
 */
function GhostKitExtensionEffectsToolbar(original, { props }) {
	const { name, attributes, setAttributes } = props;

	const hasEffectsSupport = hasBlockSupport(name, ['ghostkit', 'effects']);

	if (!hasEffectsSupport) {
		return original;
	}

	const hasEffects = attributes?.ghostkit?.effects;

	if (!hasEffects) {
		return original;
	}

	return (
		<>
			{original}
			<BlockControls group="other">
				<ToolbarDropdownMenu
					icon={getIcon('extension-sr')}
					label={__('Effects', 'ghostkit')}
					menuProps={{
						style: { width: '260px' },
					}}
					popoverProps={{ focusOnMount: false }}
				>
					{() => (
						<>
							<MenuGroup>
								{__(
									'There are effects added to the current block. To change these options open the "Effects" block settings panel.',
									'ghostkit'
								)}
							</MenuGroup>
							<MenuGroup>
								{__(
									'Reset all effects of the current block:',
									'ghostkit'
								)}
								<Button
									variant="link"
									onClick={() => {
										const ghostkitData = {
											...(attributes?.ghostkit || {}),
										};

										if (
											typeof ghostkitData?.effects !==
											'undefined'
										) {
											delete ghostkitData?.effects;

											setAttributes({
												ghostkit: ghostkitData,
											});
										}
									}}
								>
									{__('Reset All', 'ghostkit')}
								</Button>
							</MenuGroup>
						</>
					)}
				</ToolbarDropdownMenu>
			</BlockControls>
		</>
	);
}

// Init filters.
addFilter(
	'ghostkit.editor.extensions',
	'ghostkit/extension/effects/inspector',
	GhostKitExtensionEffectsInspector,
	11
);
addFilter(
	'ghostkit.editor.extensions',
	'ghostkit/extension/effects/toolbar',
	GhostKitExtensionEffectsToolbar
);
