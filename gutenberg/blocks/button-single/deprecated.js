import classnames from 'classnames/dedupe';

import { RichText, useBlockProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import IconPicker from '../../components/icon-picker';
import metadata from './block.json';

const { name } = metadata;

export default [
	// v2.23.2
	{
		...metadata,

		attributes: {
			tagName: {
				type: 'string',
			},
			url: {
				type: 'string',
				source: 'attribute',
				selector: 'a.ghostkit-button',
				attribute: 'href',
			},
			target: {
				type: 'string',
				source: 'attribute',
				selector: 'a.ghostkit-button',
				attribute: 'target',
			},
			rel: {
				type: 'string',
				source: 'attribute',
				selector: 'a.ghostkit-button',
				attribute: 'rel',
			},
			text: {
				type: 'string',
				source: 'html',
				selector: '.ghostkit-button .ghostkit-button-text',
				default: 'Button',
			},
			hideText: {
				type: 'boolean',
				default: false,
			},
			icon: {
				type: 'string',
				default: '',
			},
			iconPosition: {
				type: 'string',
				default: 'left',
			},
			size: {
				type: 'string',
				default: 'md',
			},
			color: {
				type: 'string',
			},
			textColor: {
				type: 'string',
			},

			borderRadius: {
				type: 'number',
			},
			borderWeight: {
				type: 'number',
			},
			borderColor: {
				type: 'string',
			},

			focusOutlineWeight: {
				type: 'number',
			},

			hoverColor: {
				type: 'string',
			},
			hoverTextColor: {
				type: 'string',
			},
			hoverBorderColor: {
				type: 'string',
			},

			focusOutlineColor: {
				type: 'string',
				default: 'rgba(3, 102, 214, 0.5)',
			},
		},
		save: function BlockSave(props) {
			const {
				tagName,
				text,
				icon,
				iconPosition,
				hideText,
				url,
				target,
				rel,
				size,
				focusOutlineWeight,
				focusOutlineColor,
			} = props.attributes;

			let className = classnames(
				'ghostkit-button',
				size && `ghostkit-button-${size}`,
				hideText && 'ghostkit-button-icon-only'
			);

			// focus outline
			if (focusOutlineWeight && focusOutlineColor) {
				className = classnames(
					className,
					'ghostkit-button-with-outline'
				);
			}

			className = applyFilters('ghostkit.blocks.className', className, {
				name,
				...props,
			});

			const result = [];

			if (!hideText) {
				result.push(
					<RichText.Content
						tagName="span"
						className="ghostkit-button-text"
						value={text}
						key="button-text"
					/>
				);
			}

			// add icon.
			if (icon) {
				result.unshift(
					<IconPicker.Render
						name={icon}
						tag="span"
						className={`ghostkit-button-icon ghostkit-button-icon-${
							iconPosition === 'right' ? 'right' : 'left'
						}`}
						key="button-icon"
					/>
				);
			}

			const Tag = tagName || (url ? 'a' : 'span');

			const blockProps = useBlockProps.save({
				className,
				...(Tag === 'a'
					? {
							href: url,
							target: target || false,
							rel: rel || false,
						}
					: {}),
			});

			return <Tag {...blockProps}>{result}</Tag>;
		},
	},
];
