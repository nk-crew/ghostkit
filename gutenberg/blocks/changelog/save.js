import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

const { name } = metadata;

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { version, date } = props.attributes;

	let className = 'ghostkit-changelog';

	className = applyFilters('ghostkit.blocks.className', className, {
		name,
		...props,
	});

	const blockProps = useBlockProps.save({ className });
	const innerBlockProps = useInnerBlocksProps.save({
		className: 'ghostkit-changelog-more',
	});

	return (
		<div {...blockProps}>
			{!RichText.isEmpty(version) ? (
				<RichText.Content
					tagName="span"
					className="ghostkit-changelog-version"
					value={version}
				/>
			) : null}
			{!RichText.isEmpty(date) ? (
				<RichText.Content
					tagName="h2"
					className="ghostkit-changelog-date"
					value={date}
				/>
			) : null}
			<div {...innerBlockProps} />
		</div>
	);
}
