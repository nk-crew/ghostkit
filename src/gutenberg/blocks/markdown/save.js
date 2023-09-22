/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import MDRender from './render';

/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { attributes } = props;
  const { content } = attributes;

  let { className } = attributes;

  className = classnames('ghostkit-markdown', className);

  const blockProps = useBlockProps.save({ className });

  return <MDRender content={content} {...blockProps} />;
}
