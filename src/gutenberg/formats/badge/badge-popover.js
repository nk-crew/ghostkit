/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { URLPopover } = wp.blockEditor;

/**
 * Get selected badge element.
 *
 * @return {DOM} element.
 */
function getSelectedBadge() {
    const selection = window.getSelection();

    // Unlikely, but in the case there is no selection, return empty styles so
    // as to avoid a thrown error by `Selection#getRangeAt` on invalid index.
    if ( 0 === selection.rangeCount ) {
        return false;
    }

    const range = selection.getRangeAt( 0 );

    let $selectedNode = range.startContainer;

    // If the caret is right before the element, select the next element.
    $selectedNode = $selectedNode.nextElementSibling || $selectedNode;

    while ( $selectedNode.nodeType !== window.Node.ELEMENT_NODE ) {
        $selectedNode = $selectedNode.parentNode;
    }

    const $badge = $selectedNode.closest( '.ghostkit-badge' );

    return $badge;
}

/**
 * Returns a style object for applying as `position: absolute` for an element
 * relative to the bottom-center of the current selection. Includes `top` and
 * `left` style properties.
 *
 * @return {Object} Style object.
 */
function getCurrentCaretPositionStyle() {
    const $badge = getSelectedBadge();

    if ( ! $badge ) {
        return {};
    }

    return $badge.getBoundingClientRect();
}

/**
 * Component which renders itself positioned under the current caret selection.
 * The position is calculated at the time of the component being mounted, so it
 * should only be mounted after the desired selection has been made.
 *
 * @type {WPComponent}
 */
class BadgePopover extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            rect: getCurrentCaretPositionStyle(),
        };
    }

    render() {
        const { children } = this.props;
        const { rect } = this.state;

        return (
            <URLPopover
                className="ghostkit-format-badge-popover"
                anchorRect={ rect }
            >
                { children }
            </URLPopover>
        );
    }
}

export { BadgePopover, getSelectedBadge };
