import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Disabled,
	PanelBody,
	Placeholder,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { RawHTML, useMemo, useRef } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames/dedupe';

import getIcon from '../../utils/get-icon';
import getAllHeadings from './get-all-headings';

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const oldTocHTML = useRef();

	let { className } = props;

	const { setAttributes, attributes, isSelected } = props;

	const { title, allowedHeaders, listStyle } = attributes;

	// `getAllHeadings` builds a new array on every call, so deriving it inside the
	// selector would hand `useSelect` a fresh identity each run and force a re-render.
	const blocks = useSelect(
		(select) => select('core/block-editor').getBlocks(),
		[]
	);

	const headings = useMemo(
		() => getAllHeadings(blocks, allowedHeaders),
		[blocks, allowedHeaders]
	);

	const tocHTML = useSelect(
		(select) =>
			select('ghostkit/blocks/table-of-contents').getTOC({
				headings,
				allowedHeaders,
				listStyle,
			}),
		[headings, allowedHeaders, listStyle]
	);

	className = classnames('ghostkit-toc', className);
	className = applyFilters('ghostkit.editor.className', className, props);

	// Save old toc HTML.
	if (
		headings &&
		headings.length &&
		tocHTML &&
		(!oldTocHTML.current || oldTocHTML.current !== tocHTML)
	) {
		oldTocHTML.current = tocHTML;
	}

	const blockProps = useBlockProps({ className });

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody>
					<SelectControl
						label={__('Allowed Headers', 'ghostkit')}
						value={allowedHeaders}
						options={[
							{
								value: 1,
								label: __('Heading 1', 'ghostkit'),
							},
							{
								value: 2,
								label: __('Heading 2', 'ghostkit'),
							},
							{
								value: 3,
								label: __('Heading 3', 'ghostkit'),
							},
							{
								value: 4,
								label: __('Heading 4', 'ghostkit'),
							},
							{
								value: 5,
								label: __('Heading 5', 'ghostkit'),
							},
							{
								value: 6,
								label: __('Heading 6', 'ghostkit'),
							},
						]}
						onChange={(val) => {
							setAttributes({
								allowedHeaders: val.map((level) =>
									parseInt(level, 10)
								),
							});
						}}
						multiple
					/>
					<SelectControl
						label={__('List Style', 'ghostkit')}
						value={listStyle}
						options={[
							{
								value: 'ol',
								label: __('Numbered List', 'ghostkit'),
							},
							{
								value: 'ul',
								label: __('Dotted List', 'ghostkit'),
							},
							{
								value: 'ol-styled',
								label: __('Numbered List Styled', 'ghostkit'),
							},
							{
								value: 'ul-styled',
								label: __('Dotted List Styled', 'ghostkit'),
							},
						]}
						onChange={(val) => setAttributes({ listStyle: val })}
					/>
				</PanelBody>
			</InspectorControls>
			{headings && headings.length ? (
				<>
					{!RichText.isEmpty(title) || isSelected ? (
						<RichText
							inlineToolbar
							tagName="h5"
							className="ghostkit-toc-title"
							placeholder={__('Write title…', 'ghostkit')}
							format="string"
							value={title}
							onChange={(val) => setAttributes({ title: val })}
						/>
					) : null}
					{!tocHTML ? (
						<div
							className={classnames(
								'ghostkit-toc-spinner',
								!tocHTML &&
									!oldTocHTML.current &&
									'ghostkit-toc-spinner-relative'
							)}
						>
							<Spinner />
						</div>
					) : null}
					{tocHTML || oldTocHTML.current ? (
						<Disabled>
							<div className="ghostkit-toc-list block-library-list">
								<RawHTML>
									{tocHTML || oldTocHTML.current}
								</RawHTML>
							</div>
						</Disabled>
					) : null}
				</>
			) : (
				<Placeholder
					icon={getIcon('block-table-of-contents')}
					label={__('Table of Contents', 'ghostkit')}
					instructions={__(
						'Start adding Heading blocks to create a table of contents. Headings with HTML anchors will be linked here.',
						'ghostkit'
					)}
				/>
			)}
		</div>
	);
}
