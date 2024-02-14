import classnames from 'classnames/dedupe';

import { InnerBlocks, RichText } from '@wordpress/block-editor';
import { Component } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

const { name } = metadata;

export default [
	// v2.23.2
	{
		...metadata,
		attributes: {
			number: {
				type: 'string',
				source: 'html',
				selector: '.ghostkit-counter-box-number-wrap',
				default: '77',
			},
			animateInViewport: {
				type: 'boolean',
				default: false,
			},
			animateInViewportFrom: {
				type: 'number',
				default: 0,
			},
			numberPosition: {
				type: 'string',
				default: 'top',
			},
			numberSize: {
				type: 'number',
			},
			showContent: {
				type: 'boolean',
				default: true,
			},
			numberColor: {
				type: 'string',
			},
			hoverNumberColor: {
				type: 'string',
			},
			url: {
				type: 'string',
			},
			target: {
				type: 'string',
			},
			rel: {
				type: 'string',
			},
		},
		save: class BlockSave extends Component {
			render() {
				const {
					number,
					animateInViewport,
					numberPosition,
					showContent,
					url,
					target,
					rel,
				} = this.props.attributes;

				let { animateInViewportFrom } = this.props.attributes;

				animateInViewportFrom = parseFloat(animateInViewportFrom);

				let className = classnames(
					'ghostkit-counter-box',
					url && 'ghostkit-counter-box-with-link'
				);
				className = applyFilters(
					'ghostkit.blocks.className',
					className,
					{
						name,
						...this.props,
					}
				);

				const classNameNumber = classnames(
					'ghostkit-counter-box-number',
					`ghostkit-counter-box-number-align-${
						numberPosition || 'left'
					}`
				);

				return (
					<div className={className}>
						{url ? (
							<a
								className="ghostkit-counter-box-link"
								href={url}
								target={target || false}
								rel={rel || false}
							>
								<span />
							</a>
						) : null}
						<div className={classNameNumber}>
							<RichText.Content
								tagName="div"
								className={`ghostkit-counter-box-number-wrap${
									animateInViewport
										? ' ghostkit-count-up'
										: ''
								}`}
								value={number}
								{...{
									'data-count-from':
										animateInViewport &&
										animateInViewportFrom
											? animateInViewportFrom
											: null,
								}}
							/>
						</div>
						{showContent ? (
							<div className="ghostkit-counter-box-content">
								<InnerBlocks.Content />
							</div>
						) : null}
					</div>
				);
			}
		},
	},
];
