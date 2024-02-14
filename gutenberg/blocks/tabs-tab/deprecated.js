import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

const { name } = metadata;

export default [
	// v3.1.2
	{
		...metadata,
		save: function BlockSave(props) {
			const { slug } = props.attributes;

			let className = 'ghostkit-tab';

			className = applyFilters('ghostkit.blocks.className', className, {
				...{ name },
				...props,
			});

			const blockProps = useBlockProps.save({
				className,
				'data-tab': slug,
			});
			const innerBlockProps = useInnerBlocksProps.save(blockProps);

			return <div {...innerBlockProps} />;
		},
	},
];
