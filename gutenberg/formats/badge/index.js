import { RichTextToolbarButton } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	applyFormat,
	getActiveFormat,
	toggleFormat,
} from '@wordpress/rich-text';

import ColorPalette from '../../components/color-palette';
import getIcon from '../../utils/get-icon';
import BadgePopover from './badge-popover';

export const name = 'ghostkit/badge';

function parseCSS(css = '') {
	return css.split(';').reduce((accumulator, rule) => {
		if (rule) {
			let [property, value] = rule.split(':');

			if (property) {
				property = property.trim();
			}
			if (value) {
				value = value.trim();
			}

			if (property === 'color') {
				accumulator.color = value;
			}

			if (property === 'background') {
				accumulator.background = value;
			}
		}

		return accumulator;
	}, {});
}

function BadgeFormat(props) {
	const { isActive, value, contentRef, onChange } = props;

	const [openedPopover, setOpenedPopover] = useState(false);

	// Close popover.
	useEffect(() => {
		if (!isActive && openedPopover) {
			setOpenedPopover(false);
		}
	}, [isActive, openedPopover]);

	function getCurrentColor() {
		const { attributes } = getActiveFormat(value, name);

		if (attributes && attributes.style) {
			return parseCSS(attributes.style);
		}

		return {};
	}

	function toggleBadge(newBackground, newColor) {
		const attributes = {};

		if (newBackground) {
			attributes.style = `background: ${newBackground};`;
		}
		if (newColor) {
			if (attributes.style) {
				attributes.style += ' ';
			} else {
				attributes.style = '';
			}

			attributes.style += `color: ${newColor};`;
		}

		const runFormat = newBackground ? applyFormat : toggleFormat;

		onChange(
			runFormat(value, {
				type: name,
				attributes,
			})
		);
	}

	let currentColor = {};

	if (isActive) {
		currentColor = getCurrentColor();
	}

	return (
		<>
			<RichTextToolbarButton
				icon={getIcon('icon-badge')}
				title={__('Badge', 'ghostkit')}
				onClick={() => {
					if (!isActive) {
						toggleBadge();
					}

					setOpenedPopover(!openedPopover);
				}}
				isActive={isActive}
			/>
			{isActive && openedPopover ? (
				<BadgePopover value={value} name={name} contentRef={contentRef}>
					<TabPanel
						tabs={[
							{
								name: 'background',
								title: 'Background',
							},
							{
								name: 'text',
								title: 'Text',
							},
						]}
						initialTabName="background"
					>
						{(tab) => {
							if ('text' === tab.name) {
								return (
									<ColorPalette
										label={__('Text', 'ghostkit')}
										value={currentColor?.color || ''}
										onChange={(val) => {
											toggleBadge(
												currentColor?.background || '',
												val
											);
										}}
										alpha
									/>
								);
							}

							return (
								<ColorPalette
									label={__('Background', 'ghostkit')}
									value={currentColor?.background || ''}
									onChange={(val) => {
										toggleBadge(
											val,
											currentColor?.color || ''
										);
									}}
									alpha
									gradient
								/>
							);
						}}
					</TabPanel>
				</BadgePopover>
			) : null}
		</>
	);
}

export const settings = {
	title: __('Badge', 'ghostkit'),
	tagName: 'span',
	className: 'ghostkit-badge',
	attributes: {
		style: 'style',
	},
	edit: BadgeFormat,
};
