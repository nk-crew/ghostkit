import classnames from 'classnames/dedupe';

import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';

const { GHOSTKIT } = window;

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { setAttributes, attributes } = props;

	let { className } = props;

	const { id } = attributes;

	className = classnames('ghostkit-widgetized-area', className);

	const blockProps = useBlockProps({ className });

	return (
		<div {...blockProps}>
			<Placeholder
				icon={getIcon('block-widgetized-area')}
				label={__('Widgetized Area', 'ghostkit')}
			>
				<SelectControl
					value={id}
					onChange={(value) => setAttributes({ id: value })}
					options={(() => {
						const sidebars = [
							{
								label: __('--- Select Sidebar ---', 'ghostkit'),
								value: '',
							},
						];

						if (GHOSTKIT.sidebars) {
							Object.keys(GHOSTKIT.sidebars).forEach((k) => {
								sidebars.push({
									label: GHOSTKIT.sidebars[k].name,
									value: GHOSTKIT.sidebars[k].id,
								});
							});
						}

						return sidebars;
					})()}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</Placeholder>
		</div>
	);
}
