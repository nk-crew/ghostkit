import classnames from 'classnames/dedupe';

import metadata from './block.json';

const { name } = metadata;

import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

/**
 * Block Save Class.
 *
 * @param props
 */
export default function BlockSave(props) {
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
				role="tablist"
				aria-orientation={
					buttonsVerticalAlign ? 'vertical' : 'horizontal'
				}
			>
				{tabsData.map((tabData) => (
					<RichText.Content
						tagName="button"
						id={`${tabData.slug}-button`}
						className={classnames(
							'ghostkit-tabs-buttons-item',
							tabActive === tabData.slug &&
								'ghostkit-tabs-buttons-item-active'
						)}
						type="button"
						role="tab"
						data-tab={tabData.slug}
						aria-controls={`${tabData.slug}-content`}
						aria-selected={
							tabActive === tabData.slug ? 'true' : false
						}
						key={`tab_button_${tabData.slug}`}
						value={tabData.title}
					/>
				))}
			</div>
			<div {...innerBlockProps} />
		</div>
	);
}
