import classnames from 'classnames/dedupe';
import { merge } from 'lodash';
import { debounce } from 'throttle-debounce';

import apiFetch from '@wordpress/api-fetch';
import { registerCoreBlocks } from '@wordpress/block-library';
import { getBlockTypes, getCategories } from '@wordpress/blocks';
import { Dashicon, ToggleControl, Tooltip } from '@wordpress/components';
import { Component, createElement, renderToString } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import Info from '../components/info';

const { GHOSTKIT } = window;

// register core Gutenberg blocks.
registerCoreBlocks();

export default class Blocks extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeCategory: false,
			disabledBlocks: GHOSTKIT.disabledBlocks || {},
		};

		this.updateDisabledBlocks = this.updateDisabledBlocks.bind(this);
		this.updateDisabledBlocksDebounce = debounce(
			1000,
			this.updateDisabledBlocksDebounce.bind(this)
		);
		this.getBlocksCategories = this.getBlocksCategories.bind(this);
		this.getBlocksFromCategory = this.getBlocksFromCategory.bind(this);
		this.getDisabledBlock = this.getDisabledBlock.bind(this);
		this.setDisabledBlock = this.setDisabledBlock.bind(this);
		this.setDisabledAllBlocks = this.setDisabledAllBlocks.bind(this);
		this.getDisabledCount = this.getDisabledCount.bind(this);
	}

	componentDidMount() {
		const categories = this.getBlocksCategories();

		this.setState({
			activeCategory: categories[0].slug,
		});
	}

	getDisabledBlock(data) {
		let result = false;

		if (typeof this.state.disabledBlocks[data.name] !== 'undefined') {
			result = this.state.disabledBlocks[data.name];
		}

		return result;
	}

	setDisabledAllBlocks(disabled) {
		const { activeCategory } = this.state;

		const disabledBlocks = {};

		const blocks = this.getBlocksFromCategory(activeCategory);
		Object.keys(blocks).forEach((name) => {
			const block = blocks[name];
			disabledBlocks[block.name] = !disabled;
		});

		this.updateDisabledBlocks(disabledBlocks);
	}

	setDisabledBlock(data) {
		this.updateDisabledBlocks({
			[data.name]: !this.getDisabledBlock(data),
		});
	}

	getDisabledCount(blocks) {
		let result = 0;

		Object.keys(blocks).forEach((name) => {
			if (this.getDisabledBlock(blocks[name])) {
				result += 1;
			}
		});

		return result;
	}

	getBlocksCategories() {
		const categories = getCategories();
		const result = [];

		categories.forEach((cat) => {
			const blocks = this.getBlocksFromCategory(cat.slug);

			if (Object.keys(blocks).length) {
				result.push(cat);
			}
		});

		return result;
	}

	getBlocksFromCategory(category) {
		const result = {};

		if (category) {
			const blocks = getBlockTypes();
			blocks.forEach((block) => {
				if (
					// blocks from needed category only
					block.category === category &&
					// prevent adding blocks with parent option (fe Grid Column).
					!(block.parent && block.parent.length) &&
					// prevent showing blocks with disabled inserter.
					!(
						block.supports &&
						typeof block.supports.inserter !== 'undefined' &&
						!block.supports.inserter
					)
				) {
					let icon = block.icon.src ? block.icon.src : block.icon;

					// Prepare icon.
					if (typeof icon === 'function') {
						icon = renderToString(icon());
					} else if (typeof icon === 'object') {
						icon = renderToString(icon);
					} else if (typeof icon === 'string') {
						icon = createElement(Dashicon, { icon });
						icon = renderToString(icon);
					}

					result[block.name] = {
						...block,
						...{ icon },
					};
				}
			});
		}

		return result;
	}

	updateDisabledBlocksDebounce() {
		apiFetch({
			path: '/ghostkit/v1/update_disabled_blocks',
			method: 'POST',
			data: {
				blocks: this.state.disabledBlocks,
			},
		}).then((result) => {
			if (!result.success || !result.response) {
				// eslint-disable-next-line no-console
				console.log(result);
			}
		});
	}

	updateDisabledBlocks(newBlocks) {
		this.setState(
			(prevState) => ({
				disabledBlocks: merge({}, prevState.disabledBlocks, newBlocks),
			}),
			() => {
				this.updateDisabledBlocksDebounce();
			}
		);
	}

	render() {
		const { activeCategory, disabledBlocks } = this.state;

		const blocks = this.getBlocksFromCategory(activeCategory);
		const categories = this.getBlocksCategories();
		const resultTabs = [];
		const resultBlocks = [];

		let count = 0;
		const disabledCount = this.getDisabledCount(blocks);

		// category content.
		Object.keys(blocks).forEach((name) => {
			const block = blocks[name];

			count += 1;

			resultBlocks.push(
				<li
					className={classnames(
						'ghostkit-settings-blocks-item',
						disabledBlocks[block.name]
							? 'ghostkit-settings-blocks-item-disabled'
							: ''
					)}
					key={block.name}
				>
					<h3>
						<span
							className="ghostkit-settings-blocks-item-icon"
							dangerouslySetInnerHTML={{ __html: block.icon }}
						/>
						{block.title}
					</h3>
					{block.description ? (
						<div className="ghostkit-settings-blocks-item-description">
							{block.description}
						</div>
					) : null}
					{block.ghostkit && block.ghostkit.previewUrl ? (
						<div className="ghostkit-settings-blocks-item-preview-url">
							<a href={block.ghostkit.previewUrl}>
								{__('Preview', 'ghostkit')}
							</a>
						</div>
					) : null}
					<Tooltip
						text={
							this.getDisabledBlock(block)
								? __('Enable Block', 'ghostkit')
								: __('Disable Block', 'ghostkit')
						}
					>
						<div className="ghostkit-settings-blocks-item-check">
							<ToggleControl
								checked={!this.getDisabledBlock(block)}
								onChange={() => {
									this.setDisabledBlock(block);
								}}
								__nextHasNoMarginBottom
							/>
						</div>
					</Tooltip>
				</li>
			);
		});

		// categories tabs.
		categories.forEach((cat) => {
			const disabledCurrentCount = this.getDisabledCount(
				this.getBlocksFromCategory(cat.slug)
			);
			let categoryButton = (
				<button
					className={classnames(
						'ghostkit-settings-blocks-categories-button',
						activeCategory === cat.slug
							? 'ghostkit-settings-blocks-categories-button-active'
							: ''
					)}
					onClick={() => {
						this.setState({
							activeCategory: cat.slug,
						});
					}}
				>
					{cat.title}
					{disabledCurrentCount ? (
						<span className="ghostkit-settings-blocks-categories-button-indicator" />
					) : null}
				</button>
			);

			if (disabledCurrentCount) {
				categoryButton = (
					<Tooltip
						text={sprintf(
							__('Disabled Blocks: %s', 'ghostkit'),
							disabledCurrentCount
						)}
						key="tab-disabled-blocks"
					>
						{categoryButton}
					</Tooltip>
				);
			}

			resultTabs.push(<li key={`tab-${cat.slug}`}>{categoryButton}</li>);
		});

		if (!count) {
			resultBlocks.push(
				<Info key="no-blocks">
					{__('No blocks in selected category.', 'ghostkit')}
				</Info>
			);
		}

		return (
			<div className="ghostkit-settings-content-wrapper ghostkit-settings-blocks">
				<div className="ghostkit-settings-blocks-left">
					<ul className="ghostkit-settings-blocks-categories">
						{resultTabs}
					</ul>
				</div>
				<div className="ghostkit-settings-blocks-right">
					{count ? (
						<div className="ghostkit-settings-blocks-items-head">
							<span className="ghostkit-settings-blocks-items-head-count">
								{sprintf(__('Blocks: %s', 'ghostkit'), count)}
							</span>
							<Tooltip
								text={
									disabledCount !== count
										? __('Disable All Blocks', 'ghostkit')
										: __('Enable All Blocks', 'ghostkit')
								}
							>
								<div
									className={classnames(
										'ghostkit-settings-blocks-all-check',
										disabledCount !== 0 &&
											disabledCount !== count
											? 'ghostkit-settings-blocks-check-gray'
											: ''
									)}
								>
									<ToggleControl
										checked={disabledCount !== count}
										onChange={() => {
											this.setDisabledAllBlocks(
												!(disabledCount !== count)
											);
										}}
										__nextHasNoMarginBottom
									/>
								</div>
							</Tooltip>
						</div>
					) : null}
					<ul className="ghostkit-settings-blocks-items">
						{resultBlocks}
					</ul>
				</div>
			</div>
		);
	}
}
