import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import getIcon from '../../utils/get-icon';

/**
 * Block Edit Class.
 */
export default function BlockEdit() {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<Placeholder
				icon={getIcon('block-twitter')}
				label={__('Twitter', 'ghostkit')}
				instructions={__(
					'Twitter retired the API this block used, so the block shows nothing on the site. You can remove it.',
					'ghostkit'
				)}
			/>
		</div>
	);
}
