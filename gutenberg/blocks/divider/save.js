import classnames from 'classnames/dedupe';

import { applyFilters } from '@wordpress/hooks';

import IconPicker from '../../components/icon-picker';
import metadata from './block.json';
const { name } = metadata;
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { icon, type } = props.attributes;

	let className = `ghostkit-divider ghostkit-divider-type-${type}`;

	if (icon) {
		className = classnames(className, 'ghostkit-divider-with-icon');
	}

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const blockProps = useBlockProps.save({ className });

	return (
		<div {...blockProps}>
			{icon ? (
				<IconPicker.Render
					name={icon}
					tag="div"
					className="ghostkit-divider-icon"
				/>
			) : null}
		</div>
	);
}
