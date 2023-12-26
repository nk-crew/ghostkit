import { useCachedTruthy } from '@wordpress/block-editor';
import { Popover } from '@wordpress/components';
import { useAnchor } from '@wordpress/rich-text';

/**
 * Component which renders itself positioned under the current caret selection.
 * The position is calculated at the time of the component being mounted, so it
 * should only be mounted after the desired selection has been made.
 *
 * @param props
 */
export default function BadgePopover(props) {
	const { children, contentRef, settings } = props;

	const popoverAnchor = useCachedTruthy(
		useAnchor({
			editableContentElement: contentRef.current,
			settings,
		})
	);

	return (
		<Popover
			className="ghostkit-format-badge-popover ghostkit-component-color-picker__dropdown-content"
			anchor={popoverAnchor}
		>
			{children}
		</Popover>
	);
}
