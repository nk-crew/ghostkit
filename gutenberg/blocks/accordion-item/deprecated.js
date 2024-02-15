import classnames from 'classnames/dedupe';

import {
	InnerBlocks,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { Component } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

const { name } = metadata;

export default [
	// v3.1.2
	{
		...metadata,
		save: function BlockSave(props) {
			const { attributes } = props;
			const { heading, active, slug, titleTag } = attributes;

			let className = classnames(
				'ghostkit-accordion-item',
				active && 'ghostkit-accordion-item-active'
			);

			className = applyFilters('ghostkit.blocks.className', className, {
				name,
				...props,
			});

			const TitleTag = titleTag || 'div';

			const blockProps = useBlockProps.save({
				className,
			});
			const innerBlocksProps = useInnerBlocksProps.save({
				className: 'ghostkit-accordion-item-content',
			});

			return (
				<div {...blockProps}>
					<TitleTag className="ghostkit-accordion-item-heading">
						<a href={`#${slug}`}>
							<RichText.Content
								className="ghostkit-accordion-item-label"
								tagName="span"
								value={heading}
							/>
							<span className="ghostkit-accordion-item-collapse">
								<svg
									className="ghostkit-svg-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9.21967 6.2197C9.51256 5.9268 9.98744 5.9268 10.2803 6.2197L15.5303 11.4697C15.8232 11.7626 15.8232 12.2374 15.5303 12.5303L10.2803 17.7803C9.98744 18.0732 9.51256 18.0732 9.21967 17.7803C8.92678 17.4874 8.92678 17.0126 9.21967 16.7197L13.9393 12L9.21967 7.2803C8.92678 6.9874 8.92678 6.5126 9.21967 6.2197Z"
										fill="currentColor"
									/>
								</svg>
							</span>
						</a>
					</TitleTag>
					<div {...innerBlocksProps} />
				</div>
			);
		},
	},
	// v2.25.0
	{
		...metadata,
		save: class BlockSave extends Component {
			render() {
				const { attributes } = this.props;
				const { heading, active, slug } = attributes;

				let className = classnames(
					'ghostkit-accordion-item',
					active && 'ghostkit-accordion-item-active'
				);

				className = applyFilters(
					'ghostkit.blocks.className',
					className,
					{
						name,
						...this.props,
					}
				);

				return (
					<div className={className}>
						<a
							href={`#${slug}`}
							className="ghostkit-accordion-item-heading"
						>
							<RichText.Content
								className="ghostkit-accordion-item-label"
								tagName="span"
								value={heading}
							/>
							<span className="ghostkit-accordion-item-collapse">
								<svg
									className="ghostkit-svg-icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9.21967 6.2197C9.51256 5.9268 9.98744 5.9268 10.2803 6.2197L15.5303 11.4697C15.8232 11.7626 15.8232 12.2374 15.5303 12.5303L10.2803 17.7803C9.98744 18.0732 9.51256 18.0732 9.21967 17.7803C8.92678 17.4874 8.92678 17.0126 9.21967 16.7197L13.9393 12L9.21967 7.2803C8.92678 6.9874 8.92678 6.5126 9.21967 6.2197Z"
										fill="currentColor"
									/>
								</svg>
							</span>
						</a>
						<div className="ghostkit-accordion-item-content">
							<InnerBlocks.Content />
						</div>
					</div>
				);
			}
		},
	},
];
