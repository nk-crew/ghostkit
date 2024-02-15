import classnames from 'classnames/dedupe';

import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
	const { url, srcset, alt, width, height, caption } = props.attributes;

	let { className } = props.attributes;

	className = classnames('ghostkit-gif', className);

	const blockProps = useBlockProps.save({ className });

	return (
		<figure {...blockProps}>
			<img
				src={url}
				srcSet={srcset}
				alt={alt}
				width={width}
				height={height}
			/>
			{!RichText.isEmpty(caption) ? (
				<RichText.Content
					className="ghostkit-gif-caption"
					tagName="figcaption"
					value={caption}
				/>
			) : null}
		</figure>
	);
}
