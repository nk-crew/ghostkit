import classnames from 'classnames/dedupe';

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes } = props;
	let { className = '' } = props;

	const { version, date } = attributes;

	className = classnames('ghostkit-changelog', className);

	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });
	const innerBlockProps = useInnerBlocksProps(
		{
			className: 'ghostkit-changelog-inner',
		},
		{
			templateLock: false,
			template: [
				[
					'core/list',
					{
						className: 'is-style-none',
					},
					[
						[
							'core/list-item',
							{
								content: `<span class="ghostkit-badge" style="background: #4ab866">${__('Added', 'ghostkit')}</span>${__('Something', 'ghostkit')}`,
							},
						],
						[
							'core/list-item',
							{
								content: `<span class="ghostkit-badge" style="background: #0366d6">${__('Fixed', 'ghostkit')}</span>${__('Something', 'ghostkit')}`,
							},
						],
						[
							'core/list-item',
							{
								content: `<span class="ghostkit-badge" style="background: #4ab866">${__('Improved', 'ghostkit')}</span>${__('Something', 'ghostkit')}`,
							},
						],
					],
				],
			],
		}
	);

	return (
		<div {...blockProps}>
			<div className="ghostkit-changelog-version">
				<RichText
					inlineToolbar
					tagName="span"
					placeholder={__('1.0.0', 'ghostkit')}
					value={version}
					onChange={(value) => setAttributes({ version: value })}
				/>
			</div>
			<div className="ghostkit-changelog-date">
				<RichText
					inlineToolbar
					tagName="h2"
					placeholder={new Date().toLocaleDateString()}
					value={date}
					onChange={(value) => setAttributes({ date: value })}
					style={{ margin: 0 }}
				/>
			</div>
			<div className="ghostkit-changelog-more">
				<div {...innerBlockProps} />
			</div>
		</div>
	);
}
