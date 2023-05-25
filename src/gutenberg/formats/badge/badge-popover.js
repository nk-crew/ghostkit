/**
 * WordPress dependencies
 */
const { Popover } = wp.components;

const { useAnchor } = wp.richText;

const { useCachedTruthy } = wp.blockEditor;

/**
 * Component which renders itself positioned under the current caret selection.
 * The position is calculated at the time of the component being mounted, so it
 * should only be mounted after the desired selection has been made.
 */
export function BadgePopover(props) {
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
