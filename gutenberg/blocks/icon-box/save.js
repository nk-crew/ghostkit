import classnames from 'classnames/dedupe';

import IconPicker from '../../components/icon-picker';
import metadata from './block.json';

const { name } = metadata;

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const {
		icon,
		iconPosition,
		iconAlign,
		showContent,
		url,
		ariaLabel,
		target,
		rel,
	} = props.attributes;

	let className = classnames(
		'ghostkit-icon-box',
		url && 'ghostkit-icon-box-with-link'
	);
	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const classNameIcon = classnames(
		'ghostkit-icon-box-icon',
		`ghostkit-icon-box-icon-align-${iconPosition || 'left'}`,
		iconPosition === 'top'
			? `ghostkit-icon-box-icon-top-align-${iconAlign || 'center'}`
			: ''
	);

	const blockProps = useBlockProps.save({ className });
	const innerBlockProps = useInnerBlocksProps.save({
		className: 'ghostkit-icon-box-content',
	});

	return (
		<div {...blockProps}>
			{url ? (
				<a
					className="ghostkit-icon-box-link"
					href={url}
					target={target || null}
					rel={rel || null}
					aria-label={ariaLabel || null}
				>
					<span />
				</a>
			) : null}
			{icon ? (
				<IconPicker.Render
					name={icon}
					tag="div"
					className={classNameIcon}
				/>
			) : null}
			{showContent ? <div {...innerBlockProps} /> : null}
		</div>
	);
}
