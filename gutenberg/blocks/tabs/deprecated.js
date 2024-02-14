import classnames from 'classnames/dedupe';

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

const { name } = metadata;

export default [
	// v3.1.2
	{
		...metadata,
		save: function BlockSave(props) {
			const {
				tabActive,
				trigger,
				buttonsVerticalAlign,
				buttonsAlign,
				tabsData = [],
			} = props.attributes;

			let className = classnames(
				'ghostkit-tabs',
				buttonsVerticalAlign && 'ghostkit-tabs-buttons-vertical',
				trigger && `ghostkit-tabs-buttons-trigger-${trigger}`
			);

			className = applyFilters('ghostkit.blocks.className', className, {
				...{ name },
				...props,
			});

			const blockProps = useBlockProps.save({
				className,
				'data-tab-active': tabActive,
			});
			const innerBlockProps = useInnerBlocksProps.save({
				className: 'ghostkit-tabs-content',
			});

			return (
				<div {...blockProps}>
					<div
						className={classnames(
							'ghostkit-tabs-buttons',
							`ghostkit-tabs-buttons-align-${buttonsAlign}`
						)}
					>
						{tabsData.map((tabData) => (
							<RichText.Content
								tagName="a"
								href={`#${tabData.slug}`}
								className="ghostkit-tabs-buttons-item"
								key={`tab_button_${tabData.slug}`}
								value={tabData.title}
							/>
						))}
					</div>
					<div {...innerBlockProps} />
				</div>
			);
		},
	},
];
