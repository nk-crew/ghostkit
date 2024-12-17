import {
	__experimentalLinkControl as LinkControl,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	KeyboardShortcuts,
	PanelBody,
	Popover,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { displayShortcut, rawShortcut } from '@wordpress/keycodes';

const NEW_TAB_REL = 'noreferrer noopener';

/**
 * Component Class
 *
 * @param props
 */
export default function URLPicker(props) {
	const [toolbarSettingsOpened, setToolbarSettingsOpened] = useState(false);
	const {
		rel,
		target,
		url,
		ariaLabel,
		toolbarSettings = true,
		inspectorSettings = true,
		blockControlsGroup = 'block',
		isSelected,
	} = props;

	function onChange(data) {
		const newData = {
			rel,
			target,
			url,
			ariaLabel,
			...data,
		};

		if (target !== newData.target) {
			let updatedRel = newData.rel;

			if (newData.target && !newData.rel) {
				updatedRel = NEW_TAB_REL;
			} else if (!newData.target && newData.rel === NEW_TAB_REL) {
				updatedRel = undefined;
			}

			newData.rel = updatedRel;
		}

		props.onChange(newData);
	}

	function toggleToolbarSettings(open) {
		setToolbarSettingsOpened(
			typeof open !== 'undefined' ? open : !toolbarSettingsOpened
		);
	}

	function linkControl() {
		return (
			<LinkControl
				className="wp-block-navigation-link__inline-link-input"
				value={{
					url,
					opensInNewTab: target === '_blank',
				}}
				onChange={({
					url: newURL = '',
					opensInNewTab: newOpensInNewTab,
				}) => {
					onChange({
						url: newURL,
						target: newOpensInNewTab ? '_blank' : '',
					});
				}}
				onRemove={() => {
					onChange({
						url: '',
						target: '',
						rel: '',
					});
					toggleToolbarSettings(false);
				}}
			/>
		);
	}

	return (
		<>
			{toolbarSettings ? (
				<>
					<BlockControls group={blockControlsGroup}>
						<ToolbarGroup>
							<ToolbarButton
								name="link"
								icon={
									<svg
										width="24"
										height="24"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										role="img"
										aria-hidden="true"
										focusable="false"
									>
										<path d="M15.6 7.2H14v1.5h1.6c2 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7H14v1.5h1.6c2.8 0 5.2-2.3 5.2-5.2 0-2.9-2.3-5.2-5.2-5.2zM4.7 12.4c0-2 1.7-3.7 3.7-3.7H10V7.2H8.4c-2.9 0-5.2 2.3-5.2 5.2 0 2.9 2.3 5.2 5.2 5.2H10v-1.5H8.4c-2 0-3.7-1.7-3.7-3.7zm4.6.9h5.3v-1.5H9.3v1.5z" />
									</svg>
								}
								title={__('Link')}
								shortcut={displayShortcut.primary('k')}
								onClick={() => toggleToolbarSettings()}
							/>
						</ToolbarGroup>
					</BlockControls>
					{isSelected && (
						<KeyboardShortcuts
							bindGlobal
							shortcuts={{
								[rawShortcut.primary('k')]:
									toggleToolbarSettings,
							}}
						/>
					)}
					{toolbarSettingsOpened ? (
						<Popover
							position="bottom center"
							onClose={() => toggleToolbarSettings(false)}
						>
							{linkControl()}
						</Popover>
					) : null}
				</>
			) : null}
			{inspectorSettings ? (
				<InspectorControls>
					<PanelBody
						title={__('Link Settings')}
						initialOpen={false}
						className="ghostkit-components-url-picker-inspector"
					>
						{linkControl()}
						<TextControl
							label={__('Link Rel')}
							value={rel || ''}
							onChange={(val) => {
								onChange({
									rel: val,
								});
							}}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
						<TextControl
							label={__('Accessible Label')}
							value={ariaLabel || ''}
							onChange={(val) => {
								onChange({
									ariaLabel: val,
								});
							}}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</PanelBody>
				</InspectorControls>
			) : null}
		</>
	);
}
