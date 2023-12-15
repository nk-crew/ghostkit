/**
 * Internal dependencies
 */
import metadata from './block.json';

const { name } = metadata;

/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockEdit( props ) {
	const { slug } = props.attributes;

	let className = 'ghostkit-tab';

	className = applyFilters( 'ghostkit.blocks.className', className, {
		...{ name },
		...props,
	} );

	const blockProps = useBlockProps.save( { className, 'data-tab': slug } );
	const innerBlockProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlockProps } />;
}
