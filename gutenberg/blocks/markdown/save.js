import classnames from 'classnames/dedupe';

import { useBlockProps } from '@wordpress/block-editor';

import MDRender from './render';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { attributes } = props;
	const { content } = attributes;

	let { className } = attributes;

	className = classnames('ghostkit-markdown', className);

	const blockProps = useBlockProps.save({ className });

	return <MDRender content={content} {...blockProps} />;
}
