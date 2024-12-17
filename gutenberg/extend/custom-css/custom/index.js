import { addCompleter } from 'ace-builds/src-noconflict/ext-language_tools';
import classnames from 'classnames/dedupe';

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';
import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
	BaseControl,
	Button,
	Dropdown,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import CodeEditor from '../../../components/code-editor';
import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

const placeholder = 'selector {\n\n}';

/**
 * Autocomplete for `selector`.
 */
addCompleter({
	getCompletions(editor, session, pos, prefix, callback) {
		if (editor.id === 'gkt-custom-css-editor') {
			callback(null, [
				{
					caption: 'selector',
					value: 'selector',
					meta: __('Block Selector', 'ghostkit'),
				},
			]);
		}
	},
	identifierRegexps: [/selector/],
});

function CustomCSSCustomTools(props) {
	const [defaultPlaceholder, setDefaultPlaceholder] = useState(placeholder);

	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);

	const { device, allDevices } = useResponsive();

	let hasCustom = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		hasCustom = hasCustom || hasStyle('custom', thisDevice);
	});

	const baseControlLabel = (
		<>
			{__('Custom', 'ghostkit')}
			<ResponsiveToggle
				checkActive={(checkMedia) => {
					return hasStyle('custom', checkMedia);
				}}
			/>
		</>
	);

	return (
		<ToolsPanelItem
			label={__('Custom', 'ghostkit')}
			hasValue={() => !!hasCustom}
			onSelect={() => {
				if (!hasStyle('custom')) {
					setStyles({ custom: '' });
				}
			}}
			onDeselect={() => {
				resetStyles(['custom'], true);
			}}
			isShownByDefault={false}
		>
			<BaseControl
				id={baseControlLabel}
				label={baseControlLabel}
				__nextHasNoMarginBottom
			>
				<Dropdown
					className="ghostkit-extension-customCSS-custom__dropdown"
					contentClassName="ghostkit-extension-customCSS-custom__dropdown-content"
					popoverProps={{
						placement: 'left-start',
						offset: 36,
						shift: true,
					}}
					renderToggle={({ isOpen, onToggle }) => (
						<Button
							className={classnames(
								'ghostkit-extension-customCSS-custom__dropdown-content-toggle',
								isOpen
									? 'ghostkit-extension-customCSS-custom__dropdown-content-toggle-active'
									: ''
							)}
							onClick={() => {
								onToggle();
							}}
						>
							<span>{__('Edit CSS', 'ghostkit')}</span>
							<CodeEditor
								mode="css"
								value={
									getStyle('custom', device) ||
									defaultPlaceholder
								}
								maxLines={7}
								minLines={3}
								height="200px"
								showPrintMargin={false}
								showGutter={false}
								highlightActiveLine={false}
								setOptions={{
									enableBasicAutocompletion: false,
									enableLiveAutocompletion: false,
									enableSnippets: false,
									showLineNumbers: false,
								}}
							/>
						</Button>
					)}
					renderContent={() => (
						<>
							<BaseControl
								id={baseControlLabel}
								label={baseControlLabel}
								__nextHasNoMarginBottom
							/>
							<CodeEditor
								mode="css"
								onChange={(value) => {
									if (value !== placeholder) {
										setStyles({ custom: value }, device);
									}

									// Reset placeholder.
									if (defaultPlaceholder) {
										setDefaultPlaceholder('');
									}
								}}
								value={
									getStyle('custom', device) ||
									defaultPlaceholder
								}
								maxLines={20}
								minLines={5}
								height="300px"
								editorProps={{
									id: 'gkt-custom-css-editor',
								}}
							/>
							<p style={{ marginBottom: 20 }} />
							<details>
								<summary
									label={__(
										'Examples to use selector',
										'ghostkit'
									)}
									dangerouslySetInnerHTML={{
										__html: __(
											'Use %s rule to change block styles.',
											'ghostkit'
										).replace(
											'%s',
											'<code>selector</code>'
										),
									}}
								/>
								<p>{__('Example:', 'ghostkit')}</p>
								<pre className="ghostkit-control-pre-custom-css">
									{`selector {
  background-color: #2F1747;
}

selector p {
  color: #2F1747;
}`}
								</pre>
							</details>
						</>
					)}
				/>
			</BaseControl>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.customCSS.tools',
	'ghostkit/extension/customCSS/tools/custom',
	(children, { props }) => {
		const hasCustomSupport =
			hasBlockSupport(props.name, ['ghostkit', 'customCSS', 'custom']) ||
			getBlockSupport(props.name, ['ghostkit', 'customCSS']) === true;

		if (!hasCustomSupport) {
			return children;
		}

		return (
			<>
				{children}
				<CustomCSSCustomTools {...props} />
			</>
		);
	}
);
