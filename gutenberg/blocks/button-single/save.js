import classnames from 'classnames/dedupe';

import { RichText, useBlockProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import IconPicker from '../../components/icon-picker';
import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const {
		tagName,
		text,
		icon,
		iconPosition,
		hideText,
		url,
		ariaLabel,
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
		className = classnames(className, 'ghostkit-button-with-outline');
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
					target: target || null,
					rel: rel || null,
					'aria-label': ariaLabel || null,
				}
			: {}),
	});

	return <Tag {...blockProps}>{result}</Tag>;
}
